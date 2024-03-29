package ua.kiev.minaeva.service;

import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.dto.SearchReaderDto;
import ua.kiev.minaeva.entity.Reader;
import ua.kiev.minaeva.exception.BoobookAlreadyExistsException;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.exception.BoobookValidationException;

import java.util.List;

public interface ReaderService {

    ReaderDto createReader(ReaderDto readerDto) throws BoobookAlreadyExistsException, BoobookValidationException;

    ReaderDto createGoogleReader(ReaderDto readerDto) throws BoobookValidationException;

    ReaderDto updateReader(ReaderDto readerDto) throws BoobookValidationException, BoobookNotFoundException;

    ReaderDto updateImage(byte[] image, Long readerId) throws BoobookNotFoundException;

    void deleteReader(Reader reader);

    ReaderDto getByEmail(String email) throws BoobookNotFoundException;

    List<ReaderDto> getByName(String name) throws BoobookNotFoundException;

    ReaderDto getByEmailAndPassword(String email, String password) throws BoobookNotFoundException;

    List<ReaderDto> getAll();

    List<ReaderDto> getAllWithIsFriend(Long friend1Id);

    ReaderDto getById(Long id) throws BoobookNotFoundException;

    ReaderDto getByIdWithIsFriend(Long id, Long friendOfId) throws BoobookNotFoundException;

    List<ReaderDto> getByQuery(SearchReaderDto searchReaderDto);
}
