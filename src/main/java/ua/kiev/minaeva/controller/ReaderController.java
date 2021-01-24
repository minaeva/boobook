package ua.kiev.minaeva.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.dto.SearchReaderDto;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.exception.BoobookValidationException;
import ua.kiev.minaeva.service.FriendshipService;
import ua.kiev.minaeva.service.ReaderService;

import java.io.IOException;
import java.util.Base64;
import java.util.List;

import static ua.kiev.minaeva.controller.helper.ImageHelper.resizeEncode;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Log
@CrossOrigin
public class ReaderController {

    private final ReaderService readerService;
    private final FriendshipService friendshipService;

    @PostMapping
    public ReaderDto createReader(@RequestBody ReaderDto readerDto) throws BoobookValidationException {
        log.info("handling CREATE READER request: " + readerDto);
        return readerService.createReader(readerDto);
    }

    @PutMapping
    public ReaderDto updateReader(@RequestBody ReaderDto readerDto) throws BoobookNotFoundException,
            BoobookValidationException {
        log.info("handling UPDATE READER request: " + readerDto);
        return readerService.updateReader(readerDto);
    }

    @PutMapping("/{readerId}")
    public ResponseEntity<ResponseMessage> saveReaderImage(@RequestParam("file") MultipartFile file,
                                                           @PathVariable final Long readerId) throws IOException,
            BoobookValidationException, BoobookNotFoundException {
        log.info("handling UPDATE READER IMAGE request: " + readerId);
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage("None file was selected for save"));
        }

        byte[] resizedEncoded = resizeEncode(file);
        readerService.updateImage(resizedEncoded, readerId);

        return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage("Uploaded successfully: " + file.getOriginalFilename()));
    }

    @GetMapping("/email")
    public ReaderDto getByEmail(String email) throws BoobookNotFoundException {
        log.info("handling get READER by EMAIL request: " + email);
        return readerService.getByEmail(email);
    }

    @GetMapping("/name")
    public List<ReaderDto> getByName(String name) throws BoobookNotFoundException {
        log.info("handling get READER by NAME request: " + name);
        return readerService.getByName(name);
    }

    @GetMapping
    public List<ReaderDto> getAll() {
        log.info("handling get ALL READERS request");
        return readerService.getAll();
    }

    @GetMapping("/allWithIsFriend/{id}")
    public List<ReaderDto> getAllWithIsFriend(@PathVariable final Long id) {
        log.info("handling get ALL READERS + IS FRIEND OF USER with id: " + id);
        return readerService.getAllWithIsFriend(id);
    }

    @GetMapping("/{id}")
    public ReaderDto getById(@PathVariable final Long id) throws BoobookNotFoundException {
        log.info("handling get READER by ID request: " + id);
        ReaderDto foundReader = readerService.getById(id);
        if (foundReader.getImage() != null) {
            foundReader.setImage(Base64.getDecoder().decode(foundReader.getImage()));
        }
        return foundReader;
    }

    @GetMapping("/{id}/{friendOfId}")
    public ReaderDto getByIdWithIsFriend(@PathVariable final Long id, @PathVariable final Long friendOfId) throws BoobookNotFoundException {
        log.info("handling get READER BY ID + IS FRIEND OF USER with id: " + id);
        ReaderDto foundReader = readerService.getByIdWithIsFriend(id, friendOfId);
        if (foundReader.getImage() != null) {
            foundReader.setImage(Base64.getDecoder().decode(foundReader.getImage()));
        }
        return foundReader;
    }

    @GetMapping("/friends/{id}")
    public List<ReaderDto> getFriends(@PathVariable final Long id) throws BoobookNotFoundException {
        log.info("handling get ALL READERS' FRIENDS request");
        return friendshipService.getFriendsByReaderId(id);
    }

    @PostMapping("/friends/{id1}/{id2}")
    public ResponseEntity<Void> addFriend(@PathVariable final Long id1, @PathVariable final Long id2) throws BoobookNotFoundException, BoobookValidationException {
        log.info("handling ADD FRIEND request: " + id1 + " to connect with " + id2);
        friendshipService.addFriend(id1, id2);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/friends/{id1}/{id2}")
    public ResponseEntity<Void> removeFriend(@PathVariable final Long id1, @PathVariable final Long id2) throws BoobookNotFoundException {
        log.info("handling DELETE FRIEND request: reader with id " + id1 + " won't be connected with reader with id " + id2);
        friendshipService.removeFriend(id1, id2);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/search")
    public List<ReaderDto> getByQuery(@RequestBody SearchReaderDto searchReaderDto)
            throws BoobookValidationException, BoobookNotFoundException {
        if (searchReaderDto == null) {
            throw new BoobookValidationException("At least one search criteria should be specified");
        }
        log.info("handling SEARCH READER request, name: " + searchReaderDto.getName() + ", surname: " + searchReaderDto.getSurname() +
                ", country: " + searchReaderDto.getCountry() + ", city: " + searchReaderDto.getCity() +
                ", district: " + searchReaderDto.getDistrict() + ", gender: " + searchReaderDto.getGender());
        return readerService.getByQuery(searchReaderDto);
    }
}
