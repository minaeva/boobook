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

    @GetMapping("/owner/{ownerId}")
    public List<BookDto> getByOwner(@PathVariable final Long ownerId) throws BoobookNotFoundException {
        log.info("handling GET BOOK BY OWNER request: " + ownerId);
        return bookService.getByOwner(ownerId);
    }

    @GetMapping("/owner/active/{ownerId}")
    public List<BookDto> getByOwnerActive(@PathVariable final Long ownerId) throws BoobookNotFoundException {
        log.info("handling GET BOOK BY OWNER request: " + ownerId);
        return bookService.getByOwnerActive(ownerId);
    }

    @PostMapping
    public BookDto createBook(@RequestBody BookDto bookDto) throws BoobookValidationException, BoobookNotFoundException {
        log.info("handling CREATE BOOK request: " + bookDto);
        return bookService.createBook(bookDto);
    }

    @PutMapping
    public BookDto updateBook(@RequestBody BookDto bookDto) throws BoobookValidationException, BoobookNotFoundException {
        log.info("handling UPDATE BOOK request: " + bookDto);
        return bookService.updateBook(bookDto);
    }

    @PostMapping("/setInactive/{bookId}")
    public BookDto setInactive(@PathVariable final Long bookId) throws BoobookNotFoundException {
        log.info("handling SET BOOK INACTIVE request: " + bookId);
        return bookService.setInactive(bookId);
    }

    @PostMapping("/setActive/{bookId}")
    public BookDto setActive(@PathVariable final Long bookId) throws BoobookNotFoundException {
        log.info("handling SET BOOK ACTIVE request: " + bookId);
        return bookService.setActive(bookId);
    }

    @GetMapping("/search")
    public List<BookDto> getByQuery(
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "authorSurname", required = false) String authorSurname,
            @RequestParam(value = "ageGroup", required = false) Integer ageGroup,
            @RequestParam(value = "hardCover", required = false) boolean hardCover,
            @RequestParam(value = "language", required = false) String language,
            @RequestParam(value = "illustrations", required = false) Integer illustrations,
            @RequestParam(value = "city", required = false) String city
    ) throws BoobookNotFoundException {
        log.info("handling SEARCH BOOK request, title: " + title + ", authorSurname: " + authorSurname +
                ", ageGroup: " + ageGroup + ", hardCover: " + hardCover + ", language: " + language +
                ", illustrations: " + illustrations + ", city: " + city);
        return bookService.getByQuery(title, authorSurname, ageGroup, hardCover, language, illustrations, city);
    }
}
