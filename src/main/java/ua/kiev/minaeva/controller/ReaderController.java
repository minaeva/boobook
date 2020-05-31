package ua.kiev.minaeva.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.web.bind.annotation.*;
import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.entity.Reader;
import ua.kiev.minaeva.exception.BoobookValidationException;
import ua.kiev.minaeva.service.ReaderService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Log
public class ReaderController {

    private final ReaderService readerService;

    @PostMapping("/users")
    public Reader createReader(@RequestBody ReaderDto readerDto) throws BoobookValidationException {
        log.info("handling create reader request: " + readerDto);
        return readerService.createReader(readerDto);
    }

    @GetMapping("/users/login")
    public ReaderDto getByLogin(String login) {
        log.info("handling get reader by login request: " + login);
        return readerService.getByLogin(login);
    }

    @GetMapping("/users")
    public List<ReaderDto> getAllReaders() {
        log.info("handling get all readers request");
        return readerService.getAll();
    }

}
