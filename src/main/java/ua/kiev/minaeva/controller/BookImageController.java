package ua.kiev.minaeva.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.service.BookImageService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/images")
@RequiredArgsConstructor
@Log
@CrossOrigin
public class BookImageController {

    private final BookImageService bookImageService;

    @GetMapping("/{bookId}")
    public List<byte[]> getImagesById(@PathVariable final Long bookId) throws BoobookNotFoundException {
        log.info("handling GET IMAGES BY BOOK ID request: " + bookId);
        return bookImageService.getByBookId(bookId).stream()
                .map(bookImage -> bookImage.getImage())
                .map(image -> Base64.getDecoder().decode(image))
                .collect(Collectors.toList());
    }

    @PostMapping("/upload")
    public ResponseEntity<ResponseMessage> uploadFiles(@RequestParam("files") MultipartFile[] files, @RequestParam(
            "bookId") final Long bookId) throws IOException, BoobookNotFoundException {
        if (files.length == 0) {
            throw new BoobookNotFoundException("Not any file was provided");
        }

        List<String> fileNames = new ArrayList<>();
        for (MultipartFile file : Arrays.asList(files)) {
            byte[] encodedByteArray = Base64.getEncoder().encode(file.getBytes());
            bookImageService.save(encodedByteArray, bookId);
            fileNames.add(file.getOriginalFilename());
        }

        return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage("Uploaded successfully: " + fileNames));
    }

}
