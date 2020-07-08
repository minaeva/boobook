package ua.kiev.minaeva.service;

import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.entity.Friendship;
import ua.kiev.minaeva.entity.Reader;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.exception.BoobookValidationException;

import java.util.List;

public interface FriendshipService {

    List<ReaderDto> getFriendsByReaderId(Long readerId) throws BoobookNotFoundException;

    void addFriend(Long friend1Id, Long friend2Id) throws BoobookNotFoundException, BoobookValidationException;

    void removeFriend(Long friend1Id, Long friend2Id) throws BoobookNotFoundException;

    boolean areFriends(Long friend1Id, Long friend2Id) throws BoobookNotFoundException;

//    Friendship friendshipIsPresent(Reader friend1, Reader friend2) throws BoobookNotFoundException;
}
