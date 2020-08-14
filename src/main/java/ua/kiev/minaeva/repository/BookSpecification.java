package ua.kiev.minaeva.repository;

import org.springframework.data.jpa.domain.Specification;
import ua.kiev.minaeva.entity.Book;

public class BookSpecification {
    public static Specification<Book> titleLike(String title) {
        return (root, query, cb) -> {
            return cb.like(root.get(Book_.title)), "%" + title + "%");
        };
    }
//    public static Specification<Book> isLongTermCustomer() {
//        return (root, query, cb) ->{
//            return cb.lessThan(root.get(Customer_.createdAt), new LocalDate.minusYears(2));
//        };
//    }
}