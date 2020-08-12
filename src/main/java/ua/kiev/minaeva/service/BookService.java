package ua.kiev.minaeva.service;

import ua.kiev.minaeva.dto.BookDto;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.exception.BoobookValidationException;

import java.util.List;

public interface BookService {

    BookDto createBook(BookDto bookDto) throws BoobookValidationException, BoobookNotFoundException;

    BookDto updateBook(BookDto bookDto) throws BoobookValidationException, BoobookNotFoundException;

    BookDto setInactive(Long bookId) throws BoobookNotFoundException;

    BookDto setActive(Long bookId) throws BoobookNotFoundException;

    void deleteBook(BookDto bookDto);

    List<BookDto> getAll();

    BookDto getById(Long id) throws BoobookNotFoundException;

    List<BookDto> getByTitle(String title) throws BoobookNotFoundException;

    List<BookDto> getByAuthor(Long authorId) throws BoobookNotFoundException;

    List<BookDto> getByOwner(Long readerId) throws BoobookNotFoundException;

    List<BookDto> getByOwnerActive(Long readerId) throws BoobookNotFoundException;

    List<BookDto> getByQuery(String title, String authorSurname, Integer ageGroup, boolean hardCover,
                             String language, Integer illustrations, String city) throws BoobookNotFoundException;
}
