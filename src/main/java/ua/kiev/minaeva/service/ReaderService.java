package ua.kiev.minaeva.service;

import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.entity.Reader;
import ua.kiev.minaeva.exception.BoobookValidationException;

import java.util.List;

public interface ReaderService {

    ReaderDto createReader(ReaderDto readerDto) throws BoobookValidationException;

    void deleteReader(Reader reader);

    ReaderDto getByLogin(String login);

    ReaderDto getByLoginAndPassword(String login, String password);

    List<ReaderDto> getAll();

}
