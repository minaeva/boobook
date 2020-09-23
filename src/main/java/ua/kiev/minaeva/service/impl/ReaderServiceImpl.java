package ua.kiev.minaeva.service.impl;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.entity.Reader;
import ua.kiev.minaeva.entity.RegistrationType;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.exception.BoobookValidationException;
import ua.kiev.minaeva.mapper.ReaderMapper;
import ua.kiev.minaeva.repository.ReaderRepository;
import ua.kiev.minaeva.service.FriendshipService;
import ua.kiev.minaeva.service.ReaderService;

import java.util.List;
import java.util.stream.Collectors;

import static ua.kiev.minaeva.service.helper.ReaderValidator.validateReader;

@Service
@RequiredArgsConstructor
public class ReaderServiceImpl implements ReaderService {

    public static final String NO_READER_FOUND_WITH_EMAIL = "No reader found with email ";
    public static final String NO_READER_FOUND_WITH_ID = "No reader found with id ";
    public static final String NO_READER_FOUND_WITH_NAME = "No reader found with name ";
    private final ReaderRepository readerRepository;
    private final PasswordEncoder passwordEncoder;
    private final FriendshipService friendshipService;

    private ReaderMapper mapper = Mappers.getMapper(ReaderMapper.class);

    public ReaderDto createReader(ReaderDto readerDto) throws BoobookValidationException {
        validateReader(readerDto);

        Reader reader = mapper.dtoToReader(readerDto);
        if (RegistrationType.CUSTOM.equals(readerDto.getRegistrationType())) {
            reader.setPassword(passwordEncoder.encode(readerDto.getPassword()));
        }

        try {
            return mapper.readerToDto(readerRepository.save(reader));
        } catch (Exception e) {
            throw new BoobookValidationException("Reader with email " + reader.getEmail() +
                    " already exists");
        }
    }

    public ReaderDto updateReader(ReaderDto readerDto) throws BoobookValidationException, BoobookNotFoundException {
        validateReader(readerDto);

        readerRepository.findById(readerDto.getId())
                .orElseThrow(() -> new BoobookNotFoundException(NO_READER_FOUND_WITH_ID + readerDto.getId()));

        Reader readerToUpdate = mapper.dtoToReader(readerDto);

        return mapper.readerToDto(readerRepository.save(readerToUpdate));
    }


    public ReaderDto updateImage(byte[] image, Long readerId) throws BoobookNotFoundException {
        Reader reader = readerRepository.findById(readerId)
                .orElseThrow(() -> new BoobookNotFoundException(NO_READER_FOUND_WITH_ID + readerId));
        reader.setImage(image);

        return mapper.readerToDto(readerRepository.save(reader));
    }

    public void deleteReader(Reader reader) {
        readerRepository.delete(reader);
    }

    public ReaderDto getByEmail(String email) throws BoobookNotFoundException {
        Reader reader = readerRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BoobookNotFoundException(NO_READER_FOUND_WITH_EMAIL + email));
        return mapper.readerToDto(reader);
    }

    public ReaderDto getByEmailAndPassword(String email, String password) throws BoobookNotFoundException {
        ReaderDto foundByEmail = getByEmail(email);

        if (RegistrationType.CUSTOM.equals(foundByEmail.getRegistrationType())) {
            if (passwordEncoder.matches(password, foundByEmail.getPassword())) {
                return foundByEmail;
            }
        } else {
            return foundByEmail;
        }

        return null;
    }

    public List<ReaderDto> getAll() {
        return readerRepository.findAll()
                .stream()
                .map(reader -> mapper.readerToDto(reader))
                .collect(Collectors.toList());
    }

    public List<ReaderDto> getAllWithIsFriend(Long friend1Id) {
        List<ReaderDto> foundReaders = readerRepository.findAll()
                .stream()
                .filter(reader -> !friend1Id.equals(reader.getId()))
                .map(reader -> mapper.readerToDto(reader))
                .collect(Collectors.toList());
        List<ReaderDto> foundFriends;

        try {
            foundFriends = friendshipService.getFriendsByReaderId(friend1Id);
        } catch (BoobookNotFoundException e) {
            return foundReaders;
        }

        for (ReaderDto friend : foundFriends) {
            for (ReaderDto reader : foundReaders) {
                if (reader.getId().equals(friend.getId())) {
                    reader.setFriend(true);
                }
            }
        }

        return foundReaders;
    }

    public ReaderDto getById(Long id) throws BoobookNotFoundException {
        Reader reader = readerRepository.findById(id)
                .orElseThrow(() ->
                        new BoobookNotFoundException(NO_READER_FOUND_WITH_ID + id));

        return mapper.readerToDto(reader);
    }

    public ReaderDto getByIdWithIsFriend(Long id, Long friendOfId) throws BoobookNotFoundException {
        ReaderDto readerDto = getById(id);
        if (friendshipService.areFriends(friendOfId, id)) {
            readerDto.setFriend(true);
        }
        return readerDto;
    }

    public List<ReaderDto> getByName(String name) throws BoobookNotFoundException {
        List<Reader> readers = readerRepository.findByName(name);

        if (readers.isEmpty()) {
            throw new BoobookNotFoundException(NO_READER_FOUND_WITH_NAME + name);
        }

        return readers.stream()
                .map(reader -> mapper.readerToDto(reader))
                .collect(Collectors.toList());
    }

}
