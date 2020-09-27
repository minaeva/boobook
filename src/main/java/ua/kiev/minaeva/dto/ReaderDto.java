package ua.kiev.minaeva.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import ua.kiev.minaeva.entity.RegistrationType;

@Data
public class ReaderDto {

    private Long id;
    private String email;

    @JsonIgnore
    private String password;

    private String name;
    private String surname;

    private String country;
    private String city;
    private String district;
    private String fbPage;
    private String telegram;
    private String viber;

    private Integer yearOfBirth;
    private Integer gender;

    private String bookToTheMoon;
    private String bookOfTheYear;
    private String hobby;
    private String hero;
    private String superPower;

    private byte[] image;

    private RegistrationType registrationType;
    private boolean isFriend;

}
