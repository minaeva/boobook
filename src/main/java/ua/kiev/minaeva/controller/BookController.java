package ua.kiev.minaeva.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.web.bind.annotation.*;
import ua.kiev.minaeva.dto.BookDto;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.exception.BoobookValidationException;
import ua.kiev.minaeva.service.BookService;

import java.util.List;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
@Log
@CrossOrigin
public class BookController {

    private final BookService bookService;

    @GetMapping
    public List<BookDto> getAllBooks() {
        log.info("handling GET ALL books request");
        return bookService.getAll();
    }

    @GetMapping("/{bookId}")
    public BookDto getBookById(@PathVariable final Long bookId) throws BoobookNotFoundException {
        log.info("handling GET BOOK BY ID request: " + bookId);
        return bookService.getById(bookId);
    }

    @GetMapping("/title/{title}")
    public List<BookDto> getByTitle(@PathVariable final String title) throws BoobookNotFoundException {
        log.info("handling GET BOOK BY TITLE request: " + title);
        return bookService.getByTitle(title);
    }

    @GetMapping("/author/{authorId}")
    public List<BookDto> getByAuthor(@PathVariable final Long authorId) throws BoobookNotFoundException {
        log.info("handling GET BOOK BY AUTHOR request: " + authorId);
        return bookService.getByAuthor(authorId);
    }

    @PostMapping
    public BookDto createBook(@RequestBody BookDto bookDto) throws BoobookValidationException {
        log.info("handling CREATE BOOK request: " + bookDto);
        return bookService.createBook(bookDto);
    }

}
