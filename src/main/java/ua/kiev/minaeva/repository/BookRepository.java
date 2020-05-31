package ua.kiev.minaeva.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.kiev.minaeva.entity.Author;
import ua.kiev.minaeva.entity.Book;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> getByTitle(String title);

    List<Book> getByAuthor(Author author);

}
