package ua.kiev.minaeva.dto;

import lombok.Data;

@Data
public class BookDto {

    private String title;
    private Long authorId;
    private String authorName;
    private Long ownerId;
    private String ownerName;

}
