package ua.kiev.minaeva.dto;

import lombok.Data;
import ua.kiev.minaeva.entity.Author;
import ua.kiev.minaeva.entity.Reader;

@Data
public class BookDto {

    private String title;
    private Author author;
    private Reader owner;

}
