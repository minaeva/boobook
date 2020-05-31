package ua.kiev.minaeva.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import org.mapstruct.factory.Mappers;
import ua.kiev.minaeva.dto.BookDto;
import ua.kiev.minaeva.entity.Book;

@Mapper
public interface BookMapper {

    BookMapper INSTANCE = Mappers.getMapper(BookMapper.class);

    @Mappings({
            @Mapping(target = "authorId", expression = "java(book.getAuthor().getId())"),
            @Mapping(target = "authorName",
                    expression = "java(book.getAuthor().getName() + \" \" + book.getAuthor().getSurname())"),
            @Mapping(target = "ownerId", expression = "java(book.getOwner().getId())"),
            @Mapping(target = "ownerName",
                    expression = "java(book.getOwner().getName() + \" \" + book.getOwner().getSurname())"),
    })
    BookDto bookToDto(Book book);

    Book dtoToBook(BookDto bookDto);

}
