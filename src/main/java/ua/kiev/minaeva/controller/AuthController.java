package ua.kiev.minaeva.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.mapstruct.factory.Mappers;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ua.kiev.minaeva.config.jwt.JwtProvider;
import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.entity.RegistrationType;
import ua.kiev.minaeva.exception.BoobookUnauthorizedException;
import ua.kiev.minaeva.exception.BoobookValidationException;
import ua.kiev.minaeva.mapper.ReaderRegistrationMapper;
import ua.kiev.minaeva.service.ReaderService;

import javax.validation.Valid;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@Log
@CrossOrigin
public class AuthController {

    private final ReaderService readerService;
    private final JwtProvider jwtProvider;
    private ReaderRegistrationMapper mapper = Mappers.getMapper(ReaderRegistrationMapper.class);

    @PostMapping("/users/register")
    public RegistrationResponse registerReader(@RequestBody @Valid RegistrationRequest request) throws BoobookValidationException {
        log.info("handling register reader request: " + request);

        ReaderDto readerDto = mapper.requestToReaderDto(request);
        readerService.createReader(readerDto);

        if (RegistrationType.FB.equals(request.getRegistrationType())) {
            String token = jwtProvider.generateToken(readerDto.getLogin());
            return new RegistrationResponse(token, readerDto.getLogin(), readerDto.getEmail());
        }
        return new RegistrationResponse();
    }

    @PostMapping("/users/auth")
    public AuthResponse authenticate(@RequestBody AuthRequest authRequest) throws BoobookUnauthorizedException {
        log.info("handling authenticate reader request: " + authRequest);
        ReaderDto readerDto = Optional
                .of(readerService.getByLoginAndPassword(authRequest.getLogin(), authRequest.getPassword()))
                .orElseThrow(() -> new BoobookUnauthorizedException("Reader not found"));

        String token = jwtProvider.generateToken(readerDto.getLogin());
        return new AuthResponse(token, readerDto.getId(), readerDto.getEmail());
    }

}
