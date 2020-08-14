package ua.kiev.minaeva.repository;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ua.kiev.minaeva.entity.Author;
import ua.kiev.minaeva.entity.Book;
import ua.kiev.minaeva.entity.Reader;

import java.util.List;
import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long>, BookRepositoryCustom {

    Optional<List<Book>> findByTitle(String title);

    Optional<List<Book>> findByAuthor(Author author);

    Optional<List<Book>> findByOwner(Reader reader);

    static Specification<Book> hasAgeGroup(int ageGroup) {
        return (book, cq, cb) -> cb.equal(book.get("ageGroup"), ageGroup);
    }

    static Specification<Book> titleContains(String title) {
        return (book, cq, cb) -> cb.like(book.get("title"), "%" + title + "%");
    }
}
