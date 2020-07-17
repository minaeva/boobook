package ua.kiev.minaeva.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.kiev.minaeva.entity.Reader;

import java.util.List;
import java.util.Optional;

public interface ReaderRepository extends JpaRepository<Reader, Long> {

    Optional<Reader> findByEmail(String email);

    Optional<Reader> findById(Long id);

    List<Reader> findByName(String name);
}
