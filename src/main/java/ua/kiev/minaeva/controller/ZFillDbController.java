package ua.kiev.minaeva.controller;

import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ua.kiev.minaeva.dto.BookDto;
import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.entity.Author;
import ua.kiev.minaeva.entity.RegistrationType;
import ua.kiev.minaeva.exception.BoobookAlreadyExistsException;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.exception.BoobookValidationException;
import ua.kiev.minaeva.repository.AuthorRepository;
import ua.kiev.minaeva.service.BookService;
import ua.kiev.minaeva.service.ReaderService;

import static ua.kiev.minaeva.controller.helper.BoobookConstants.*;

@RestController
@RequestMapping("/books/fill")
@Log
@CrossOrigin
public class ZFillDbController {

    public static final String BRADBURY = "Bradbury";
    public static final String RAY = "Ray";
    public static final String VIVAT = "Vivat";
    @Autowired
    private AuthorRepository authorRepository;

    @Autowired
    private ReaderService readerService;

    @Autowired
    private BookService bookService;

    private ReaderDto vovka;
    private Author author;

    @GetMapping
    public void fillData() throws BoobookValidationException, BoobookNotFoundException, BoobookAlreadyExistsException {
        createReaderAndAuthor();

        BookDto farenheit = new BookDto.Builder("451 in Fahrenheit", author.getId(), vovka.getId())
                .withAuthorName(RAY)
                .withAuthorSurname(BRADBURY)
                .withYear(1990)
                .withPublisher(VIVAT)
                .withAgeGroup(AGE_GROUP_ADULT)
                .withDescription("to the ones who love counting")
                .withLanguage(2)
                .withHardCover(COVER_SOFT)
                .withIllustrations(ILLUSTRATION_BW)
                .withPagesQuantity(322)
                .build();
        bookService.createBook(farenheit);

        BookDto chronicles = new BookDto.Builder("Martian Chronicles", author.getId(), vovka.getId())
                .withAuthorName(RAY)
                .withAuthorSurname(BRADBURY)
                .withYear(1960)
                .withPublisher(VIVAT)
                .withAgeGroup(AGE_GROUP_MIDDLE)
                .withDescription("chronicles are my love")
                .withLanguage(1)
                .withHardCover(COVER_SOFT)
                .withIllustrations(ILLUSTRATION_COLOR)
                .withPagesQuantity(302)
                .build();
        bookService.createBook(chronicles);

        BookDto man = new BookDto.Builder("The Illustrated Man", author.getId(), vovka.getId())
                .withAuthorName(RAY)
                .withAuthorSurname(BRADBURY)
                .withYear(1965)
                .withPublisher("New Book")
                .withAgeGroup(AGE_GROUP_ADULT)
                .withDescription("man is man")
                .withLanguage(3)
                .withHardCover(COVER_HARD)
                .withIllustrations(ILLUSTRATION_ABSENT)
                .withPagesQuantity(200)
                .build();
        bookService.createBook(man);
    }

    private void createReaderAndAuthor() throws BoobookAlreadyExistsException {
        ReaderDto vovkaToSave = new ReaderDto();
        vovkaToSave.setName("Vladimir");
        vovkaToSave.setEmail("vmk64");
        vovkaToSave.setPassword("1");
        vovkaToSave.setRegistrationType(RegistrationType.CUSTOM);
        vovka = readerService.createReader(vovkaToSave);

        Author authorToSave = new Author();
        authorToSave.setName(RAY);
        authorToSave.setSurname(BRADBURY);
        author = authorRepository.save(authorToSave);
    }


}

