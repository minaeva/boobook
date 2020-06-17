package ua.kiev.minaeva.service;

import ua.kiev.minaeva.dto.ReaderDto;
import ua.kiev.minaeva.exception.BoobookNotFoundException;

import java.util.List;

public interface FriendshipService {

    List<ReaderDto> getFriendsByReaderId(Long readerId) throws BoobookNotFoundException;
}
