package ua.kiev.minaeva.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import ua.kiev.minaeva.entity.Book;
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
    public List<Book> getAllBooks() {
        log.info("handling get all books request");
        return bookService.getAll();
    }

    @GetMapping("/books/{id}")
    public Book getBookById(@PathParam("id") Long bookId) throws BoobookValidationException {
        log.info("handling get book by id request: " + bookId);
        return bookService.getById(bookId);
    }

}
