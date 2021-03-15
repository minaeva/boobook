package ua.kiev.minaeva.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.mapstruct.factory.Mappers;
import org.springframework.web.bind.annotation.*;
import ua.kiev.minaeva.config.jwt.JwtProvider;
import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.entity.RegistrationType;
import ua.kiev.minaeva.exception.BoobookAlreadyExistsException;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.exception.BoobookUnauthorizedException;
import ua.kiev.minaeva.exception.BoobookValidationException;
import ua.kiev.minaeva.mapper.ReaderRegistrationMapper;
import ua.kiev.minaeva.service.ReaderService;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Optional;

import static ua.kiev.minaeva.controller.helper.JwtHelper.AUTHORIZATION;
import static ua.kiev.minaeva.controller.helper.JwtHelper.getJwtFromString;
import static ua.kiev.minaeva.controller.helper.RegistrationRequestValidator.validateGoogleIdToken;
import static ua.kiev.minaeva.controller.helper.RegistrationRequestValidator.validateRegistrationRequest;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Log
@CrossOrigin
public class AuthController {

    private final ReaderService readerService;
    private final JwtProvider jwtProvider;

    private ReaderRegistrationMapper mapper = Mappers.getMapper(ReaderRegistrationMapper.class);

    @PostMapping("/register")
    public RegistrationResponse registerReader(@RequestBody RegistrationRequest request) throws BoobookAlreadyExistsException, BoobookValidationException {
        log.info("handling register boobook user request: " + request);

        if (!RegistrationType.CUSTOM.equals(request.getRegistrationType())) {
            throw new BoobookValidationException("Custom registration type of request expected");
        }

        validateRegistrationRequest(request);
        ReaderDto readerDto = mapper.requestToReaderDto(request);
        readerService.createReader(readerDto);

        String jwt = jwtProvider.generateToken(request.getEmail());
        return new RegistrationResponse(jwt, request.getEmail());
    }

    @PostMapping("/google")
    public AuthResponse loginGoogleUser(@RequestBody GoogleRegistrationRequest request) throws BoobookValidationException, BoobookNotFoundException, BoobookUnauthorizedException {
        log.info("handling register google user request: " + request);

        if (!RegistrationType.GOOGLE.equals(request.getRegistrationType())) {
            throw new BoobookValidationException("Google registration type of request expected");
        }
        try {
            ReaderDto readerDto = validateGoogleIdToken(request.getGoogleIdToken());
            readerService.createGoogleReader(readerDto);
        } catch (GeneralSecurityException e) {
            throw new BoobookValidationException("Google Token is not valid ");
        } catch (IOException e) {
            throw new BoobookValidationException("IOException occurred " + e);
        }
        ReaderDto readerDto = Optional
                .ofNullable(readerService.getByEmail(request.getEmail()))
                .orElseThrow(() -> new BoobookUnauthorizedException("Reader not found"));

        String jwt = jwtProvider.generateToken(request.getEmail());
        return new AuthResponse(jwt, readerDto.getId(), readerDto.getEmail());
    }

    @PostMapping("/auth")
    public AuthResponse authenticate(@RequestBody AuthRequest authRequest)
            throws BoobookNotFoundException, BoobookUnauthorizedException {
        log.info("handling authenticate reader request: " + authRequest);
        ReaderDto readerDto = Optional
                .ofNullable(readerService.getByEmailAndPassword(authRequest.getEmail(), authRequest.getPassword()))
                .orElseThrow(() -> new BoobookUnauthorizedException("Reader not found"));

        String jwt = jwtProvider.generateToken(readerDto.getEmail());
        return new AuthResponse(jwt, readerDto.getId(), readerDto.getEmail());
    }

    @GetMapping("/jwt")
    public ReaderDto getUserByJwt(@RequestHeader(AUTHORIZATION) String jwtWithBearer) throws BoobookNotFoundException
            , BoobookUnauthorizedException {
        log.info("handling getUserByJwt request: " + jwtWithBearer);
        String jwt = getJwtFromString(jwtWithBearer);

        if (jwt != null && jwtProvider.validateToken(jwt)) {
            String email = jwtProvider.getEmailFromToken(jwt);
            return readerService.getByEmail(email);
        }
        throw new BoobookUnauthorizedException("JWT is not correct");
    }

}
