package ua.kiev.minaeva.service.impl;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import ua.kiev.minaeva.dto.BookDto;
import ua.kiev.minaeva.dto.SearchBookDto;
import ua.kiev.minaeva.dto.SearchCriteria;
import ua.kiev.minaeva.dto.SearchOperation;
import ua.kiev.minaeva.entity.Author;
import ua.kiev.minaeva.entity.Book;
import ua.kiev.minaeva.entity.BookImage;
import ua.kiev.minaeva.entity.Reader;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.exception.BoobookValidationException;
import ua.kiev.minaeva.mapper.BookMapper;
import ua.kiev.minaeva.repository.AuthorRepository;
import ua.kiev.minaeva.repository.BookImageRepository;
import ua.kiev.minaeva.repository.BookRepository;
import ua.kiev.minaeva.repository.BookSpecification;
import ua.kiev.minaeva.repository.ReaderRepository;
import ua.kiev.minaeva.service.BookImageService;
import ua.kiev.minaeva.service.BookService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static ua.kiev.minaeva.service.helper.BookValidator.validateBook;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    public static final String NO_BOOK_FOUND_WITH_ID = "No book found with id ";
    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final ReaderRepository readerRepository;
    private final BookImageRepository bookImageRepository;

    private BookMapper mapper = Mappers.getMapper(BookMapper.class);

    public BookDto createBook(BookDto bookDto) throws BoobookValidationException, BoobookNotFoundException {

        validateBook(bookDto);
        Book newBook = mapper.dtoToBook(bookDto);
        Author newBookAuthor;
        Reader newBookOwner;

        newBookAuthor = getOrCreateAuthor(bookDto);
        newBook.setAuthor(newBookAuthor);

        newBookOwner = getOwner(bookDto);
        newBook.setOwner(newBookOwner);

        return mapper.bookToDto(bookRepository.save(newBook));
    }

    public BookDto updateBook(BookDto bookDto) throws BoobookValidationException, BoobookNotFoundException {
        validateBook(bookDto);

        bookRepository.findById(bookDto.getId())
                .orElseThrow(() -> new BoobookNotFoundException(NO_BOOK_FOUND_WITH_ID + bookDto.getId()));

        Book bookToUpdate = mapper.dtoToBook(bookDto);
        Author newBookAuthor = getOrCreateAuthor(bookDto);
        bookToUpdate.setAuthor(newBookAuthor);

        Reader newBookOwner = getOwner(bookDto);
        bookToUpdate.setOwner(newBookOwner);

        return mapper.bookToDto(bookRepository.save(bookToUpdate));
    }

    public void deleteBook(Long bookId) throws BoobookNotFoundException {
        Book existentBook = bookRepository.findById(bookId)
                .orElseThrow(() -> new BoobookNotFoundException(NO_BOOK_FOUND_WITH_ID + bookId));

        Optional<List<BookImage>> existentImages = bookImageRepository.findAllByBook_Id(bookId);
        if (existentImages.isPresent()) {
            for (BookImage image: existentImages.get()) {
                bookImageRepository.delete(image);
            }
        }
        bookRepository.delete(existentBook);
    }

    public List<BookDto> getAll() {
        List<Book> books = bookRepository.findAll();

        return books.stream()
                .map(book -> mapper.bookToDto(book))
                .collect(Collectors.toList());
    }

    public BookDto getById(Long id) throws BoobookNotFoundException {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new BoobookNotFoundException(NO_BOOK_FOUND_WITH_ID + id));

        return mapper.bookToDto(book);
    }

    public List<BookDto> getByTitle(String title) throws BoobookNotFoundException {
        List<Book> foundBooks = bookRepository.findByTitle(title)
                .orElseThrow(() ->
                        new BoobookNotFoundException("No book found with title " + title));

        return foundBooks.stream()
                .map(b -> mapper.bookToDto(b))
                .collect(Collectors.toList());
    }

    public List<BookDto> getByAuthor(Long authorId) throws BoobookNotFoundException {
        Author author = authorRepository.findById(authorId)
                .orElseThrow(() ->
                        new BoobookNotFoundException("No author found with id " + authorId));

        List<Book> foundBooks = bookRepository.findByAuthor(author)
                .orElseThrow(() ->
                        new BoobookNotFoundException("No book found written by author "
                                + author.getName() + author.getSurname()));

        return foundBooks.stream()
                .map(b -> mapper.bookToDto(b))
                .collect(Collectors.toList());
    }

    public List<BookDto> getByOwner(Long readerId) throws BoobookNotFoundException {
        Reader reader = readerRepository.findById(readerId)
                .orElseThrow(() ->
                        new BoobookNotFoundException("Reader with id " + readerId + " cannot be found"));

        List<Book> readerBooks = bookRepository.findByOwnerOrderByIdDesc(reader)
                .orElseThrow(() ->
                        new BoobookNotFoundException("The reader " + reader.getId() + " "
                                + reader.getEmail() + " " + reader.getName() + " does not have any book"));

        return readerBooks.stream()
                .map(b -> mapper.bookToDto(b))
                .collect(Collectors.toList());
    }

    public List<BookDto> getByOwnerActive(Long readerId) throws BoobookNotFoundException {
        List<BookDto> activeAndInactive = getByOwner(readerId);
        return filterActive(activeAndInactive);
    }

    private List<BookDto> filterActive(List<BookDto> activeAndInactive) throws BoobookNotFoundException {
        return activeAndInactive.stream()
                .filter(bookDto -> bookDto.isActive())
                .collect(Collectors.toList());
    }

    public BookDto setInactive(Long bookId) throws BoobookNotFoundException {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BoobookNotFoundException(NO_BOOK_FOUND_WITH_ID + bookId));

        book.setActive(false);

        return mapper.bookToDto(bookRepository.save(book));
    }

    public BookDto setActive(Long bookId) throws BoobookNotFoundException {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BoobookNotFoundException(NO_BOOK_FOUND_WITH_ID + bookId));

        book.setActive(true);

        return mapper.bookToDto(bookRepository.save(book));
    }

    public List<BookDto> getByQuery(SearchBookDto searchBookDto) throws BoobookNotFoundException {
        List<Book> foundBooks;

        BookSpecification specification = new BookSpecification();

        if (StringUtils.hasText(searchBookDto.getTitle())) {
            specification.add(new SearchCriteria("title", searchBookDto.getTitle(), SearchOperation.MATCH));
        }

        if (StringUtils.hasText(searchBookDto.getLanguage())) {
            specification.add(new SearchCriteria("language", searchBookDto.getLanguage(), SearchOperation.EQUAL));
        }

        if (searchBookDto.getAgeGroupFrom() != null) {
            specification.add(new SearchCriteria("ageGroup", searchBookDto.getAgeGroupFrom(), SearchOperation.GREATER_THAN_EQUAL));
        }

        if (searchBookDto.getAgeGroupTo() != null) {
            specification.add(new SearchCriteria("ageGroup", searchBookDto.getAgeGroupTo(), SearchOperation.LESS_THAN_EQUAL));
        }

        if (StringUtils.hasText(searchBookDto.getAuthorName())) {
            specification.add(new SearchCriteria(("name"), searchBookDto.getAuthorName(), SearchOperation.AUTHOR_JOIN));
        }

        if (StringUtils.hasText(searchBookDto.getAuthorSurname())) {
            specification.add(new SearchCriteria(("surname"), searchBookDto.getAuthorSurname(), SearchOperation.AUTHOR_JOIN));
        }

/*
        if (StringUtils.hasText(searchBookDto.getCity())) {
            specification.add(new SearchCriteria(()));
        }

    private Integer yearFrom;
    private Integer yearTo;

    private Boolean hardCover;
    private String language;
    private Integer illustrations;


*/
        foundBooks = bookRepository.findAll(specification);
        return foundBooks.stream()
                .map(b -> mapper.bookToDto(b))
                .collect(Collectors.toList());

    }


    private Author getOrCreateAuthor(BookDto bookDto) {
        Author newBookAuthor;
        Optional<Author> existentAuthor = authorRepository
                .findByNameAndSurname(bookDto.getAuthorName(), bookDto.getAuthorSurname());
        if (existentAuthor.isPresent()) {
            newBookAuthor = existentAuthor.get();
        } else {
            newBookAuthor = authorRepository.save(new Author(bookDto.getAuthorName(), bookDto.getAuthorSurname()));
        }
        return newBookAuthor;
    }

    private Reader getOwner(BookDto bookDto) throws BoobookNotFoundException {
        Reader newBookOwner;
        Optional<Reader> existentOwner = readerRepository.findById(bookDto.getOwnerId());
        if (existentOwner.isPresent()) {
            newBookOwner = existentOwner.get();
        } else {
            throw new BoobookNotFoundException("reader with id " + bookDto.getOwnerId() + " cannot be found");
        }
        return newBookOwner;
    }

}
