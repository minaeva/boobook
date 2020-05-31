package ua.kiev.minaeva.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import lombok.ToString;

import javax.persistence.*;
import java.util.List;

@Data
@ToString(exclude = "booksWritten")
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

}
