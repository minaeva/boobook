package ua.kiev.minaeva.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;
import lombok.ToString;

import javax.persistence.*;
import java.util.Set;

@Data
@ToString(exclude = "friends")
@Entity
@Table(name = "reader")
public class Reader extends MapId{

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "name")
    private String name;

    @Column(name = "surname")
    private String surname;

    @Column(name = "city")
    private String city;

    @Column(name = "fb_page")
    private String fbPage;

    @Column(name = "telegram")
    private String telegram;

    @Column(name = "viber")
    private String viber;

    @Column(name = "whatsapp")
    private String whatsapp;

    @Column(name = "skype")
    private String skype;

    @Column(name = "registration_type")
    @Enumerated(EnumType.STRING)
    private RegistrationType registrationType;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "friend2")
    @JsonBackReference
    private Set<Friendship> friends;

}

