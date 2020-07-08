package ua.kiev.minaeva.dto;

import lombok.Data;
import lombok.ToString;
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
    private RegistrationType registrationType;
    private boolean isFriend;

}
