package ua.kiev.minaeva.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.service.ReaderService;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static ua.kiev.minaeva.prototype.ReaderPrototype.aReaderDto;

public class ReaderControllerTest {

    MockMvc mockMvc;
    ObjectMapper objectMapper;
    ReaderService readerService;

    @BeforeEach
    void setUp() {
        readerService = mock(ReaderService.class);
        mockMvc = MockMvcBuilders
                .standaloneSetup(new ReaderController(readerService))
                .setControllerAdvice(new ControllerAdvisor())
                .build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void createReader() throws Exception {
        when(readerService.createReader(any())).thenReturn(aReaderDto());

        mockMvc.perform(post("/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(aReaderDto())))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json(objectMapper.writeValueAsString(aReaderDto())));
    }

    @Test
    void getByLogin() throws Exception {
        when(readerService.getByLogin(any())).thenReturn(aReaderDto());

        mockMvc.perform(get("/users/login")
                .param("login", "test"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json(objectMapper.writeValueAsString(aReaderDto())));
    }

    @Test
    void getByLogin_notFound() throws Exception {
        when(readerService.getByLogin(any())).thenThrow(BoobookNotFoundException.class);

        MvcResult result = mockMvc.perform(get("/users/login")
                .param("login", "test"))
                .andExpect(status().isNotFound())
                .andReturn();

        String message = result.getResponse().getContentAsString();
        assertTrue(message.contains("Not found"));
    }

    @Test
    void getAllReaders() throws Exception {
        when(readerService.getAll()).thenReturn(Collections.singletonList(aReaderDto()));

        mockMvc.perform(get("/users"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json(objectMapper.writeValueAsString(Collections.singletonList(aReaderDto()))));
    }

}
