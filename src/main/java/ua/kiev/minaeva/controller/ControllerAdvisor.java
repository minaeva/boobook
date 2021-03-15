package ua.kiev.minaeva.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import ua.kiev.minaeva.exception.BoobookAlreadyExistsException;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.exception.BoobookUnauthorizedException;
import ua.kiev.minaeva.exception.BoobookValidationException;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;

@ControllerAdvice
public class ControllerAdvisor extends ResponseEntityExceptionHandler {

    public static final String MESSAGE = "message";

    @ExceptionHandler(BoobookNotFoundException.class)
    public ResponseEntity<Object> handleNotFoundException(BoobookNotFoundException ex, WebRequest request) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put(MESSAGE, "Not found");

        return handleExceptionInternal(ex, body, new HttpHeaders(), HttpStatus.NOT_FOUND, request);
    }

    @ExceptionHandler(BoobookUnauthorizedException.class)
    public ResponseEntity<Object> handleNotFoundException(BoobookUnauthorizedException ex, WebRequest request) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put(MESSAGE, "Not authorized");

        return handleExceptionInternal(ex, body, new HttpHeaders(), HttpStatus.UNAUTHORIZED, request);
    }

    @ExceptionHandler(BoobookValidationException.class)
    public ResponseEntity<Object> handleValidationException(BoobookValidationException ex, WebRequest request) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put(MESSAGE, "Validation error");

        return handleExceptionInternal(ex, body, new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler(BoobookAlreadyExistsException.class)
    public ResponseEntity<Object> handleAlreadyExistsException(BoobookAlreadyExistsException ex, WebRequest request) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put(MESSAGE, "Already exists");

        return handleExceptionInternal(ex, body, new HttpHeaders(), HttpStatus.CONFLICT, request);
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<Object> handleValidationException(IOException ex, WebRequest request) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put(MESSAGE, "Accessing a file error");

        return handleExceptionInternal(ex, body, new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

}
