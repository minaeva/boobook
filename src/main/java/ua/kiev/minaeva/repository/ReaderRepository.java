package ua.kiev.minaeva.repository;

import org.springframework.data.repository.CrudRepository;
import ua.kiev.minaeva.entity.Reader;

public interface ReaderRepository extends CrudRepository<Reader, Long> {

    Reader findByLoginAndPassword(String login, String password);

    Reader findByLogin(String login);
}
