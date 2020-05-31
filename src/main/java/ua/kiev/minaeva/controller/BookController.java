package ua.kiev.minaeva.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ua.kiev.minaeva.dto.BookDto;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.exception.BoobookValidationException;
import ua.kiev.minaeva.service.BookService;

import javax.websocket.server.PathParam;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Log
public class BookController {

    private final BookService bookService;

    @GetMapping("/books")
    public List<BookDto> getAllBooks() {
        log.info("handling GET ALL books request");
        return bookService.getAll();
    }

    @GetMapping("/books/{id}")
    public BookDto getBookById(@PathParam("id") Long bookId) throws BoobookNotFoundException {
        log.info("handling GET BOOK BY ID request: " + bookId);
        return bookService.getById(bookId);
    }

    @GetMapping("/books/{title}")
    public List<BookDto> getByTitle(@PathParam("title") String title) throws BoobookNotFoundException {
        log.info("handling GET BOOK BY TITLE request: " + title);
        return bookService.getByTitle(title);
    }

    @GetMapping("/books/author/{id}")
    public List<BookDto> getByAuthor(@PathParam("authorId") Long authorId) throws BoobookNotFoundException {
        log.info("handling GET BOOK BY AUTHOR request: " + authorId);
        return bookService.getByAuthor(authorId);
    }

    @PostMapping("/books")
    public BookDto createBook(@RequestBody BookDto bookDto) throws BoobookValidationException {
        log.info("handling CREATE BOOK request: " + bookDto);
        return bookService.createBook(bookDto);
    }

}
