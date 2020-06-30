package ua.kiev.minaeva.controller.helper;

import org.springframework.util.StringUtils;
import ua.kiev.minaeva.controller.RegistrationRequest;
import ua.kiev.minaeva.exception.BoobookValidationException;

public class RegistrationRequestValidator {

    public static void validateRegistrationRequest(RegistrationRequest request) throws BoobookValidationException {
        if (StringUtils.isEmpty(request.getEmail())) {
            throw new BoobookValidationException("Email cannot be empty");
        }

        if (StringUtils.isEmpty(request.getPassword())) {
            throw new BoobookValidationException("Password cannot be empty");
        }

        if (StringUtils.isEmpty(request.getName())) {
            throw new BoobookValidationException("Name cannot be empty");
        }

        if (StringUtils.isEmpty(request.getRegistrationType())) {
            throw new BoobookValidationException("Registration type cannot be empty");
        }

    }

}
