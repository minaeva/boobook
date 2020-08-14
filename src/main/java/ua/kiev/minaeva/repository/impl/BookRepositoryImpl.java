package ua.kiev.minaeva.repository.impl;

import ua.kiev.minaeva.entity.Book;
import ua.kiev.minaeva.repository.BookRepositoryCustom;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

import static ua.kiev.minaeva.repository.BookRepository.hasAgeGroup;
import static ua.kiev.minaeva.repository.BookRepository.titleContains;

public class BookRepositoryImpl implements BookRepositoryCustom {

    EntityManager em;

    @Override
    public List<Book> getByQuery(String title, String authorSurname,
                                 Integer ageGroup, boolean hardCover,
                                 String language, Integer illustrations, String city) {

        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Book> cq = cb.createQuery(Book.class);

        Root<Book> book = cq.from(Book.class);
        List<Predicate> predicates = new ArrayList<>();

        if (title != null) {
            predicates.add(cb.like(book.get("title"), "%" + title + "%"));
        }

//        if (title != null) {
//            predicates.add(cb.like(book.get("title"), "%" + title + "%"));
//        }
        cq.where(predicates.toArray(new Predicate[0]));

        return em.createQuery(cq).getResultList();

        /*CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Book> cq = cb.createQuery(Book.class);

        Root<Book> book = cq.from(Book.class);
        Predicate authorNamePredicate = cb.equal(book.get("author"), authorName);
        Predicate titlePredicate = cb.like(book.get("title"), "%" + title + "%");
        cq.where(authorNamePredicate, titlePredicate);

        TypedQuery<Book> query = em.createQuery(cq);
        return query.getResultList();
*/    }
}
