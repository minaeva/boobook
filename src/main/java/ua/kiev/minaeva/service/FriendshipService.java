package ua.kiev.minaeva.service;

import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.exception.BoobookNotFoundException;
import ua.kiev.minaeva.exception.BoobookValidationException;

import java.util.List;

public interface FriendshipService {

    List<ReaderDto> getFriendsByReaderId(Long readerId) throws BoobookNotFoundException;

    void addFriend(Long friend1Id, Long friend2Id) throws BoobookNotFoundException, BoobookValidationException;

    void removeFriend(Long friend1Id, Long friend2Id) throws BoobookNotFoundException;
}
