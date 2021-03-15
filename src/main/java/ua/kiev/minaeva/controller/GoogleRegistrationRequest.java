package ua.kiev.minaeva.controller;

import lombok.Data;
import lombok.ToString;
import ua.kiev.minaeva.entity.RegistrationType;

@Data
@ToString(exclude = "password")
public class GoogleRegistrationRequest {

    private String email;
    private String name;
    private String surname;
    private RegistrationType registrationType;
    private String googleIdToken;

}
