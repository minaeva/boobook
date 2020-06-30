package ua.kiev.minaeva.controller;

import lombok.extern.java.Log;
import org.hibernate.service.spi.InjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ua.kiev.minaeva.dto.BookDto;
import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.entity.Author;
import ua.kiev.minaeva.entity.RegistrationType;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.exception.BoobookValidationException;
import ua.kiev.minaeva.repository.AuthorRepository;
import ua.kiev.minaeva.service.BookService;
import ua.kiev.minaeva.service.ReaderService;
import ua.kiev.minaeva.dto.BookDto;
import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.entity.Author;
import ua.kiev.minaeva.entity.Reader;
import ua.kiev.minaeva.entity.RegistrationType;
import ua.kiev.minaeva.exception.BoobookValidationException;
import ua.kiev.minaeva.repository.AuthorRepository;
import ua.kiev.minaeva.service.ReaderService;

import static ua.kiev.minaeva.controller.helper.BoobookConstants.*;

@RestController
@RequestMapping("/books/fill")
@Log
@CrossOrigin
public class ZFillDbController {

    @Autowired
    private AuthorRepository authorRepository;

    @Autowired
    private ReaderService readerService;

    @Autowired
    private BookService bookService;

    private ReaderDto vovka;
    private Author bradbury;

    @GetMapping
    public void fillData() throws BoobookValidationException, BoobookNotFoundException {
        createReaderAndAuthor();

        BookDto farenheit = new BookDto.Builder("451 in Fahrenheit", bradbury.getId(), vovka.getId())
                .withAuthorName("Ray")
                .withAuthorSurname("Bradbury")
                .withYear(1990)
                .withPublisher("Vivat")
                .withAgeGroup(AGE_GROUP_ADULT)
                .withDescription("to the ones who love counting")
                .withLanguage("ukr")
                .withIsHardCover(true)
                .withIllustrations(ILLUSTRATION_BW)
                .withPagesQuantity(322)
                .build();
        bookService.createBook(farenheit);

        BookDto chronicles = new BookDto.Builder("Martian Chronicles", bradbury.getId(), vovka.getId())
                .withAuthorName("Ray")
                .withAuthorSurname("Bradbury")
                .withYear(1960)
                .withPublisher("Vivat")
                .withAgeGroup(AGE_GROUP_MIDDLE)
                .withDescription("chronicles are my love")
                .withLanguage("rus")
                .withIsHardCover(true)
                .withIllustrations(ILLUSTRATION_COLOR)
                .withPagesQuantity(302)
                .build();
        bookService.createBook(chronicles);

        BookDto man = new BookDto.Builder("The Illustrated Man", bradbury.getId(), vovka.getId())
                .withAuthorName("Ray")
                .withAuthorSurname("Bradbury")
                .withYear(1965)
                .withPublisher("New Book")
                .withAgeGroup(AGE_GROUP_ADULT)
                .withDescription("man is man")
                .withLanguage("eng")
                .withIsHardCover(true)
                .withIllustrations(ILLUSTRATION_ABSENT)
                .withPagesQuantity(200)
                .build();
        bookService.createBook(man);
    }

    private void createReaderAndAuthor() throws BoobookValidationException {
        ReaderDto vovkaToSave = new ReaderDto();
        vovkaToSave.setName("Vladimir");
        vovkaToSave.setEmail("vmk64");
        vovkaToSave.setPassword("1");
        vovkaToSave.setRegistrationType(RegistrationType.CUSTOM);
        vovka = readerService.createReader(vovkaToSave);

        Author bradburyToSave = new Author();
        bradburyToSave.setName("Ray");
        bradburyToSave.setSurname("Bradbury");
        bradbury = authorRepository.save(bradburyToSave);
    }


}

