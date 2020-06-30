package ua.kiev.minaeva.service;

import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.entity.Reader;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.exception.BoobookValidationException;

import java.util.List;

public interface ReaderService {

    ReaderDto createReader(ReaderDto readerDto) throws BoobookValidationException;

    void deleteReader(Reader reader);

    ReaderDto getByEmail(String email) throws BoobookNotFoundException;

    List<ReaderDto> getByName(String name) throws BoobookNotFoundException;

    ReaderDto getByEmailAndPassword(String email, String password) throws BoobookNotFoundException;

    List<ReaderDto> getAll();

    ReaderDto getById(Long id) throws BoobookNotFoundException;

}
