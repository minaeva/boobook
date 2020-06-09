package ua.kiev.minaeva.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.kiev.minaeva.entity.Author;
import ua.kiev.minaeva.entity.Book;

import java.util.List;
import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {

    Optional<List<Book>> findByTitle(String title);

    Optional<List<Book>> findByAuthor(Author author);

}
