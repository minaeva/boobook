package ua.kiev.minaeva.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.mapstruct.factory.Mappers;
import org.springframework.web.bind.annotation.*;
import ua.kiev.minaeva.config.jwt.JwtProvider;
import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.entity.RegistrationType;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.exception.BoobookUnauthorizedException;
import ua.kiev.minaeva.exception.BoobookValidationException;
import ua.kiev.minaeva.mapper.ReaderRegistrationMapper;
import ua.kiev.minaeva.service.ReaderService;

import java.util.Optional;

import static ua.kiev.minaeva.controller.helper.JwtHelper.AUTHORIZATION;
import static ua.kiev.minaeva.controller.helper.JwtHelper.getJwtFromString;
import static ua.kiev.minaeva.controller.helper.RegistrationRequestValidator.validateRegistrationRequest;

@RestController
@RequiredArgsConstructor
@Log
@CrossOrigin
public class AuthController {

    private final ReaderService readerService;
    private final JwtProvider jwtProvider;

    private ReaderRegistrationMapper mapper = Mappers.getMapper(ReaderRegistrationMapper.class);

    @PostMapping("/users/register")
    public RegistrationResponse registerReader(@RequestBody RegistrationRequest request) throws BoobookValidationException {
        log.info("handling register reader request: " + request);

        validateRegistrationRequest(request);

        ReaderDto readerDto = mapper.requestToReaderDto(request);
        readerService.createReader(readerDto);

        if (RegistrationType.FB.equals(request.getRegistrationType())) {
            String jwt = jwtProvider.generateToken(readerDto.getEmail());
            return new RegistrationResponse(jwt, readerDto.getEmail());
        }
        return new RegistrationResponse();
    }

    @PostMapping("/users/auth")
    public AuthResponse authenticate(@RequestBody AuthRequest authRequest)
            throws BoobookNotFoundException, BoobookUnauthorizedException {
        log.info("handling authenticate reader request: " + authRequest);
        ReaderDto readerDto = Optional
                .ofNullable(readerService.getByEmailAndPassword(authRequest.getEmail(), authRequest.getPassword()))
                .orElseThrow(() -> new BoobookUnauthorizedException("Reader not found"));

        String jwt = jwtProvider.generateToken(readerDto.getEmail());
        return new AuthResponse(jwt, readerDto.getId(), readerDto.getEmail());
    }


    @GetMapping("/users/jwt")
    public ReaderDto getUserByJwt(@RequestHeader(AUTHORIZATION) String jwtWithBearer) throws BoobookNotFoundException, BoobookUnauthorizedException {
        log.info("handling getUserByJwt request: " + jwtWithBearer);
        String jwt = getJwtFromString(jwtWithBearer);

        if (jwt != null && jwtProvider.validateToken(jwt)) {
            String email = jwtProvider.getEmailFromToken(jwt);
            return readerService.getByEmail(email);
        }
        throw new BoobookUnauthorizedException("JWT is not correct");
    }

}
