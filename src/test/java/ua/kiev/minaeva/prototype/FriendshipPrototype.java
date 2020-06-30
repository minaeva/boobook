package ua.kiev.minaeva.prototype;

import ua.kiev.minaeva.entity.Friendship;
import ua.kiev.minaeva.entity.Reader;

import java.time.LocalDateTime;

import static ua.kiev.minaeva.prototype.ReaderPrototype.aReader;

public class FriendshipPrototype {

    public static Friendship aFriendship() {
        Reader reader1 = aReader();
        reader1.setEmail("test_email1");

        Reader reader2 = aReader();
        reader2.setEmail("test_email2");

        Friendship friendship = new Friendship();
        friendship.setFriend1(reader1);
        friendship.setFriend2(reader2);
        friendship.setDateAdded(LocalDateTime.now());

        return friendship;
    }
}
