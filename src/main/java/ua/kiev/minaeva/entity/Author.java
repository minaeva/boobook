package ua.kiev.minaeva.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;

import javax.persistence.*;
import java.util.List;

@Data
@NoArgsConstructor
@ToString(exclude = "booksWritten")
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "author")
public class Author extends MapId {

    @Column(name = "name")
    private String name;

    @Column(name = "surname")
    private String surname;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "author")
    @JsonManagedReference
    private List<Book> booksWritten;

    public Author(String name, String surname) {
        this.name = name;
        this.surname = surname;
    }
}
