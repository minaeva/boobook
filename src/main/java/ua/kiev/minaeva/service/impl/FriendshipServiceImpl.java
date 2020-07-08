package ua.kiev.minaeva.service.impl;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.entity.Friendship;
import ua.kiev.minaeva.entity.Reader;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.exception.BoobookValidationException;
import ua.kiev.minaeva.mapper.ReaderMapper;
import ua.kiev.minaeva.repository.FriendshipRepository;
import ua.kiev.minaeva.repository.ReaderRepository;
import ua.kiev.minaeva.service.FriendshipService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendshipServiceImpl implements FriendshipService {

    private final FriendshipRepository friendshipRepository;
    private final ReaderRepository readerRepository;

    private ReaderMapper mapper = Mappers.getMapper(ReaderMapper.class);

    public List<ReaderDto> getFriendsByReaderId(Long readerId) throws BoobookNotFoundException {
        List<Friendship> foundFriendships = getFriendshipsByReaderId(readerId);

        if (foundFriendships.isEmpty()) {
            throw new BoobookNotFoundException("Not any friend of reader with id " +
                    readerId + " found");
        }

        return foundFriendships.stream()
                .map(Friendship::getFriend2)
                .map(friend -> mapper.readerToDto(friend))
                .collect(Collectors.toList());
    }

    public void addFriend(Long friend1Id, Long friend2Id) throws BoobookNotFoundException, BoobookValidationException {
        Reader existentReader1 = readerIsPresent(friend1Id);
        Reader existentReader2 = readerIsPresent(friend2Id);

        validateFriendship(friend1Id, friend2Id, existentReader1, existentReader2);

        Friendship newFriendship = new Friendship();
        newFriendship.setFriend1(existentReader1);
        newFriendship.setFriend2(existentReader2);

        friendshipRepository.save(newFriendship);
    }

    public boolean areFriends(Long friend1Id, Long friend2Id) throws BoobookNotFoundException {
        Reader existentReader1 = readerIsPresent(friend1Id);
        Reader existentReader2 = readerIsPresent(friend2Id);

        try {
            friendshipIsPresent(existentReader1, existentReader2);
        } catch (BoobookNotFoundException ex) {
            return false;
        }

        return true;
    }

    public void removeFriend(Long friend1Id, Long friend2Id) throws BoobookNotFoundException {
        Reader existentReader1 = readerIsPresent(friend1Id);
        Reader existentReader2 = readerIsPresent(friend2Id);

        Friendship friendshipToDelete = friendshipIsPresent(existentReader1, existentReader2);
        friendshipRepository.delete(friendshipToDelete);
    }

    private Reader readerIsPresent(Long readerId) throws BoobookNotFoundException {
        return readerRepository.findById(readerId)
                .orElseThrow(() -> new BoobookNotFoundException("Reader with id " + readerId + " cannot be found"));
    }

    private Friendship friendshipIsPresent(Reader friend1, Reader friend2) throws BoobookNotFoundException {
        return friendshipRepository.findByFriend1AndFriend2(friend1, friend2)
                .orElseThrow(() -> new BoobookNotFoundException("Friendship of readers " + friend1.getName() + " and "
                        + friend2.getName() + " does not exist"));
    }

    private void validateFriendship(Long friend1Id, Long friend2Id, Reader existentReader1, Reader existentReader2) throws BoobookValidationException, BoobookNotFoundException {
        if (friend1Id.equals(friend2Id)) {
            throw new BoobookValidationException("Friend to be added should be the other person");
        }

        List<Friendship> foundFriendships = getFriendshipsByReaderId(friend1Id);
        if (!foundFriendships.isEmpty()) {
            List<Reader> aFriendAlready = foundFriendships.stream()
                    .map(Friendship::getFriend2)
                    .filter(existentReader2::equals)
                    .collect(Collectors.toList());
            if (!aFriendAlready.isEmpty()) {
                throw new BoobookValidationException(existentReader2 + " is already a friend of " + existentReader1);
            }
        }
    }

    private List<Friendship> getFriendshipsByReaderId(Long friend1) throws BoobookNotFoundException {
        Reader existentReader = readerIsPresent(friend1);
        return friendshipRepository.findByFriend1(existentReader);
    }

}
