package ua.kiev.minaeva.service.impl;

import lombok.RequiredArgsConstructor;
import org.assertj.core.util.Lists;
import org.springframework.stereotype.Service;
import ua.kiev.minaeva.entity.Book;
import ua.kiev.minaeva.exception.BoobookValidationException;
import ua.kiev.minaeva.repository.BookRepository;
import ua.kiev.minaeva.service.BookService;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;

    public List<Book> getAll() {
        return Lists.newArrayList(bookRepository.findAll());
    }

    public Book getById(Long id) throws BoobookValidationException{
        return bookRepository.findById(id)
                .orElseThrow(() -> new BoobookValidationException("No book found with id " + id));
        }

}
