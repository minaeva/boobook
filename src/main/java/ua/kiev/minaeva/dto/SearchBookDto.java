package ua.kiev.minaeva.dto;

import lombok.Data;

@Data
public class SearchBookDto {

    private String title;
    private String authorName;
    private String authorSurname;
    private String city;

    private Integer yearFrom;
    private Integer yearTo;

    private Integer ageGroupFrom;
    private Integer ageGroupTo;

    private Integer cover;
    private Integer language;
    private Integer illustrations;

}
