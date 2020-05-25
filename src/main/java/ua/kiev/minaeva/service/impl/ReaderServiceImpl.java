package ua.kiev.minaeva.service.impl;

import lombok.RequiredArgsConstructor;
import org.assertj.core.util.Lists;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.dto.LoginDto;
import ua.kiev.minaeva.entity.Reader;
import ua.kiev.minaeva.exception.BoobookValidationException;
import ua.kiev.minaeva.mapper.ReaderMapper;
import ua.kiev.minaeva.repository.ReaderRepository;
import ua.kiev.minaeva.service.ReaderService;

import java.util.List;

import static ua.kiev.minaeva.service.helper.ReaderValidator.validateReader;

@Service
@RequiredArgsConstructor
public class ReaderServiceImpl implements ReaderService {

    private final ReaderRepository readerRepository;

    private ReaderMapper mapper = Mappers.getMapper(ReaderMapper.class);

    public Reader createReader(ReaderDto readerDto) throws BoobookValidationException {
        validateReader(readerDto);

        Reader reader = mapper.dtoToReader(readerDto);
        return readerRepository.save(reader);
    }

    public void deleteReader(Reader reader) {
        readerRepository.delete(reader);
    }

    public ReaderDto getByLogin(String login) {
        Reader reader = readerRepository.findByLogin(login);
        return mapper.readerToDto(reader);
    }

    public List<Reader> getAll() {
        return Lists.newArrayList(readerRepository.findAll());
    }

    public String login(final LoginDto loginDto) {
        return "success";
    }

}
