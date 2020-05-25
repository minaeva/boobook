package ua.kiev.minaeva.service;

import ua.kiev.minaeva.entity.Book;
import ua.kiev.minaeva.exception.BoobookValidationException;

import java.util.List;

public interface BookService {

    List<Book> getAll();

    Book getById(Long id) throws BoobookValidationException;
}
