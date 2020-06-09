package ua.kiev.minaeva.service.impl;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import ua.kiev.minaeva.dto.BookDto;
import ua.kiev.minaeva.entity.Author;
import ua.kiev.minaeva.entity.Book;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.exception.BoobookValidationException;
import ua.kiev.minaeva.mapper.BookMapper;
import ua.kiev.minaeva.repository.AuthorRepository;
import ua.kiev.minaeva.repository.BookRepository;
import ua.kiev.minaeva.service.BookService;

import java.util.List;
import java.util.stream.Collectors;

import static ua.kiev.minaeva.service.helper.BookValidator.validateBook;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;

    private BookMapper mapper = Mappers.getMapper(BookMapper.class);

    public BookDto createBook(BookDto bookDto) throws BoobookValidationException {
        validateBook(bookDto);

        Book book = mapper.dtoToBook(bookDto);
        return mapper.bookToDto(bookRepository.save(book));
    }

    public BookDto updateBook(BookDto bookDto) throws BoobookValidationException {
        validateBook(bookDto);

        Book book = mapper.dtoToBook(bookDto);
        return mapper.bookToDto(bookRepository.save(book));
    }

    public void deleteBook(BookDto bookDto) {
        bookRepository.delete(mapper.dtoToBook(bookDto));
    }

    public List<BookDto> getAll() {
        return bookRepository.findAll()
                .stream()
                .map(book -> mapper.bookToDto(book))
                .collect(Collectors.toList());
    }

    public BookDto getById(Long id) throws BoobookNotFoundException {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new BoobookNotFoundException("No book found with id " + id));

        return mapper.bookToDto(book);
    }

    public List<BookDto> getByTitle(String title) throws BoobookNotFoundException {
        List<Book> foundBooks = bookRepository.findByTitle(title)
                .orElseThrow(() ->
                        new BoobookNotFoundException("No book found with title " + title));

        return foundBooks.stream()
                .map(b -> mapper.bookToDto(b))
                .collect(Collectors.toList());
    }

    public List<BookDto> getByAuthor(Long authorId) throws BoobookNotFoundException {
        Author author = authorRepository.findById(authorId)
                .orElseThrow(() ->
                        new BoobookNotFoundException("No author found with id " + authorId));

        List<Book> foundBooks = bookRepository.findByAuthor(author)
                .orElseThrow(() ->
                        new BoobookNotFoundException("No book found written by author "
                                + author.getName() + author.getSurname()));

        return foundBooks.stream()
                .map(b -> mapper.bookToDto(b))
                .collect(Collectors.toList());
    }

}
