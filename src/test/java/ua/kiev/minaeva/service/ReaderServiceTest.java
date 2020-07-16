package ua.kiev.minaeva.service;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.entity.Reader;
import ua.kiev.minaeva.entity.RegistrationType;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.exception.BoobookValidationException;
import ua.kiev.minaeva.repository.ReaderRepository;
import ua.kiev.minaeva.service.impl.ReaderServiceImpl;

import javax.persistence.criteria.CriteriaBuilder;
import java.util.*;

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
    void createReader_failedOnEmptyEmail() {
        ReaderDto readerDto = aReaderDto();
        readerDto.setEmail("");

        assertThrows(BoobookValidationException.class,
                () -> readerService.createReader(readerDto));
    }

    @Test
    void createReader_failedOnEmptyPassword() {
        ReaderDto readerDto = aReaderDto();
        readerDto.setPassword("");

        assertThrows(BoobookValidationException.class,
                () -> readerService.createReader(readerDto));
    }

    @Test
    void createReader_failedOnEmptyName() {
        ReaderDto readerDto = aReaderDto();
        readerDto.setName("");

        assertThrows(BoobookValidationException.class,
                () -> readerService.createReader(readerDto));
    }

    @Test
    void updateReader_successful() throws BoobookNotFoundException, BoobookValidationException {
        ReaderDto readerDto = aReaderDto();
        readerDto.setId(11L);
        when(readerRepository.findById(anyLong())).thenReturn(Optional.of(aReader()));
        when(readerRepository.save(any())).thenReturn(aReader());

        ReaderDto updatedReader = readerService.updateReader(readerDto);

        assertThat(updatedReader).isNotNull();
        assertThat(updatedReader.getName()).isEqualTo(readerDto.getName());
    }

    @Test
    void updateReader_failsOnNotExistentReader() throws BoobookNotFoundException, BoobookValidationException {
        ReaderDto readerDto = aReaderDto();
        readerDto.setId(11L);
        when(readerRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(BoobookNotFoundException.class,
                () -> readerService.updateReader(readerDto));
    }

    @Test
    void updateReader_failsOnNotEmptyEmail() throws BoobookNotFoundException, BoobookValidationException {
        ReaderDto readerDto = aReaderDto();
        readerDto.setId(11L);
        readerDto.setEmail("");
        when(readerRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(BoobookValidationException.class,
                () -> readerService.updateReader(readerDto));
    }

    @Test
    void updateReader_failsOnNotEmptyName() throws BoobookNotFoundException, BoobookValidationException {
        ReaderDto readerDto = aReaderDto();
        readerDto.setId(11L);
        readerDto.setName("");
        when(readerRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(BoobookValidationException.class,
                () -> readerService.updateReader(readerDto));
    }

    @Test
    void updateReader_failsOnNotFbEmptyPassword() throws BoobookNotFoundException, BoobookValidationException {
        ReaderDto readerDto = aReaderDto();
        readerDto.setId(11L);
        readerDto.setRegistrationType(RegistrationType.CUSTOM);
        readerDto.setPassword("");
        when(readerRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(BoobookValidationException.class,
                () -> readerService.updateReader(readerDto));
    }

    @Test
    void updateReader_successfulOnFbEmptyPassword() throws BoobookNotFoundException, BoobookValidationException {
        ReaderDto readerDto = aReaderDto();
        readerDto.setId(11L);
        readerDto.setRegistrationType(RegistrationType.FB);
        readerDto.setPassword("");
        when(readerRepository.findById(anyLong())).thenReturn(Optional.of(aReader()));
        when(readerRepository.save(any())).thenReturn(aReader());

        ReaderDto updatedReader = readerService.updateReader(readerDto);

        assertThat(updatedReader).isNotNull();
        assertThat(updatedReader.getName()).isEqualTo(readerDto.getName());
    }

    @Test
    void getByEmail() throws BoobookNotFoundException {
        when(readerRepository.findByEmail(eq("email")))
                .thenReturn(Optional.of(aReader()));

        ReaderDto foundReader = readerService.getByEmail("email");

        assertThat(foundReader).isNotNull();
        assertThat(foundReader.getEmail()).isEqualTo(aReader().getEmail());
    }

    @Test
    void getByEmail_notFound() {
        when(readerRepository.findByEmail(anyString()))
                .thenReturn(Optional.empty());

        assertThrows(BoobookNotFoundException.class,
                () -> readerService.getByEmail("not existent"));
    }

    @Test
    void getByEmailAndPassword() throws BoobookNotFoundException {
        Reader reader = aReader();
        reader.setRegistrationType(RegistrationType.FB);
        when(readerRepository.findByEmail(anyString()))
                .thenReturn(Optional.of(reader));

        ReaderDto foundReader = readerService.getByEmailAndPassword("email", "password");

        assertThat(foundReader).isNotNull();
        assertThat(foundReader.getEmail()).isEqualTo(aReader().getEmail());
    }

        @Test
        void getByEmailAndPassword_notFound() {
            when(readerRepository.findByEmail(anyString())).thenReturn(Optional.empty());

            assertThrows(BoobookNotFoundException.class,
                    () -> readerService.getByEmailAndPassword("mail", "password"));
        }

    @Test
    void getByName() throws BoobookNotFoundException {
        when(readerRepository.findByName(anyString()))
                .thenReturn(Collections.singletonList(aReader()));

        List<ReaderDto> foundReaders = readerService.getByName("email");

        assertThat(foundReaders).isNotNull();
        assertThat(foundReaders.get(0).getEmail()).isEqualTo(aReader().getEmail());
    }

    @Test
    void getByName_notFound() {
        when(readerRepository.findByName(anyString()))
                .thenReturn(Collections.emptyList());

        assertThrows(BoobookNotFoundException.class,
                () -> readerService.getByName("not existent"),
                "No reader with name not existent found");
    }

}
