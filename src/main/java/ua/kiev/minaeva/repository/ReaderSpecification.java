package ua.kiev.minaeva.repository;

import org.springframework.data.jpa.domain.Specification;
import ua.kiev.minaeva.dto.SearchCriteria;
import ua.kiev.minaeva.dto.SearchOperation;
import ua.kiev.minaeva.entity.Reader;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

public class ReaderSpecification implements Specification<Reader> {

    public static final String PERCENT = "%";
    private List<SearchCriteria> list;

    public ReaderSpecification() {
        this.list = new ArrayList<>();
    }

    public void add(SearchCriteria criteria) {
        list.add(criteria);
    }

    @Override
    public Predicate toPredicate(Root<Reader> root, CriteriaQuery<?> query, CriteriaBuilder builder) {

        List<Predicate> predicates = new ArrayList<>();

        for (SearchCriteria criteria : list) {
            if (criteria.getOperation().equals(SearchOperation.MATCH)) {
                predicates.add(builder.like(
                        builder.lower(root.get(criteria.getKey())),
                        PERCENT + criteria.getValue().toString().toLowerCase() + PERCENT));
            } else if (criteria.getOperation().equals(SearchOperation.EQUAL)) {
                predicates.add(builder.equal(
                        root.get(criteria.getKey()), criteria.getValue()));
            }
        }
        return builder.and(predicates.toArray(new Predicate[0]));
    }

}
