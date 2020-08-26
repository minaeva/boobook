package ua.kiev.minaeva.service;

import ua.kiev.minaeva.entity.BookImage;
import ua.kiev.minaeva.exception.BoobookNotFoundException;

import java.util.List;

public interface BookImageService {

    List<BookImage> getByBookId(Long id) throws BoobookNotFoundException;

    BookImage save(byte[] image, Long bookId) throws BoobookNotFoundException;
}
