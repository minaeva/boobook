package ua.kiev.minaeva.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.apache.commons.io.FilenameUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.exception.BoobookValidationException;
import ua.kiev.minaeva.service.BookImageService;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
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

    @PostMapping
    public ResponseEntity<ResponseMessage> saveFiles(@RequestParam("files") MultipartFile[] files,
                                                     @RequestParam("bookId") final Long bookId)
            throws IOException, BoobookNotFoundException, BoobookValidationException {
        log.info("handling SAVE IMAGES BY BOOK ID request: " + bookId);
        if (files.length == 0) {
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage("None file was selected for save"));
        }

        List<String> fileNames = new ArrayList<>();
        for (MultipartFile file : Arrays.asList(files)) {
            bookImageService.save(resizeEncode(file), bookId);
            fileNames.add(file.getOriginalFilename());
        }

        return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage("Uploaded successfully: " + fileNames));
    }

    @PutMapping
    public ResponseEntity<ResponseMessage> updateFiles(@RequestParam("files") MultipartFile[] files,
                                                       @RequestParam("bookId") final Long bookId)
            throws IOException, BoobookNotFoundException, BoobookValidationException {
        log.info("handling UPDATE IMAGES BY BOOK ID request: " + bookId);

        List<String> fileNames = new ArrayList<>();
        List<byte[]> encodedFiles = new ArrayList<>();

        for (MultipartFile file : Arrays.asList(files)) {
            //worked before resize
//            byte[] encodedByteArray = Base64.getEncoder().encode(file.getBytes());

            byte[] resizedEncoded = resizeEncode(file);
            encodedFiles.add(resizedEncoded);
            fileNames.add(file.getOriginalFilename());
        }
        bookImageService.update(encodedFiles, bookId);

        return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage("Uploaded successfully: " + fileNames));
    }

    private byte[] resizeEncode(MultipartFile file) throws IOException, BoobookValidationException {
        String extension = FilenameUtils.getExtension(file.getOriginalFilename());
        byte[] originalImage = file.getBytes();

        BufferedImage image;
        try (ByteArrayInputStream in = new ByteArrayInputStream(originalImage)) {
            image = ImageIO.read(in);
        }

        // resize didn't work
        //        byte[] resizedImage = resizeImage(originalImage, extension, 1200, 0);

        BufferedImage resizedImage = workingResizeImage(image, 1200, 0);

//        ImageIO.write(resizedImage, "jpg", new File("/Users/sveta/Documents/! pictures/20-08-21 kotomka/1.jpg"));

        byte[] resizedImageArray;
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            ImageIO.write(resizedImage, extension, outputStream);
            resizedImageArray = outputStream.toByteArray();
        }

        return Base64.getEncoder().encode(resizedImageArray);
    }

    private BufferedImage workingResizeImage(BufferedImage originalImage, int targetWidth, int targetHeight) {
        if (targetHeight == 0) {
            targetHeight = (targetWidth * originalImage.getHeight()) / originalImage.getWidth();
        }
        if (targetWidth == 0) {
            targetWidth = (targetHeight * originalImage.getWidth()) / originalImage.getHeight();
        }

        BufferedImage resizedImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics2D = resizedImage.createGraphics();
        graphics2D.drawImage(originalImage, 0, 0, targetWidth, targetHeight, null);
        graphics2D.dispose();
        return resizedImage;
    }

    private byte[] resizeImage(byte[] originalImageArray, String extension, int targetWidth, int targetHeight) throws IOException {
        BufferedImage image;
        try (ByteArrayInputStream in = new ByteArrayInputStream(originalImageArray)) {
            image = ImageIO.read(in);
        }
        if (targetHeight == 0) {
            targetHeight = (targetWidth * image.getHeight()) / image.getWidth();
        }
        if (targetWidth == 0) {
            targetWidth = (targetHeight * image.getWidth()) / image.getHeight();
        }

        BufferedImage resizedImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics2D = resizedImage.createGraphics();
        graphics2D.drawImage(resizedImage, 0, 0, targetWidth, targetHeight, null);
        graphics2D.dispose();

        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            ImageIO.write(resizedImage, extension, outputStream);
            return outputStream.toByteArray();
        }
    }

    public void test() throws IOException {
        BufferedImage originalImage = ImageIO.read(new File("/Users/sveta/Documents/! pictures/20-08-21 " +
                "kotomka/2V3A1015.JPG"));
        BufferedImage outputImage = workingResizeImage(originalImage, 400, 300);
        ImageIO.write(outputImage, "jpg", new File("/Users/sveta/Documents/! pictures/20-08-21 kotomka/1.jpg"));
    }

}
