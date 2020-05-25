package ua.kiev.minaeva.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;
import lombok.ToString;

import javax.persistence.*;

@Data
@ToString(exclude = "owner")
@Entity
@Table(name = "book")
public class Book extends MapId{

    @Column(name = "title")
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    @JoinColumn(name="author_id", nullable=false)
    private Author author;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "reader_id", referencedColumnName = "id")
    private Reader owner;

}
