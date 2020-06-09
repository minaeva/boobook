package ua.kiev.minaeva.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import ua.kiev.minaeva.controller.RegistrationRequest;
import ua.kiev.minaeva.dto.ReaderDto;

@Mapper
public interface ReaderRegistrationMapper {

    ReaderRegistrationMapper INSTANCE = Mappers.getMapper(ReaderRegistrationMapper.class);

    ReaderDto requestToReaderDto(RegistrationRequest request);

}
