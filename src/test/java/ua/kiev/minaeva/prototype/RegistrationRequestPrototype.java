package ua.kiev.minaeva.prototype;

import ua.kiev.minaeva.controller.AuthRequest;
import ua.kiev.minaeva.controller.AuthResponse;
import ua.kiev.minaeva.controller.RegistrationRequest;
import ua.kiev.minaeva.controller.RegistrationResponse;
import ua.kiev.minaeva.entity.RegistrationType;

public class RegistrationRequestPrototype {

    public static RegistrationRequest aRequest() {
        RegistrationRequest request = new RegistrationRequest();
        request.setLogin("test_request_login");
        request.setPassword("test_request_pass");
        request.setName("test_request_name");
        request.setSurname("test_request_surname");
        request.setEmail("test_request_email");
        request.setCity("test_request_city");
        request.setFbPage("test_request_fbPage");
        request.setRegistrationType(RegistrationType.CUSTOM);

        return request;
    }

    public static RegistrationResponse aResponse() {
        RegistrationResponse response = new RegistrationResponse();
        response.setLogin("test_request_login");
        response.setEmail("test_request_email");
        response.setToken("test_request_token");

        return response;
    }

    public static AuthRequest anAuthRequest() {
        AuthRequest request = new AuthRequest();
        request.setLogin("login");
        request.setPassword("password");

        return request;
    }

    public static AuthResponse anAuthResponse() {
        AuthResponse response = new AuthResponse();
        response.setToken("test_request_token");
        response.setEmail("test@gmail.com");

        return response;
    }

}
