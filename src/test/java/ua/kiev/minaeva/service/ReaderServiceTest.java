package ua.kiev.minaeva.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.entity.Reader;
import ua.kiev.minaeva.exception.BoobookValidationException;
import ua.kiev.minaeva.repository.ReaderRepository;
import ua.kiev.minaeva.service.impl.ReaderServiceImpl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@SpringBootTest
public class ReaderServiceTest {

    @Mock
    private ReaderRepository readerRepository;

    @InjectMocks
    private ReaderServiceImpl readerService;

    private static Reader aReader;
    private static ReaderDto aReaderDto;

    @BeforeEach
    void setup() {
        aReader = new Reader();
        aReader.setLogin("login");
        aReader.setPassword("pass");
        aReader.setName("name");

        aReaderDto = new ReaderDto();
        aReaderDto.setLogin("login");
        aReaderDto.setPassword("password");
        aReaderDto.setName("name");
    }

    @Test
    void createReader_successful() throws BoobookValidationException {
        when(readerRepository.save(any())).thenReturn(aReader);

        Reader createdReader = readerService.createReader(aReaderDto);

        assertThat(createdReader).isNotNull();
        assertThat(createdReader.getName()).isEqualTo(aReaderDto.getName());

    }

    @Test
    void createReader_failedOnEmptyLogin() {
        aReaderDto.setLogin("");

        assertThrows(BoobookValidationException.class,
                () -> readerService.createReader(aReaderDto),
                "Login cannot be empty");
    }

    @Test
    void createReader_failedOnEmptyPassword() {
        aReaderDto.setPassword("");

        assertThrows(BoobookValidationException.class,
                () -> readerService.createReader(aReaderDto),
                "Password cannot be empty");
    }

    @Test
    void createReader_failedOnEmptyName() {
        aReaderDto.setName("");

        assertThrows(BoobookValidationException.class,
                () -> readerService.createReader(aReaderDto),
                "Name cannot be empty");
    }

    @Test
    void findByLogin() {
        when(readerRepository.findByLogin(eq("login"))).thenReturn(aReader);

        ReaderDto foundReader = readerService.getByLogin("login");

        assertThat(foundReader).isNotNull();
        assertThat(foundReader.getLogin()).isEqualTo("login");
    }

    @Test
    void getAll() {
    }

}
