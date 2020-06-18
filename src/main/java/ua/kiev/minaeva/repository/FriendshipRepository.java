package ua.kiev.minaeva.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.kiev.minaeva.entity.Friendship;
import ua.kiev.minaeva.entity.Reader;

import java.util.List;
import java.util.Optional;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    List<Friendship> findByFriend1(Reader friend1);

    Optional<Friendship> findByFriend1AndFriend2(Reader friend1, Reader friend2);

}
