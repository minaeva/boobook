package ua.kiev.minaeva.repository;

import ua.kiev.minaeva.entity.Book;

import java.util.List;

public interface BookRepositoryCustom {

    List<Book> getByQuery(String title, String authorSurname, Integer ageGroup, boolean hardCover,
                          String language, Integer illustrations, String city);

}
