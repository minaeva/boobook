package ua.kiev.minaeva.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;
import lombok.ToString;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.Set;

@Data
@ToString(exclude = "friends")
@Entity
@Table(name = "reader")
public class Reader extends MapId {

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "name")
    private String name;

    @Column(name = "surname")
    private String surname;

    @Column(name = "country")
    private String country;

    @Column(name = "city")
    private String city;

    @Column(name = "district")
    private String district;

    @Column(name = "fb_page")
    private String fbPage;

    @Column(name = "telegram")
    private String telegram;

    @Column(name = "viber")
    private String viber;

    @Column(name = "year_of_birth")
    private Integer yearOfBirth;

    @Column(name = "gender")
    private Integer gender;

    @Column(name = "book_to_the_moon")
    private String bookToTheMoon;

    @Column(name = "book_of_the_year")
    private String bookOfTheYear;

    @Column(name = "hobby")
    private String hobby;

    @Column(name = "hero")
    private String hero;

    @Column(name = "super_power")
    private String superPower;

    @Lob
    @Column(name = "image")
    @Type(type = "org.hibernate.type.BinaryType")
    private byte[] image;

    @Column(name = "registration_type")
    @Enumerated(EnumType.STRING)
    private RegistrationType registrationType;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "friend2")
    @JsonBackReference
    private Set<Friendship> friends;

}

