package ua.kiev.minaeva.service.impl;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.entity.Reader;
import ua.kiev.minaeva.entity.RegistrationType;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.exception.BoobookValidationException;
import ua.kiev.minaeva.mapper.ReaderMapper;
import ua.kiev.minaeva.repository.ReaderRepository;
import ua.kiev.minaeva.service.ReaderService;

import java.util.List;
import java.util.stream.Collectors;

import static ua.kiev.minaeva.service.helper.ReaderValidator.validateReader;

@Service
@RequiredArgsConstructor
public class ReaderServiceImpl implements ReaderService {

    private final ReaderRepository readerRepository;
    private final PasswordEncoder passwordEncoder;

    private ReaderMapper mapper = Mappers.getMapper(ReaderMapper.class);

    public ReaderDto createReader(ReaderDto readerDto) throws BoobookValidationException {
        validateReader(readerDto);

        Reader reader = mapper.dtoToReader(readerDto);
        if (RegistrationType.CUSTOM.equals(readerDto.getRegistrationType())) {
            reader.setPassword(passwordEncoder.encode(readerDto.getPassword()));
        }

        return mapper.readerToDto(readerRepository.save(reader));
    }

    public void deleteReader(Reader reader) {
        readerRepository.delete(reader);
    }

    public ReaderDto getByLogin(String login) throws BoobookNotFoundException {
        Reader reader = readerRepository.findByLogin(login)
                .orElseThrow(() ->
                        new BoobookNotFoundException("No reader with login " + login + "  found"));

        return mapper.readerToDto(reader);
    }

    public ReaderDto getByLoginAndPassword(String login, String password) throws BoobookNotFoundException {
        ReaderDto foundByLogin = getByLogin(login);

        if (RegistrationType.CUSTOM.equals(foundByLogin.getRegistrationType())) {
            if (passwordEncoder.matches(password, foundByLogin.getPassword())) {
                return foundByLogin;
            }
        } else {
            return foundByLogin;
        }

        return null;
    }

    public List<ReaderDto> getAll() {
        return readerRepository.findAll()
                .stream()
                .map(reader -> mapper.readerToDto(reader))
                .collect(Collectors.toList());
    }

}
