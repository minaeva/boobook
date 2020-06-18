package ua.kiev.minaeva.service;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.entity.Friendship;
import ua.kiev.minaeva.entity.Reader;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.exception.BoobookValidationException;
import ua.kiev.minaeva.repository.FriendshipRepository;
import ua.kiev.minaeva.repository.ReaderRepository;
import ua.kiev.minaeva.service.impl.FriendshipServiceImpl;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static ua.kiev.minaeva.prototype.FriendshipPrototype.aFriendship;
import static ua.kiev.minaeva.prototype.ReaderPrototype.aReader;

@SpringBootTest
public class FriendshipServiceTest {

    @Mock
    private FriendshipRepository friendshipRepository;

    @Mock
    private ReaderRepository readerRepository;

    @InjectMocks
    private FriendshipServiceImpl friendshipService;

    @Test
    void getFriendsByReaderId() throws BoobookNotFoundException {
        when(readerRepository.findById(anyLong()))
                .thenReturn(Optional.of(aReader()));
        when(friendshipRepository.findByFriend1(any(Reader.class)))
                .thenReturn(Collections.singletonList(aFriendship()));

        List<ReaderDto> foundFriends = friendshipService.getFriendsByReaderId(44L);

        assertThat(foundFriends).isNotEmpty();
    }

    @Test
    void getFriendsByReaderId_readerNotFound() {
        when(readerRepository.findById(anyLong()))
                .thenReturn(Optional.empty());

        assertThrows(BoobookNotFoundException.class,
                () -> friendshipService.getFriendsByReaderId(44L),
                "Reader with id 44 cannot be found");
    }

    @Test
    void getFriendsByReaderId_friendshipNotFound() {
        when(readerRepository.findById(anyLong()))
                .thenReturn(Optional.of(aReader()));
        when(friendshipRepository.findByFriend1(any(Reader.class)))
                .thenReturn(Collections.emptyList());

        assertThrows(BoobookNotFoundException.class,
                () -> friendshipService.getFriendsByReaderId(44L),
                "Not any friend of reader with id 44 found");
    }

    @Test
    void addFriend() throws BoobookNotFoundException, BoobookValidationException {
        when(readerRepository.findById(anyLong()))
                .thenReturn(Optional.of(aReader()));
        when(friendshipRepository.save(any(Friendship.class)))
                .thenReturn(aFriendship());

        friendshipService.addFriend(1L, 2L);
    }

    @Test
    void addFriend_notFound() {
        when(readerRepository.findById(anyLong()))
                .thenReturn(Optional.empty());

        assertThrows(BoobookNotFoundException.class,
                () -> friendshipService.addFriend(1L, 2L),
                "Reader with id 1 cannot be found");
    }

    @Test
    void addFriend_validationException() {
        assertThrows(BoobookValidationException.class,
                () -> friendshipService.addFriend(1L, 1L),
                "Friend to be added should be the other person");
    }

    @Test
    void removeFriend() throws BoobookNotFoundException {
        when(readerRepository.findById(anyLong()))
                .thenReturn(Optional.of(aReader()));
        when(friendshipRepository.findByFriend1AndFriend2(any(Reader.class), any(Reader.class)))
                .thenReturn(Optional.of(aFriendship()));
        doNothing().when(friendshipRepository).delete(any(Friendship.class));

        friendshipService.removeFriend(1L, 2L);
    }

    @Test
    void removeFriend_readerNotFound() {
        when(readerRepository.findById(anyLong()))
                .thenReturn(Optional.empty());

        assertThrows(BoobookNotFoundException.class,
                () -> friendshipService.removeFriend(1L, 2L),
                "Reader with id 1 cannot be found");
    }

    @Test
    void removeFriend_friendshipNotFound() {
        when(readerRepository.findById(anyLong()))
                .thenReturn(Optional.of(aReader()));
        when(friendshipRepository.findByFriend1AndFriend2(any(Reader.class), any(Reader.class)))
                .thenReturn(Optional.empty());

        assertThrows(BoobookNotFoundException.class,
                () -> friendshipService.removeFriend(1L, 2L),
                "Friendship of readers friend1.getName and friend2.getName does not exist");
    }
}
