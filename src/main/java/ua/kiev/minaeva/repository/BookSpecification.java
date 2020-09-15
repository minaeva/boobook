package ua.kiev.minaeva.repository;

import org.springframework.data.jpa.domain.Specification;
import ua.kiev.minaeva.dto.SearchCriteria;
import ua.kiev.minaeva.dto.SearchOperation;
import ua.kiev.minaeva.entity.Author;
import ua.kiev.minaeva.entity.Book;
import ua.kiev.minaeva.entity.Book_;
import ua.kiev.minaeva.entity.Reader;

import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

public class BookSpecification implements Specification<Book> {

    public static final String PERCENT = "%";
    private List<SearchCriteria> list;

    public BookSpecification() {
        this.list = new ArrayList<>();
    }

    public void add(SearchCriteria criteria) {
        list.add(criteria);
    }

    @Override
    public Predicate toPredicate(Root<Book> root, CriteriaQuery<?> query, CriteriaBuilder builder) {

        List<Predicate> predicates = new ArrayList<>();

        for (SearchCriteria criteria : list) {
            if (criteria.getOperation().equals(SearchOperation.GREATER_THAN)) {
                predicates.add(builder.greaterThan(
                        root.get(criteria.getKey()), criteria.getValue().toString()));
            } else if (criteria.getOperation().equals(SearchOperation.LESS_THAN)) {
                predicates.add(builder.lessThan(
                        root.get(criteria.getKey()), criteria.getValue().toString()));
            } else if (criteria.getOperation().equals(SearchOperation.GREATER_THAN_EQUAL)) {
                predicates.add(builder.greaterThanOrEqualTo(
                        root.get(criteria.getKey()), criteria.getValue().toString()));
            } else if (criteria.getOperation().equals(SearchOperation.LESS_THAN_EQUAL)) {
                predicates.add(builder.lessThanOrEqualTo(
                        root.get(criteria.getKey()), criteria.getValue().toString()));
            } else if (criteria.getOperation().equals(SearchOperation.NOT_EQUAL)) {
                predicates.add(builder.notEqual(
                        root.get(criteria.getKey()), criteria.getValue()));
            } else if (criteria.getOperation().equals(SearchOperation.EQUAL)) {
                predicates.add(builder.equal(
                        root.get(criteria.getKey()), criteria.getValue()));
            } else if (criteria.getOperation().equals(SearchOperation.MATCH)) {
                predicates.add(builder.like(
                        builder.lower(root.get(criteria.getKey())),
                        PERCENT + criteria.getValue().toString().toLowerCase() + PERCENT));
            } else if (criteria.getOperation().equals(SearchOperation.MATCH_END)) {
                predicates.add(builder.like(
                        builder.lower(root.get(criteria.getKey())),
                        criteria.getValue().toString().toLowerCase() + PERCENT));
            } else if (criteria.getOperation().equals(SearchOperation.MATCH_START)) {
                predicates.add(builder.like(
                        builder.lower(root.get(criteria.getKey())),
                        PERCENT + criteria.getValue().toString().toLowerCase()));
            } else if (criteria.getOperation().equals(SearchOperation.IN)) {
                predicates.add(builder.in(root.get(criteria.getKey())).value(criteria.getValue()));
            } else if (criteria.getOperation().equals(SearchOperation.NOT_IN)) {
                predicates.add(builder.not(root.get(criteria.getKey())).in(criteria.getValue()));
            } else if (criteria.getOperation().equals(SearchOperation.AUTHOR_JOIN)) {
                Join<Book, Author> bookAuthorJoin = root.join(Book_.author);
                predicates.add(builder.like(builder.lower(bookAuthorJoin.get(criteria.getKey())),
                        PERCENT + criteria.getValue().toString().toLowerCase() + PERCENT));
            } else if (criteria.getOperation().equals(SearchOperation.CITY_JOIN)) {
                Join<Book, Reader> bookReaderJoin = root.join(Book_.owner);
                predicates.add(builder.like(builder.lower(bookReaderJoin.get(criteria.getKey())),
                        PERCENT + criteria.getValue().toString().toLowerCase() + PERCENT));
            }
        }

        return builder.and(predicates.toArray(new Predicate[0]));
    }
}
