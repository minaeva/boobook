package ua.kiev.minaeva.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "friendship")
public class Friendship extends MapId {

    @OneToOne(cascade = CascadeType.ALL)
    @JsonManagedReference
    @JoinColumn(name = "friend1_id", referencedColumnName = "id")
    private Reader friend1;

    @ManyToOne
    @JsonManagedReference
    @JoinColumn(name = "friend2_id", referencedColumnName = "id")
    private Reader friend2;

    @Column(name = "date_added")
    private LocalDateTime dateAdded;

}
