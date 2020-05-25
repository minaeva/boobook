package ua.kiev.minaeva.dto;

import lombok.Data;

@Data
public class ReaderDto {

    private String login;
    private String password;
    private String name;
    private String surname;
    private String city;
    private String fbPage;
    private String email;
}
