package ua.kiev.minaeva.dto;

import lombok.Data;

@Data
public class BookDto {

    private Long id;
    private String title;
    private Long authorId;
    private String authorName;
    private String authorSurname;
    private Long ownerId;
    private String ownerName;

}
