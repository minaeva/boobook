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
import ua.kiev.minaeva.repository.ReaderRepository;
import ua.kiev.minaeva.service.impl.BookServiceImpl;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@SpringBootTest
public class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @Mock
    private AuthorRepository authorRepository;

    @Mock
    private ReaderRepository readerRepository;

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
        aBook.setActive(true);
        aBook.setLanguage("eng");
        aBook.setDescription("text");
        aBook.setHardCover(true);
        aBook.setPagesQuantity(111);
        aBook.setAgeGroup(2);
        aBook.setIllustrations(1);
        aBook.setPublisher("Best publisher");

        aBookDto = new BookDto();
        aBookDto.setTitle("title");
        aBookDto.setAuthorId(1L);
        aBookDto.setOwnerId(1L);
        aBookDto.setAuthorSurname("surname");
    }

    @Test
    void createBook_successful() throws BoobookValidationException, BoobookNotFoundException {
        when(bookRepository.save(any())).thenReturn(aBook);
        when(readerRepository.findById(anyLong())).thenReturn(Optional.of(aReader));

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
        aBookDto.setId(1L);
        when(bookRepository.findById(anyLong())).thenReturn(Optional.of(aBook));
        when(authorRepository.findByNameAndSurname(anyString(), anyString())).thenReturn(Optional.of(anAuthor));
        when(readerRepository.findById(anyLong())).thenReturn(Optional.of(aReader));
        when(bookRepository.save(any())).thenReturn(aBook);

        BookDto updatedBook = bookService.updateBook(aBookDto);

        assertThat(updatedBook).isNotNull();
        assertThat(updatedBook.getTitle()).isEqualTo(aBook.getTitle());
        assertThat(updatedBook.getOwnerId()).isEqualTo(aBook.getOwner().getId());
        assertThat(updatedBook.getAuthorName()).isEqualTo(aBook.getAuthor().getName());
        assertThat(updatedBook.getAuthorSurname()).isEqualTo(aBook.getAuthor().getSurname());
        assertThat(updatedBook.isActive()).isEqualTo(aBook.isActive());
        assertThat(updatedBook.getLanguage()).isEqualTo(aBook.getLanguage());
        assertThat(updatedBook.getDescription()).isEqualTo(aBook.getDescription());
        assertThat(updatedBook.isHardCover()).isEqualTo(aBook.isHardCover());
        assertThat(updatedBook.getPagesQuantity()).isEqualTo(aBook.getPagesQuantity());
        assertThat(updatedBook.getAgeGroup()).isEqualTo(aBook.getAgeGroup());
        assertThat(updatedBook.getIllustrations()).isEqualTo(aBook.getIllustrations());
        assertThat(updatedBook.getPublisher()).isEqualTo(aBook.getPublisher());
    }

    @Test
    void updateBook_failedOnEmptyTitle() {
        aBookDto.setTitle("");

        assertThrows(BoobookValidationException.class,
                () -> bookService.updateBook(aBookDto));
    }

    @Test
    void updateBook_failedOnEmptyAuthorSurname() {
        aBookDto.setAuthorSurname("");

        assertThrows(BoobookValidationException.class,
                () -> bookService.updateBook(aBookDto));
    }

    @Test
    void updateBook_failedOnEmptyOwnerId() {
        aBookDto.setOwnerId(null);

        assertThrows(BoobookValidationException.class,
                () -> bookService.updateBook(aBookDto));
    }

    @Test
    void updateBook_failOnNotExistentBook() {
        when(bookRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(BoobookNotFoundException.class,
                () -> bookService.updateBook(aBookDto));
    }

    @Test
    void updateBook_failOnNotExistentOwner() {
        when(readerRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(BoobookNotFoundException.class,
                () -> bookService.updateBook(aBookDto));
    }

    @Test
    void setInactive_success() throws BoobookNotFoundException {
        when(bookRepository.findById(anyLong())).thenReturn(Optional.of(aBook));
        when(bookRepository.save(any(Book.class))).thenReturn(aBook);

        BookDto bookDto = bookService.setInactive(1L);

        assertFalse(bookDto.isActive());
    }

    @Test
    void setInactive_failOnNotExistentBook() {
        when(bookRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(BoobookNotFoundException.class,
                () -> bookService.setInactive(1L));
    }

    @Test
    void setActive_success() throws BoobookNotFoundException {
        when(bookRepository.findById(anyLong())).thenReturn(Optional.of(aBook));
        when(bookRepository.save(any(Book.class))).thenReturn(aBook);

        BookDto bookDto = bookService.setActive(1L);

        assertTrue(bookDto.isActive());
    }

    @Test
    void setActive_failOnNotExistentBook() {
        when(bookRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(BoobookNotFoundException.class,
                () -> bookService.setActive(1L));
    }

    @Test
    void getAll() {
        when(bookRepository.findAll())
                .thenReturn(Collections.singletonList(aBook));

        List<BookDto> foundBooks = bookService.getAll();

        assertThat(foundBooks).isNotEmpty();
    }

    @Test
    void getAll_nothingFound() {
        when(bookRepository.findAll()).thenReturn(Collections.EMPTY_LIST);

        List<BookDto> foundBooks = bookService.getAll();

        assertThat(foundBooks).isEmpty();
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
                .thenReturn(Optional.empty());

        assertThrows(BoobookNotFoundException.class,
                () -> bookService.getById(1L));
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
    void getByTitle_nothingFound() {
        when(bookRepository.findByTitle(anyString()))
                .thenReturn(Optional.empty());

        assertThrows(BoobookNotFoundException.class,
                () -> bookService.getByTitle("test"));
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

    @Test
    void getByAuthor_failsOnAuthorNotExists() {
        when(authorRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(BoobookNotFoundException.class,
                () -> bookService.getByAuthor(1L));
    }

    @Test
    void getByAuthor_nothingFound() {
        when(authorRepository.findById(anyLong()))
                .thenReturn(Optional.of(anAuthor));
        when(bookRepository.findByAuthor(any(Author.class)))
                .thenReturn(Optional.empty());

        assertThrows(BoobookNotFoundException.class,
                () -> bookService.getByTitle("test"));
    }

    @Test
    void getByOwner() throws BoobookNotFoundException {
        when(readerRepository.findById(anyLong())).thenReturn(Optional.of(aReader));
        when(bookRepository.findByOwner(any(Reader.class))).thenReturn(Optional.of(Collections.singletonList(aBook)));

        List<BookDto> books = bookService.getByOwner(1L);

        assertThat(books).isNotEmpty();
    }

    @Test
    void getByOwner_failsOnNonExistentReader() {
        when(readerRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(BoobookNotFoundException.class,
                () -> bookService.getByOwner(1L));
    }

    @Test
    void getByOwner_nothingFound() {
        when(readerRepository.findById(anyLong())).thenReturn(Optional.of(aReader));
        when(bookRepository.findByOwner(any(Reader.class))).thenReturn(Optional.empty());

        assertThrows(BoobookNotFoundException.class,
                () -> bookService.getByOwner(1L));
    }

    @Test
    void getByOwnerActive_findActive() throws BoobookNotFoundException {
        aBook.setActive(true);
        when(readerRepository.findById(anyLong())).thenReturn(Optional.of(aReader));
        when(bookRepository.findByOwner(any(Reader.class))).thenReturn(Optional.of(Collections.singletonList(aBook)));

        List<BookDto> books = bookService.getByOwnerActive(1L);

        assertTrue(books.get(0).isActive());
    }

    @Test
    void getByOwnerActive_findsNothing() throws BoobookNotFoundException {
        aBook.setActive(false);
        when(readerRepository.findById(anyLong())).thenReturn(Optional.of(aReader));
        when(bookRepository.findByOwner(any(Reader.class))).thenReturn(Optional.of(Collections.singletonList(aBook)));

        List<BookDto> books = bookService.getByOwnerActive(1L);

        assertThat(books).isEmpty();
    }

    @Test
    void getByOwnerActive_failsOnNonExistentReader() {
        when(readerRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(BoobookNotFoundException.class,
                () -> bookService.getByOwnerActive(1L));
    }

    @Test
    void getByOwnerActive_nothingFound() {
        when(readerRepository.findById(anyLong())).thenReturn(Optional.of(aReader));
        when(bookRepository.findByOwner(any(Reader.class))).thenReturn(Optional.empty());

        assertThrows(BoobookNotFoundException.class,
                () -> bookService.getByOwnerActive(1L));
    }

}
