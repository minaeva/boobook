package ua.kiev.minaeva.service.helper;

import org.springframework.util.StringUtils;
import ua.kiev.minaeva.dto.BookDto;
import ua.kiev.minaeva.exception.BoobookValidationException;

public class BookValidator {

    public static void validateBook(BookDto bookDto) throws BoobookValidationException {
        if (StringUtils.isEmpty(bookDto.getTitle())) {
            throw new BoobookValidationException("Title cannot be empty");
        }

        if (StringUtils.isEmpty(bookDto.getAuthorId())) {
            throw new BoobookValidationException("Author cannot be empty");
        }

        if (StringUtils.isEmpty(bookDto.getOwnerId())) {
            throw new BoobookValidationException("Reader cannot be empty");
        }
    }

}
