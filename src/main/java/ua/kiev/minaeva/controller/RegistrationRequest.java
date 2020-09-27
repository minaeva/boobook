package ua.kiev.minaeva.controller;

import lombok.Data;
import lombok.ToString;
import ua.kiev.minaeva.entity.RegistrationType;

@Data
@ToString(exclude = "password")
public class RegistrationRequest {

    private String email;
    private String password;
    private String name;
    //    private String surname;
//    private String city;
    private String fbPage;
    private RegistrationType registrationType;

}
