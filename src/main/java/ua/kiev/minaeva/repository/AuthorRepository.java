package ua.kiev.minaeva.repository;

import org.springframework.data.repository.CrudRepository;
import ua.kiev.minaeva.entity.Author;

public interface AuthorRepository extends CrudRepository<Author, Long> {
    Author getById(Long id);
}
