package ua.kiev.minaeva.service.impl;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.entity.Friendship;
import ua.kiev.minaeva.entity.Reader;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.mapper.ReaderMapper;
import ua.kiev.minaeva.repository.FriendshipRepository;
import ua.kiev.minaeva.repository.ReaderRepository;
import ua.kiev.minaeva.service.FriendshipService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendshipServiceImpl implements FriendshipService {

    private final FriendshipRepository friendshipRepository;
    private final ReaderRepository readerRepository;

    private ReaderMapper mapper = Mappers.getMapper(ReaderMapper.class);

    public List<ReaderDto> getFriendsByReaderId(Long readerId) throws BoobookNotFoundException {
        Optional<Reader> foundReader = readerRepository.findById(readerId);
        Reader existentReader;

        if (foundReader.isPresent()) {
            existentReader = foundReader.get();
        } else {
            throw new BoobookNotFoundException("reader with id " + readerId + " cannot be found");
        }

        List<Friendship> foundFriendships = friendshipRepository.findByFriend1(existentReader);

        if (foundFriendships.size() == 0) {
            throw new BoobookNotFoundException("Not any friend of reader with id " +
                    readerId + " found");
        }

        return foundFriendships.stream()
                .map(Friendship::getFriend2)
                .map(friend -> mapper.readerToDto(friend))
                .collect(Collectors.toList());
    }

}
