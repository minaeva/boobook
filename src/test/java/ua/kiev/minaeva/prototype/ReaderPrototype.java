package ua.kiev.minaeva.prototype;

import org.mapstruct.factory.Mappers;
import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.entity.Reader;
import ua.kiev.minaeva.entity.RegistrationType;
import ua.kiev.minaeva.mapper.ReaderMapper;

public class ReaderPrototype {

    private static ReaderMapper mapper = Mappers.getMapper(ReaderMapper.class);

    public static Reader aReader() {
        Reader reader = new Reader();
        reader.setEmail("test_email");
        reader.setPassword("test_password");
        reader.setName("test_name");
        reader.setSurname("test_surname");
        reader.setEmail("test@gmail.com");
        reader.setCity("test_city");
        reader.setRegistrationType(RegistrationType.CUSTOM);

        return reader;
    }

    public static ReaderDto aReaderDto() {
        return mapper.readerToDto(aReader());
    }
}
