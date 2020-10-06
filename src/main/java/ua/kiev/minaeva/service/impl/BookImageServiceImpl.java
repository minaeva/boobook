package ua.kiev.minaeva.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.dto.SearchReaderDto;
import ua.kiev.minaeva.entity.Book;
import ua.kiev.minaeva.entity.BookImage;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.repository.BookImageRepository;
import ua.kiev.minaeva.repository.BookRepository;
import ua.kiev.minaeva.service.BookImageService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookImageServiceImpl implements BookImageService {

    private final BookImageRepository bookImageRepository;
    private final BookRepository bookRepository;

    @Override
    public List<BookImage> getByBookId(Long id) throws BoobookNotFoundException {
        return bookImageRepository.findAllByBook_Id(id)
                .orElseThrow(() -> new BoobookNotFoundException("No image found"));
    }

    @Override
    public BookImage save(byte[] image, Long bookId) throws BoobookNotFoundException {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BoobookNotFoundException("Book with id " + bookId + " cannot be found"));

        BookImage bookImage = new BookImage();
        bookImage.setBook(book);
        bookImage.setImage(image);
        return bookImageRepository.save(bookImage);
    }

    @Override
    public List<BookImage> update(List<byte[]> images, Long bookId) throws BoobookNotFoundException {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BoobookNotFoundException("Book with id " + bookId + " cannot be found"));

        Optional<List<BookImage>> existentBooks = bookImageRepository.findAllByBook_Id(bookId);
        if (existentBooks.isPresent()) {
            for (BookImage bookImage : existentBooks.get()) {
                bookImageRepository.delete(bookImage);
            }
        }

        List<BookImage> savedImages = new ArrayList<>();

        for (byte[] image : images) {
            BookImage bookImage = new BookImage();
            bookImage.setBook(book);
            bookImage.setImage(image);
            savedImages.add(bookImageRepository.save(bookImage));
        }

        return savedImages;
    }

 }
