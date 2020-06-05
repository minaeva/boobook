package ua.kiev.minaeva.prototype;

import org.mapstruct.factory.Mappers;
import ua.kiev.minaeva.dto.BookDto;
import ua.kiev.minaeva.entity.Author;
import ua.kiev.minaeva.entity.Book;
import ua.kiev.minaeva.entity.Reader;
import ua.kiev.minaeva.mapper.BookMapper;

import static ua.kiev.minaeva.prototype.ReaderPrototype.aReader;

public class BookPrototype {

    private static BookMapper mapper = Mappers.getMapper(BookMapper.class);

    public static Book aBook() {
        Author author = new Author();
        author.setName("test_author_name");
        author.setSurname("test_author_surname");

        Reader reader = aReader();

        Book book = new Book();
        book.setTitle("test_title");
        book.setAuthor(author);
        book.setOwner(reader);

        return book;
    }

    public static BookDto aBookDto() {
        return mapper.bookToDto(aBook());
    }
}
