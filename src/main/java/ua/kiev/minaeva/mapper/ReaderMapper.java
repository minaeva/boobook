package ua.kiev.minaeva.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.entity.Reader;

@Mapper
public interface ReaderMapper {

    ReaderMapper INSTANCE = Mappers.getMapper(ReaderMapper.class);

    ReaderDto readerToDto(Reader reader);

    Reader dtoToReader(ReaderDto reader);

}
