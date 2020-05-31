package ua.kiev.minaeva.controller;

import lombok.Data;
import lombok.ToString;
import ua.kiev.minaeva.entity.RegistrationType;

import javax.validation.constraints.*;

@Data
@ToString(exclude = "password")
public class RegistrationRequest {

    @NotEmpty
    private String login;

    @NotEmpty
    private String password;

    @NotEmpty
    private String name;

    private String surname;
    private String city;
    private String fbPage;
    private String email;
    private RegistrationType registrationType;

}
