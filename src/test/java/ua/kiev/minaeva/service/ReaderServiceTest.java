package ua.kiev.minaeva.service;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.exception.BoobookValidationException;
import ua.kiev.minaeva.repository.FriendshipRepository;
import ua.kiev.minaeva.repository.ReaderRepository;
import ua.kiev.minaeva.service.impl.ReaderServiceImpl;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static ua.kiev.minaeva.prototype.ReaderPrototype.aReader;
import static ua.kiev.minaeva.prototype.ReaderPrototype.aReaderDto;

@SpringBootTest
public class ReaderServiceTest {

    @Mock
    private ReaderRepository readerRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private ReaderServiceImpl readerService;

    @Test
    void createReader_successful() throws BoobookValidationException {
        ReaderDto readerDto = aReaderDto();
        when(readerRepository.save(any())).thenReturn(aReader());
        when(passwordEncoder.encode(anyString())).thenReturn("encoded_test_password");

        ReaderDto createdReader = readerService.createReader(readerDto);

        assertThat(createdReader).isNotNull();
        assertThat(createdReader.getName()).isEqualTo(readerDto.getName());
    }

    @Test
    void createReader_failedOnEmptyLogin() {
        ReaderDto readerDto = aReaderDto();
        readerDto.setLogin("");

        assertThrows(BoobookValidationException.class,
                () -> readerService.createReader(readerDto),
                "Login cannot be empty");
    }

    @Test
    void createReader_failedOnEmptyPassword() {
        ReaderDto readerDto = aReaderDto();
        readerDto.setPassword("");

        assertThrows(BoobookValidationException.class,
                () -> readerService.createReader(readerDto),
                "Password cannot be empty");
    }

    @Test
    void createReader_failedOnEmptyName() {
        ReaderDto readerDto = aReaderDto();
        readerDto.setName("");

        assertThrows(BoobookValidationException.class,
                () -> readerService.createReader(readerDto),
                "Name cannot be empty");
    }

    @Test
    void findByLogin() throws BoobookNotFoundException {
        when(readerRepository.findByLogin(eq("login")))
                .thenReturn(Optional.of(aReader()));

        ReaderDto foundReader = readerService.getByLogin("login");

        assertThat(foundReader).isNotNull();
        assertThat(foundReader.getLogin()).isEqualTo(aReader().getLogin());
    }

}
