package ua.kiev.minaeva.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import ua.kiev.minaeva.entity.Author;
import ua.kiev.minaeva.entity.Book;
import ua.kiev.minaeva.entity.BookImage;
import ua.kiev.minaeva.entity.Reader;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.repository.BookImageRepository;
import ua.kiev.minaeva.repository.BookRepository;
import ua.kiev.minaeva.service.impl.BookImageServiceImpl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

@SpringBootTest
public class BookImageServiceTest {

    @Mock
    private BookImageRepository bookImageRepository;

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private BookImageServiceImpl bookImageService;

    private static Reader aReader;
    private static Book aBook;
    private static Author anAuthor;
    private static BookImage aBookImage;
    private static List<byte[]> theImagesToSave;


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
        aBook.setId(5L);
        aBook.setTitle("Harry Potter");
        aBook.setOwner(aReader);
        aBook.setAuthor(anAuthor);
        aBook.setActive(true);

        aBookImage = new BookImage();
        aBookImage.setBook(aBook);
        aBookImage.setImage(new byte[]{1, 2, 3, 4, 5});

        theImagesToSave = new ArrayList<>();
        theImagesToSave.add(new byte[]{1, 2, 3});
    }

    @Test
    void saveBookImage_successful() throws BoobookNotFoundException {
        when(bookRepository.findById(anyLong())).thenReturn(Optional.of(aBook));
        when(bookImageRepository.save(any(BookImage.class))).thenReturn(aBookImage);

        BookImage bookImage = bookImageService.save(new byte[]{5, 4, 3}, 1L);

        assertThat(bookImage.getBook().getId()).isEqualTo(aBook.getId());
    }

    @Test
    void saveBookImage_bookNotExist_error() throws BoobookNotFoundException {
        when(bookRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(BoobookNotFoundException.class, () -> bookImageService.save(new byte[]{5, 4, 3}, 1L));
    }

    @Test
    void getByBookId_findsSuccessfully() throws BoobookNotFoundException {
        when(bookImageRepository.findAllByBook_Id(anyLong()))
                .thenReturn(Optional.of(Collections.singletonList(aBookImage)));

        List<BookImage> bookImages = bookImageService.getByBookId(1L);

        assertThat(bookImages.get(0).getBook().getId()).isEqualTo(aBookImage.getBook().getId());
    }

    @Test
    void getByBookId_findsNothing() {
        when(bookImageRepository.findAllByBook_Id(anyLong()))
                .thenReturn(Optional.empty());

        assertThrows(BoobookNotFoundException.class, () ->
                bookImageService.getByBookId(2L));
    }

    @Test
    void update_imageExist_successful() throws BoobookNotFoundException {
        when(bookRepository.findById(anyLong())).thenReturn(Optional.of(aBook));
        when(bookImageRepository.findAllByBook_Id(anyLong())).thenReturn(Optional.of(Collections.singletonList(aBookImage)));
        doNothing().when(bookImageRepository).delete(any(BookImage.class));
        when(bookImageRepository.save(any(BookImage.class))).thenReturn(aBookImage);

        List<BookImage> savedBookImages = bookImageService.update(theImagesToSave, 1L);

        assertThat(savedBookImages.get(0).getBook().getId()).isEqualTo(aBookImage.getBook().getId());
    }

    @Test
    void update_imageNotExist_successful() throws BoobookNotFoundException {
        when(bookRepository.findById(anyLong())).thenReturn(Optional.of(aBook));
        when(bookImageRepository.findAllByBook_Id(anyLong())).thenReturn(Optional.empty());
        when(bookImageRepository.save(any(BookImage.class))).thenReturn(aBookImage);

        List<BookImage> savedBookImages = bookImageService.update(theImagesToSave, 1L);

        assertThat(savedBookImages.get(0).getBook().getId()).isEqualTo(aBookImage.getBook().getId());
    }

    @Test
    void update_bookNotFound_fail() {
        when(bookRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(BoobookNotFoundException.class, () -> bookImageService.update(theImagesToSave, 1L));
    }

}
