package ua.kiev.minaeva.service;

import ua.kiev.minaeva.entity.Book;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.exception.BoobookValidationException;
import ua.kiev.minaeva.dto.BookDto;

import java.util.List;

public interface BookService {

    Book createBook(BookDto bookDto) throws BoobookValidationException;

    Book updateBook(BookDto bookDto) throws BoobookValidationException;

    void deleteBook(BookDto bookDto);

    List<BookDto> getAll();

    BookDto getById(Long id) throws BoobookNotFoundException;
}
