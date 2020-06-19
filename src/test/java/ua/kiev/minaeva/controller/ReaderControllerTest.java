package ua.kiev.minaeva.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.exception.BoobookValidationException;
import ua.kiev.minaeva.service.FriendshipService;
import ua.kiev.minaeva.service.ReaderService;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static ua.kiev.minaeva.prototype.ReaderPrototype.aReaderDto;

public class ReaderControllerTest {

    MockMvc mockMvc;
    ObjectMapper objectMapper;
    ReaderService readerService;
    FriendshipService friendshipService;

    @BeforeEach
    void setUp() {
        readerService = mock(ReaderService.class);
        friendshipService = mock(FriendshipService.class);
        mockMvc = MockMvcBuilders
                .standaloneSetup(new ReaderController(readerService, friendshipService))
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

        mockMvc.perform(get("/users/login").param("login", "test"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json(objectMapper.writeValueAsString(aReaderDto())));
    }

    @Test
    void getByLogin_notFound() throws Exception {
        when(readerService.getByLogin(any())).thenThrow(BoobookNotFoundException.class);

        MvcResult result = mockMvc.perform(get("/users/login").param("login", "test"))
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

    @Test
    void getById() throws Exception {
        when(readerService.getById(anyLong())).thenReturn(aReaderDto());

        mockMvc.perform(get("/users/5"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json(objectMapper.writeValueAsString(aReaderDto())));
    }

    @Test
    void getById_notFound() throws Exception {
        when(readerService.getById(anyLong()))
                .thenThrow(BoobookNotFoundException.class);

        MvcResult result = mockMvc.perform(get("/users/5"))
                .andExpect(status().isNotFound())
                .andReturn();

        String message = result.getResponse().getContentAsString();
        assertTrue(message.contains("Not found"));

    }

    @Test
    void getByName() throws Exception {
        when(readerService.getByName(anyString()))
                .thenReturn(Collections.singletonList(aReaderDto()));

        mockMvc.perform(get("/users/name").param("name", "test"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json(objectMapper.writeValueAsString(Collections.singletonList(aReaderDto()))));
    }

    @Test
    void getFriends() throws Exception {
        when(friendshipService.getFriendsByReaderId(anyLong()))
                .thenReturn(Collections.singletonList(aReaderDto()));

        mockMvc.perform(get("/users/friends/5"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json(objectMapper.writeValueAsString(Collections.singletonList(aReaderDto()))));
    }

    @Test
    void getFriends_notFound() throws Exception {
        when(friendshipService.getFriendsByReaderId(anyLong()))
                .thenThrow(BoobookNotFoundException.class);

        MvcResult result = mockMvc.perform(get("/users/friends/5"))
                .andExpect(status().isNotFound())
                .andReturn();

        String message = result.getResponse().getContentAsString();
        assertTrue(message.contains("Not found"));
    }

    @Test
    void addFriend() throws Exception {
        doNothing().when(friendshipService).addFriend(anyLong(), anyLong());

        mockMvc.perform(post("/users/friends/1/3"))
                .andExpect(status().isOk());
    }

    @Test
    void addFriend_notFound() throws Exception {
        doThrow(BoobookNotFoundException.class)
                .when(friendshipService).addFriend(anyLong(), anyLong());

        MvcResult result = mockMvc.perform(post("/users/friends/5/4"))
                .andExpect(status().isNotFound())
                .andReturn();

        String message = result.getResponse().getContentAsString();
        assertTrue(message.contains("Not found"));
    }

    @Test
    void addFriend_validationError() throws Exception {
        doThrow(BoobookValidationException.class)
                .when(friendshipService).addFriend(anyLong(), anyLong());

        MvcResult result = mockMvc.perform(post("/users/friends/5/5"))
                .andExpect(status().isBadRequest())
                .andReturn();

        String message = result.getResponse().getContentAsString();
        assertTrue(message.contains("Validation error"));
    }

    @Test
    void removeFriend() throws Exception {
        doNothing().when(friendshipService).removeFriend(anyLong(), anyLong());

        mockMvc.perform(delete("/users/friends/1/3"))
                .andExpect(status().isOk());
    }

    @Test
    void removeFriend_notFound() throws Exception {
        doThrow(BoobookNotFoundException.class)
                .when(friendshipService).removeFriend(anyLong(), anyLong());

        MvcResult result = mockMvc.perform(delete("/users/friends/5/4"))
                .andExpect(status().isNotFound())
                .andReturn();

        String message = result.getResponse().getContentAsString();
        assertTrue(message.contains("Not found"));
    }

}
