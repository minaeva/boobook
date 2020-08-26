package ua.kiev.minaeva.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ua.kiev.minaeva.entity.BookImage;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.exception.BoobookValidationException;
import ua.kiev.minaeva.service.BookImageService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/images")
@RequiredArgsConstructor
@Log
@CrossOrigin
public class BookImageController {

    private final BookImageService bookImageService;

    @GetMapping("/{bookId}")
    public List<BookImage> getImagesById(@PathVariable final Long bookId) throws BoobookNotFoundException {
        log.info("handling GET IMAGES BY BOOK ID request: " + bookId);
        return bookImageService.getByBookId(bookId);
    }

    @PostMapping(value = "/uploadOne")
    public BookImage uploadImage(@RequestParam("file") MultipartFile file) throws IOException, BoobookNotFoundException, BoobookValidationException {
        log.info("UPLOADING the image request: " + file);

        if (file.isEmpty()) {
            throw new BoobookValidationException("File is empty");
        }
        byte[] decodedByteArray = encodeToBase64(file.getBytes());
        return bookImageService.save(decodedByteArray, 1L);
    }

    @PostMapping("/upload")
    public ResponseEntity<ResponseMessage> uploadFiles(@RequestParam("files") MultipartFile[] files,
                                                       @RequestParam("bookId") final Long bookId) {
        if (files.length == 0) {
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage("length = 0"));
        }
        String message = "";
        try {
            List<String> fileNames = new ArrayList<>();

            Arrays.asList(files).stream()
                    .forEach(aFile -> {
                        byte[] decodedByteArray = new byte[0];
                        try {
                            decodedByteArray = encodeToBase64(aFile.getBytes());
                            bookImageService.save(decodedByteArray, bookId);
                        } catch (IOException | BoobookNotFoundException e) {
                            e.printStackTrace();
                        }
                        fileNames.add(aFile.getOriginalFilename());
                    });

            message = "Uploaded the files successfully: " + fileNames;
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
        } catch (Exception e) {
            message = "Fail to upload files!";
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
        }
    }

    private byte[] encodeToBase64(byte[] input) {
        return Base64.getEncoder().encode(input);
    }
}
