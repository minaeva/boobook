package ua.kiev.minaeva.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.service.BookService;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static ua.kiev.minaeva.prototype.BookPrototype.aBookDto;

public class BookControllerTest {

    MockMvc mockMvc;
    ObjectMapper objectMapper;
    BookService bookService;

    @BeforeEach
    void setUp() {
        bookService = mock(BookService.class);
        mockMvc = MockMvcBuilders
                .standaloneSetup(new BookController(bookService))
                .setControllerAdvice(new ControllerAdvisor())
                .build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void createReader() throws Exception {
        when(bookService.createBook(any())).thenReturn(aBookDto());
        mockMvc.perform(post("/books")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(aBookDto())))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json(objectMapper.writeValueAsString(aBookDto())));
    }

    @Test
    void getAllBooks() throws Exception {
        when(bookService.getAll()).thenReturn(Collections.singletonList(aBookDto()));
        mockMvc.perform(get("/books"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json(objectMapper.writeValueAsString(Collections.singletonList(aBookDto()))));
    }

    @Test
    void getBookById() throws Exception {
        when(bookService.getById(anyLong())).thenReturn(aBookDto());
        mockMvc.perform(get("/books/5"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json(objectMapper.writeValueAsString(aBookDto())));
    }

    @Test
    void getBookById_notFound() throws Exception {
        when(bookService.getById(anyLong())).thenThrow(BoobookNotFoundException.class);

        MvcResult result = mockMvc.perform(get("/books/5"))
                .andExpect(status().isNotFound())
                .andReturn();

        String message = result.getResponse().getContentAsString();
        assertTrue(message.contains("Not found"));
    }

    @Test
    void getByTitle() throws Exception {
        when(bookService.getByTitle(anyString())).thenReturn(Collections.singletonList(aBookDto()));
        mockMvc.perform(get("/books/title/test title request"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json(objectMapper.writeValueAsString(Collections.singletonList(aBookDto()))));
    }

    @Test
    void getByTitle_notFound() throws Exception {
        when(bookService.getByTitle(anyString())).thenThrow(BoobookNotFoundException.class);

        MvcResult result = mockMvc.perform(get("/books/title/test title request"))
                .andExpect(status().isNotFound())
                .andReturn();

        String message = result.getResponse().getContentAsString();
        assertTrue(message.contains("Not found"));
    }

    @Test
    void getByAuthor() throws Exception {
        when(bookService.getByAuthor(anyLong())).thenReturn(Collections.singletonList(aBookDto()));
        mockMvc.perform(get("/books/author/5"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json(objectMapper.writeValueAsString(Collections.singletonList(aBookDto()))));
    }

    @Test
    void getByAuthor_notFound() throws Exception {
        when(bookService.getByAuthor(anyLong())).thenThrow(BoobookNotFoundException.class);

        MvcResult result = mockMvc.perform(get("/books/author/5"))
                .andExpect(status().isNotFound())
                .andReturn();

        String message = result.getResponse().getContentAsString();
        assertTrue(message.contains("Not found"));
    }


}
