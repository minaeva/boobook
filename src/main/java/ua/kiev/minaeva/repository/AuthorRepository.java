package ua.kiev.minaeva.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.kiev.minaeva.entity.Author;

public interface AuthorRepository extends JpaRepository<Author, Long> {

    Author getById(Long id);

}
