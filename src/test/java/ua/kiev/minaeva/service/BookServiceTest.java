package ua.kiev.minaeva.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import ua.kiev.minaeva.dto.BookDto;
import ua.kiev.minaeva.entity.Author;
import ua.kiev.minaeva.entity.Book;
import ua.kiev.minaeva.entity.Reader;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.exception.BoobookValidationException;
import ua.kiev.minaeva.repository.BookRepository;
import ua.kiev.minaeva.service.impl.BookServiceImpl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@SpringBootTest
public class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    public BookServiceImpl bookService;

    private static Book aBook;
    private static Reader aReader;
    private static Author anAuthor;
    private static BookDto aBookDto;

    @BeforeEach
    void setup() {
        aReader = new Reader();
        aReader.setLogin("login");
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
        aBookDto.setAuthor(anAuthor);
        aBookDto.setOwner(aReader);
    }

    @Test
    void createBook_successful() throws BoobookValidationException {
        when(bookRepository.save(any())).thenReturn(aBook);

        Book createdBook = bookService.createBook(aBookDto);

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
    void updateBook_successful() throws BoobookValidationException {
        when(bookRepository.save(any())).thenReturn(aBook);

        Book updatedBook = bookService.updateBook(aBookDto);

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
        when(bookRepository.findById(eq(1L))).thenReturn(java.util.Optional.ofNullable(aBook));

        BookDto foundBook = bookService.getById(1L);

        assertThat(foundBook).isNotNull();
        assertThat(foundBook.getTitle()).isEqualTo("Harry Potter");
    }

}
