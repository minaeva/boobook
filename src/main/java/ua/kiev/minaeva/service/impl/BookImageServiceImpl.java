package ua.kiev.minaeva.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ua.kiev.minaeva.entity.BookImage;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.repository.BookImageRepository;

import java.util.List;

@Service
@RequiredArgsConstructor

public class BookImageServiceImpl {

    private final BookImageRepository bookImageRepository;

    public List<BookImage> getAllByBookId(Long id) throws BoobookNotFoundException {
        List<BookImage> bookImages = bookImageRepository.findAllByBook_Id(id)
                .orElseThrow(() -> new BoobookNotFoundException("No images found"));

        return bookImages;
    }
}
