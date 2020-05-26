package ua.kiev.minaeva.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import ua.kiev.minaeva.dto.BookDto;
import ua.kiev.minaeva.entity.Book;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
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

}
