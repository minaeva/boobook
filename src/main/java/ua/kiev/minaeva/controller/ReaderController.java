package ua.kiev.minaeva.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.web.bind.annotation.*;
import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.exception.BoobookValidationException;
import ua.kiev.minaeva.service.FriendshipService;
import ua.kiev.minaeva.service.ReaderService;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Log
@CrossOrigin
public class ReaderController {

    private final ReaderService readerService;
    private final FriendshipService friendshipService;

    @PostMapping
    public ReaderDto createReader(@RequestBody ReaderDto readerDto) throws BoobookValidationException {
        log.info("handling create reader request: " + readerDto);
        return readerService.createReader(readerDto);
    }

    @GetMapping("/login")
    public ReaderDto getByLogin(String login) throws BoobookNotFoundException {
        log.info("handling get reader by login request: " + login);
        return readerService.getByLogin(login);
    }

    @GetMapping
    public List<ReaderDto> getAllReaders() {
        log.info("handling get all readers request");
        return readerService.getAll();
    }

    @GetMapping("/{id}")
    public ReaderDto getById(@PathVariable final Long id) throws BoobookNotFoundException {
        log.info("handling get reader by id request: " + id);
        return readerService.getById(id);
    }

    @GetMapping("/friends/{id}")
    public List<ReaderDto> getFriends(@PathVariable final Long id) throws BoobookNotFoundException {
        log.info("handling get readers' friends request");
        return friendshipService.getFriendsByReaderId(id);
    }
}
