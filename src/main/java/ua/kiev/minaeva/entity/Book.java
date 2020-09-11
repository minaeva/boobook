package ua.kiev.minaeva.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import lombok.ToString;

import javax.persistence.*;
import java.util.List;

@Data
@ToString(exclude = {"author", "owner"})
@Entity
@Table(name = "book")
public class Book extends MapId {

    @Column(name = "title")
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    @JoinColumn(name = "author_id", nullable = false)
    private Author author;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reader_id", referencedColumnName = "id")
    private Reader owner;

//    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
//    @JsonBackReference
//    @JoinColumn(name = "book_id")
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "book")
    @JsonManagedReference
    private List<BookImage> images;

    @Column(name = "year")
    private int year;

    @Column(name = "publisher")
    private String publisher;

    @Column(name = "age_group")
    private int ageGroup;

    @Column(name = "description")
    private String description;

    @Column(name = "cover")
    private int cover;

    @Column(name = "language")
    private int language;

    @Column(name = "illustrations")
    private int illustrations;

    @Column(name = "pages_quantity")
    int pagesQuantity;

    @Column(name = "active")
    boolean isActive;
}
