package ua.kiev.minaeva.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import ua.kiev.minaeva.dto.BookDto;
import ua.kiev.minaeva.entity.Book;

@Mapper
public interface BookMapper {

    BookMapper INSTANCE = Mappers.getMapper(BookMapper.class);

    BookDto bookToDto(Book book);

    Book dtoToBook(BookDto bookDto);

}
