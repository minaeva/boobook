package ua.kiev.minaeva.dto;

import lombok.Data;

@Data
public class SearchReaderDto {

    private String name;
    private String surname;
    private String country;
    private String city;
    private String district;
    private Integer gender;
}
