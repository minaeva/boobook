package ua.kiev.minaeva.prototype;

import ua.kiev.minaeva.controller.AuthRequest;
import ua.kiev.minaeva.controller.AuthResponse;
import ua.kiev.minaeva.controller.RegistrationRequest;
import ua.kiev.minaeva.controller.RegistrationResponse;
import ua.kiev.minaeva.entity.RegistrationType;

public class RegistrationRequestPrototype {

    public static RegistrationRequest aRequest() {
        RegistrationRequest request = new RegistrationRequest();
        request.setEmail("test_request_email");
        request.setPassword("test_request_pass");
        request.setName("test_request_name");
        request.setSurname("test_request_surname");
        request.setCity("test_request_city");
        request.setFbPage("test_request_fbPage");
        request.setRegistrationType(RegistrationType.CUSTOM);

        return request;
    }

    public static RegistrationResponse aResponse() {
        RegistrationResponse response = new RegistrationResponse();
        response.setEmail("test_request_email");
        response.setJwt("test_request_token");

        return response;
    }

    public static AuthRequest anAuthRequest() {
        AuthRequest request = new AuthRequest();
        request.setEmail("email");
        request.setPassword("password");

        return request;
    }

    public static AuthResponse anAuthResponse() {
        AuthResponse response = new AuthResponse();
        response.setJwt("test_request_token");
        response.setEmail("test@gmail.com");

        return response;
    }

}
