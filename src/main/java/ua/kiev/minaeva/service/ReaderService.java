package ua.kiev.minaeva.service;

import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.dto.LoginDto;
import ua.kiev.minaeva.entity.Reader;
import ua.kiev.minaeva.exception.BoobookValidationException;

import java.util.List;

public interface ReaderService {

    Reader createReader(ReaderDto readerDto) throws BoobookValidationException;

    void deleteReader(Reader reader);

    String login(LoginDto loginDto);

    ReaderDto getByLogin(String login);

    List<Reader> getAll();

}
