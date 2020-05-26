package ua.kiev.minaeva.service.impl;

import lombok.RequiredArgsConstructor;
import org.assertj.core.util.Lists;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import ua.kiev.minaeva.dto.BookDto;
import ua.kiev.minaeva.entity.Book;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.exception.BoobookValidationException;
import ua.kiev.minaeva.mapper.BookMapper;
import ua.kiev.minaeva.repository.BookRepository;
import ua.kiev.minaeva.service.BookService;

import java.util.List;
import java.util.stream.Collectors;

import static ua.kiev.minaeva.service.helper.BookValidator.validateBook;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;

    private BookMapper mapper = Mappers.getMapper(BookMapper.class);

    public Book createBook(BookDto bookDto) throws BoobookValidationException {
        validateBook(bookDto);

        Book book = mapper.dtoToBook(bookDto);
        return bookRepository.save(book);
    }

    public Book updateBook(BookDto bookDto) throws BoobookValidationException {
        validateBook(bookDto);

        Book book = mapper.dtoToBook(bookDto);
        return bookRepository.save(book);
    }

    public void deleteBook(BookDto bookDto) {
        bookRepository.delete(mapper.dtoToBook(bookDto));
    }

    public List<BookDto> getAll() {
        return Lists.newArrayList(bookRepository.findAll()).stream()
                .map(b -> mapper.bookToDto(b)).collect(Collectors.toList());
    }

    public BookDto getById(Long id) throws BoobookNotFoundException {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new BoobookNotFoundException("No book found with id " + id));
        return mapper.bookToDto(book);
    }

}
