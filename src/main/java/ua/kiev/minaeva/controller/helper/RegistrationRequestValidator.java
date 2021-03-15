package ua.kiev.minaeva.controller.helper;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.apache.v2.ApacheHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.extern.java.Log;
import org.springframework.util.StringUtils;
import ua.kiev.minaeva.controller.RegistrationRequest;
import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.entity.RegistrationType;
import ua.kiev.minaeva.exception.BoobookValidationException;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

@Log
public class RegistrationRequestValidator {

    private static final String CLIENT_ID = "225049560926-gvnegbk3dnj6bgraot5h7d0gaoarge8b.apps.googleusercontent.com";
    private static final String SECRET = "9i0fNEkNXasmUAzLHkQbisjx";

    private RegistrationRequestValidator() {
    }

    public static void validateRegistrationRequest(RegistrationRequest request) throws BoobookValidationException {

        if (StringUtils.isEmpty(request.getEmail())) {
            throw new BoobookValidationException("Email cannot be empty");
        }

        if (RegistrationType.CUSTOM.equals(request.getRegistrationType()) &&
                StringUtils.isEmpty(request.getPassword())) {
            throw new BoobookValidationException("Password cannot be empty");
        }

        if (StringUtils.isEmpty(request.getName())) {
            throw new BoobookValidationException("Name cannot be empty");
        }

        if (StringUtils.isEmpty(request.getRegistrationType())) {
            throw new BoobookValidationException("Registration type cannot be empty");
        }

    }

    public static ReaderDto validateGoogleIdToken(String token) throws GeneralSecurityException, IOException,
            BoobookValidationException {

        GsonFactory gsonFactory = GsonFactory.getDefaultInstance();
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier
                .Builder(new ApacheHttpTransport(), gsonFactory)
                .setAudience(Collections.singletonList(CLIENT_ID))
                .build();

        GoogleIdToken idToken = verifier.verify(token);

        if (idToken == null) {
            throw new BoobookValidationException("Invalid ID token.");
        }

        Payload payload = idToken.getPayload();

        // not sure if needed
        String userId = payload.getSubject();
        boolean emailVerified = Boolean.valueOf(payload.getEmailVerified());
        if (!emailVerified) {
            log.warning("Email " + payload.getEmail() + " is not verified.");
        }

        ReaderDto readerDto = new ReaderDto();
        readerDto.setEmail(payload.getEmail());
        readerDto.setRegistrationType(RegistrationType.GOOGLE);
        readerDto.setName((String) payload.get("given_name"));
        readerDto.setSurname((String) payload.get("family_name"));
        return readerDto;
    }
}


