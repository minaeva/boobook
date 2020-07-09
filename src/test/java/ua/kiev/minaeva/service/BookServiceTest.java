package ua.kiev.minaeva.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import ua.kiev.minaeva.dto.BookDto;
import ua.kiev.minaeva.entity.Author;
import ua.kiev.minaeva.entity.Book;
import ua.kiev.minaeva.entity.Reader;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.exception.BoobookValidationException;
import ua.kiev.minaeva.mapper.BookMapper;
import ua.kiev.minaeva.repository.AuthorRepository;
import ua.kiev.minaeva.repository.BookRepository;
import ua.kiev.minaeva.service.impl.BookServiceImpl;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@SpringBootTest
public class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @Mock
    private AuthorRepository authorRepository;

    @InjectMocks
    public BookServiceImpl bookService;

    private static Book aBook;
    private static Reader aReader;
    private static Author anAuthor;
    private static BookDto aBookDto;
    private BookMapper mapper = Mappers.getMapper(BookMapper.class);


    @BeforeEach
    void setup() {
        aReader = new Reader();
        aReader.setEmail("email");
        aReader.setPassword("pass");
        aReader.setName("owner");

        anAuthor = new Author();
        anAuthor.setName("Alexander");
        anAuthor.setSurname("Pushkin");

        aBook = new Book();
        aBook.setTitle("Harry Potter");
        aBook.setOwner(aReader);
        aBook.setAuthor(anAuthor);

        aBookDto = new BookDto();
        aBookDto.setTitle("title");
        aBookDto.setAuthorId(1L);
        aBookDto.setOwnerId(1L);
    }

    @Test
    void createBook_successful() throws BoobookValidationException, BoobookNotFoundException {
        when(bookRepository.save(any())).thenReturn(aBook);

        BookDto createdBook = bookService.createBook(aBookDto);

        assertThat(createdBook).isNotNull();
        assertThat(createdBook.getTitle()).isEqualTo(aBook.getTitle());
    }

    @Test
    void createBook_failedOnEmptyTitle() {
        aBookDto.setTitle("");

        assertThrows(BoobookValidationException.class,
                () -> bookService.createBook(aBookDto),
                "Title cannot be empty");
    }

    @Test
    void updateBook_successful() throws BoobookValidationException, BoobookNotFoundException {
        when(bookRepository.save(any())).thenReturn(aBook);

        BookDto updatedBook = bookService.updateBook(aBookDto);

        assertThat(updatedBook).isNotNull();
        assertThat(updatedBook.getTitle()).isEqualTo(aBook.getTitle());
    }

    @Test
    void updateBook_failedOnEmptyTitle() {
        aBookDto.setTitle("");

        assertThrows(BoobookValidationException.class,
                () -> bookService.updateBook(aBookDto),
                "Title cannot be empty");
    }

    @Test
    void getById_successful() throws BoobookNotFoundException {
        when(bookRepository.findById(eq(1L)))
                .thenReturn(Optional.ofNullable(aBook));

        BookDto foundBook = bookService.getById(1L);

        assertThat(foundBook).isNotNull();
        assertThat(foundBook.getTitle()).isEqualTo("Harry Potter");
    }

    @Test
    void getById_nothingFound() {
        when(bookRepository.findById(anyLong()))
                .thenReturn(java.util.Optional.empty());

        assertThrows(BoobookNotFoundException.class,
                () -> bookService.getById(1L),
                "No book found with id 1");
    }

    @Test
    void getAll() {
        when(bookRepository.findAll())
                .thenReturn(Collections.singletonList(aBook));

        List<BookDto> foundBooks = bookService.getAll();

        assertThat(foundBooks).isNotEmpty();
    }

    @Test
    void getByTitle() throws BoobookNotFoundException {
        when(bookRepository.findByTitle(anyString()))
                .thenReturn(Optional.of(Collections.singletonList(aBook)));

        List<BookDto> foundBooks = bookService.getByTitle("test");

        assertThat(foundBooks).isNotNull();
        assertThat(foundBooks.get(0).getTitle()).isEqualTo("Harry Potter");
    }

    @Test
    void getByAuthor() throws BoobookNotFoundException {
        when(authorRepository.findById(anyLong()))
                .thenReturn(Optional.of(anAuthor));
        when(bookRepository.findByAuthor(any(Author.class)))
                .thenReturn(Optional.of(Collections.singletonList(aBook)));

        List<BookDto> foundBooks = bookService.getByAuthor(1L);

        assertThat(foundBooks).isNotNull();
        assertThat(foundBooks.get(0).getTitle()).isEqualTo("Harry Potter");
    }

}
