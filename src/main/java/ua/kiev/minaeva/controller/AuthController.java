package ua.kiev.minaeva.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ua.kiev.minaeva.config.jwt.JwtProvider;
import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.entity.RegistrationType;
import ua.kiev.minaeva.exception.BoobookUnauthorizedException;
import ua.kiev.minaeva.exception.BoobookValidationException;
import ua.kiev.minaeva.service.ReaderService;

import javax.validation.Valid;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@Log
public class AuthController {

    private final ReaderService readerService;
    private final JwtProvider jwtProvider;

    @PostMapping("/users/register")
    public ResponseEntity registerReader(@RequestBody @Valid RegistrationRequest request) throws BoobookValidationException {
        log.info("handling register reader request: " + request);

        ReaderDto readerDto = new ReaderDto();
        readerDto.setLogin(request.getLogin());
        readerDto.setPassword(request.getPassword());
        readerDto.setName(request.getName());
        readerDto.setSurname(request.getSurname());
        readerDto.setCity(request.getCity());
        readerDto.setFbPage(request.getFbPage());
        readerDto.setEmail(request.getEmail());
        readerDto.setRegistrationType(RegistrationType.CUSTOM);

        readerService.createReader(readerDto);
        return new ResponseEntity("OK", HttpStatus.OK);
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
