package ua.kiev.minaeva.service;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.entity.Reader;
import ua.kiev.minaeva.exception.BoobookValidationException;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@SpringBootTest
public class ReaderServiceTest {

    @Autowired
    public ReaderService readerService;

    private static Reader aReader;
    private static ReaderDto aReaderDto;

    @BeforeEach
    void setup() {
        readerService = mock(ReaderService.class);

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
        when(readerService.createReader(any())).thenReturn(aReader);

        Reader savedReader = readerService.createReader(aReaderDto);

        Assertions.assertEquals(savedReader.getName(), aReader.getName());
    }

    @Test
    void createReader_failedOnEmptyLogin() {
        ReaderDto readerDto = new ReaderDto();

        BoobookValidationException thrown = assertThrows(
                BoobookValidationException.class,
                () -> {
                    readerService.createReader(readerDto);
                }
        );

        assertTrue(thrown.getMessage().contains("Login"));
    }


    @Test
    void createReader_failedOnEmptyName() {
        ReaderDto readerDto = new ReaderDto();
        readerDto.setLogin("login");
        readerDto.setPassword("password");

        BoobookValidationException thrown = assertThrows(
                BoobookValidationException.class,
                () -> {
                    readerService.createReader(readerDto);
                }
        );

        assertTrue(thrown.getMessage().contains("Name"));
    }

    @Test
    void getAll() {

    }

}
