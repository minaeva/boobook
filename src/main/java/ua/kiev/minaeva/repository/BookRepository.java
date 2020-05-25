package ua.kiev.minaeva.repository;

import org.springframework.data.repository.CrudRepository;
import ua.kiev.minaeva.entity.Book;


public interface BookRepository extends CrudRepository<Book, Long> {
}
