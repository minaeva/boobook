package ua.kiev.minaeva.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import ua.kiev.minaeva.entity.Reader;

import java.util.List;
import java.util.Optional;

public interface ReaderRepository extends JpaRepository<Reader, Long>,
        JpaSpecificationExecutor<Reader> {

    //    Optional<Reader> findByEmail(String email);

    Optional<Reader> findByEmailIgnoreCase(String email);

    Optional<Reader> findById(Long id);

    Optional<Reader> findByIdOrderByIdDesc(Long id);

    List<Reader> findByName(String name);
}
