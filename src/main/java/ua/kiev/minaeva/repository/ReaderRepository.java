package ua.kiev.minaeva.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.kiev.minaeva.entity.Reader;

public interface ReaderRepository extends JpaRepository<Reader, Long> {

    Reader findByLogin(String login);

}
