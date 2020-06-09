package ua.kiev.minaeva.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import ua.kiev.minaeva.config.jwt.JwtProvider;
import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.entity.RegistrationType;
import ua.kiev.minaeva.service.ReaderService;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static ua.kiev.minaeva.prototype.ReaderPrototype.aReaderDto;
import static ua.kiev.minaeva.prototype.RegistrationRequestPrototype.*;

public class AuthControllerTest {

    MockMvc mockMvc;
    ObjectMapper objectMapper;
    ReaderService readerService;
    JwtProvider jwtProvider;

    @BeforeEach
    void setUp() {
        readerService = mock(ReaderService.class);
        jwtProvider = mock(JwtProvider.class);
        mockMvc = MockMvcBuilders
                .standaloneSetup(new AuthController(readerService, jwtProvider))
                .setControllerAdvice(new ControllerAdvisor())
                .build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void registerReader_success() throws Exception {
        when(readerService.createReader(any(ReaderDto.class))).thenReturn(aReaderDto());

        mockMvc.perform(post("/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(aRequest())))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json(objectMapper.writeValueAsString(new RegistrationResponse())));
    }

    @Test
    void registerReader_emptyLogin_exception() throws Exception {
        RegistrationRequest request = aRequest();
        request.setLogin("");
        when(readerService.createReader(any(ReaderDto.class))).thenReturn(aReaderDto());

        MvcResult result = mockMvc.perform(post("/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andReturn();

        String message = result.getResponse().getContentAsString();
        assertTrue(message.contains("Validation error"));
    }

    @Test
    void registerReader_emptyPassword_exception() throws Exception {
        RegistrationRequest request = aRequest();
        request.setPassword("");
        when(readerService.createReader(any(ReaderDto.class))).thenReturn(aReaderDto());

        MvcResult result = mockMvc.perform(post("/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andReturn();

        String message = result.getResponse().getContentAsString();
        assertTrue(message.contains("Validation error"));
    }

    @Test
    void registerReader_emptyName_exception() throws Exception {
        RegistrationRequest request = aRequest();
        request.setName("");
        when(readerService.createReader(any(ReaderDto.class))).thenReturn(aReaderDto());

        MvcResult result = mockMvc.perform(post("/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andReturn();

        String message = result.getResponse().getContentAsString();
        assertTrue(message.contains("Validation error"));
    }

    @Test
    void registerReader_fbReader() throws Exception {
        RegistrationRequest request = aRequest();
        request.setRegistrationType(RegistrationType.FB);
        ReaderDto readerDto = aReaderDto();
        readerDto.setRegistrationType(RegistrationType.FB);
        when(readerService.createReader(any(ReaderDto.class))).thenReturn(readerDto);
        when(jwtProvider.generateToken(anyString())).thenReturn("test_request_token");

        mockMvc.perform(post("/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json(objectMapper.writeValueAsString(aResponse())));
    }

    @Test
    void authenticate_success() throws Exception {
        when(readerService.getByLoginAndPassword(anyString(), anyString())).thenReturn(aReaderDto());
        when(jwtProvider.generateToken(anyString())).thenReturn("test_request_token");

        mockMvc.perform(post("/users/auth")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(anAuthRequest())))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json(objectMapper.writeValueAsString(anAuthResponse())));
    }

    @Test
    void authenticate_nonAuthorized() throws Exception {
        when(readerService.getByLoginAndPassword(anyString(), anyString()))
                .thenReturn(null);

        MvcResult result = mockMvc.perform(post("/users/auth")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(anAuthRequest())))
                .andExpect(status().isUnauthorized())
                .andReturn();

        String message = result.getResponse().getContentAsString();
        assertTrue(message.contains("Not authorized"));

    }

}
