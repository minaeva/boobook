package ua.kiev.minaeva.prototype;

import ua.kiev.minaeva.entity.Friendship;
import ua.kiev.minaeva.entity.Reader;
import ua.kiev.minaeva.entity.RegistrationType;

import java.time.LocalDateTime;

public class FriendshipPrototype {

    public static Friendship aFriendship() {
        Reader reader1 = new Reader();
        reader1.setLogin("test_login1");
        reader1.setPassword("test_password1");
        reader1.setName("test_name1");
        reader1.setSurname("test_surname1");
        reader1.setEmail("test1@gmail.com");
        reader1.setCity("test_city1");
        reader1.setRegistrationType(RegistrationType.CUSTOM);

        Reader reader2 = new Reader();
        reader2.setLogin("test_login2");
        reader2.setPassword("test_password2");
        reader2.setName("test_name2");
        reader2.setSurname("test_surname2");
        reader2.setEmail("test2@gmail.com");
        reader2.setCity("test_city2");
        reader2.setRegistrationType(RegistrationType.CUSTOM);

        Friendship friendship = new Friendship();
        friendship.setFriend1(reader1);
        friendship.setFriend2(reader2);
        friendship.setDateAdded(LocalDateTime.now());

        return friendship;
    }
}
