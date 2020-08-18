package ua.kiev.minaeva.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import ua.kiev.minaeva.entity.Author;
import ua.kiev.minaeva.entity.Book;
import ua.kiev.minaeva.entity.Reader;

import java.util.List;
import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long>, JpaSpecificationExecutor<Book> {

    Optional<List<Book>> findByTitle(String title);

    Optional<List<Book>> findByAuthor(Author author);

    Optional<List<Book>> findByOwner(Reader reader);

}
