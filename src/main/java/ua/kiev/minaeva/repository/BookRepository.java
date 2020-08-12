package ua.kiev.minaeva.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ua.kiev.minaeva.entity.Author;
import ua.kiev.minaeva.entity.Book;
import ua.kiev.minaeva.entity.Reader;

import java.util.List;
import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {

    Optional<List<Book>> findByTitle(String title);

    Optional<List<Book>> findByAuthor(Author author);

    Optional<List<Book>> findByOwner(Reader reader);

    @Query("select m from Book m where " +
            "(?1 is null or upper(m.title) like concat('%', upper(?1), '%')) ")
//    +
//            "and (?3 is null or m.ageGroup == ?3) " +
//            "and (?4 is null or upper(m.language) like <= ?3)")
    Optional<List<Book>> getByQuery(String title, String authorSurname, Integer ageGroup, boolean hardCover,
                                    String language, Integer illustrations, String city);

}
