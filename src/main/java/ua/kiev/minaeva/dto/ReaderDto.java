package ua.kiev.minaeva.dto;

import lombok.Data;
import lombok.ToString;
import ua.kiev.minaeva.entity.Gender;
import ua.kiev.minaeva.entity.RegistrationType;

@Data
@ToString(exclude = "password")
public class ReaderDto {

    private Long id;
    private String email;
    private String password;
    private String name;
    private String surname;

    private String city;
    private String fbPage;
    private String telegram;
    private String viber;

    private int yearOfBirth;
    private Gender gender;

    private String bookToTheMoon;
    private String bookOfTheYear;
    private String hobby;
    private String hero;
    private String superPower;

    private byte[] image;

    private RegistrationType registrationType;
    private boolean isFriend;

}
