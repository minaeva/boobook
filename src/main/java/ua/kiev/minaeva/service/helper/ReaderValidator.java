package ua.kiev.minaeva.service.helper;

import org.springframework.util.StringUtils;
import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.entity.RegistrationType;
import ua.kiev.minaeva.exception.BoobookValidationException;

public class ReaderValidator {

    public static void validateReader(ReaderDto readerDto) throws BoobookValidationException {
        if (StringUtils.isEmpty(readerDto.getLogin())) {
            throw new BoobookValidationException("Login cannot be empty");
        }

        if (RegistrationType.CUSTOM.equals(readerDto.getRegistrationType())) {
            if (StringUtils.isEmpty(readerDto.getPassword())) {
                throw new BoobookValidationException("Password cannot be empty");
            }
        }

        if (StringUtils.isEmpty(readerDto.getName())) {
            throw new BoobookValidationException("Name cannot be empty");
        }
    }

}
