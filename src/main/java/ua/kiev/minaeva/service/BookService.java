package ua.kiev.minaeva.service;

import ua.kiev.minaeva.dto.BookDto;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.exception.BoobookValidationException;

import java.util.List;

public interface BookService {

    BookDto createBook(BookDto bookDto) throws BoobookValidationException;

    BookDto updateBook(BookDto bookDto) throws BoobookValidationException;

    void deleteBook(BookDto bookDto);

    List<BookDto> getAll();

    BookDto getById(Long id) throws BoobookNotFoundException;

    List<BookDto> getByTitle(String title) throws BoobookNotFoundException;

    List<BookDto> getByAuthor(Long authorId) throws BoobookNotFoundException;
}
