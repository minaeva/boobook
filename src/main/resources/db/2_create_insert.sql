DROP TABLE IF EXISTS reader;
CREATE TABLE IF NOT EXISTS reader
(
    id       SERIAL PRIMARY KEY,
    login    VARCHAR(20)  NOT NULL,
    password VARCHAR(100),
    name     VARCHAR(20)  NOT NULL,
    surname  VARCHAR(30),
    city    VARCHAR(15),
    fb_page    VARCHAR(80),
    email    VARCHAR(30)
);

DROP TABLE IF EXISTS author;
CREATE TABLE IF NOT EXISTS author
(
    id      SERIAL PRIMARY KEY,
    name    VARCHAR(20),
    surname VARCHAR(30) NOT NULL
);

DROP TABLE IF EXISTS book;
CREATE TABLE IF NOT EXISTS book
(
    id        SERIAL PRIMARY KEY,
    title      VARCHAR(80),
    author_id SERIAL REFERENCES author (id),
    reader_id SERIAL REFERENCES reader (id)
);

-- DROP TABLE IF EXISTS reader_book;
-- CREATE TABLE IF NOT EXISTS reader_book
-- (
--     reader_id SERIAL REFERENCES reader (id),
--     book_id SERIAL REFERENCES book (id),
--     date_added date,
--     is_active boolean
-- );


DROP TABLE IF EXISTS friendship;
CREATE TABLE IF NOT EXISTS friendship
(
    id        SERIAL PRIMARY KEY,
    friend1_id   SERIAL REFERENCES reader (id),
    friend2_id SERIAL REFERENCES reader (id),
    date_added date
);

---****

INSERT INTO author (name, surname)
VALUES ('Alexander', 'Pushkin'),
       ('Vsevolod', 'Nestajko'),
       ('Yuval', 'Harrari'),
       ('Karl', 'Marx');

INSERT INTO reader(login, password, name, surname, city, fb_page, email)
VALUES ('variko', 'variko', 'Varvara', 'Kunitskaya', 'Kiev', 'https://www.facebook.com/varya.kunitskaya', 'varya@gmail.com'),
       ('lora', 'lora', 'Larisa', 'Akrytova', 'Kiev', 'https://www.facebook.com/profile.php?id=100006759636741', 'larisa@gmail.com'),
       ('vmk', 'vmk', 'Vladimir', 'Kunitsky', 'Kiev', 'https://www.facebook.com/vladimir.kunitsky', 'vkunitsky@gmail.com'),
       ('minaeva', 'minaeva', 'Sveta', 'Minaeva', 'Kiev', 'https://www.facebook.com/sveta.minaeva.yes', 's.minaeva@gmail.com'),
       ('yetya', 'yetya', 'Hanna', 'Yakovenko', 'Lviv', 'https://www.facebook.com/hanka.yakovenko', 'iloveukrnet@gmail.com'),
       ('sveta', 'sveta', 'Svitlana', 'Bezsmertna', 'Berlin', 'https://www.facebook.com/SvitlanaBezsmertna', 'bezsmertnye@gmail.com');

INSERT INTO book (title, author_id, reader_id)
VALUES ('Sapiens', 3, 3),
       ('Capital', 4, 5),
       ('Onegin', 1, 5),
       ('Toreadory z Vasyukivky', 2, 1),
       ('Captains Daughter', 1, 1),
       ('Homo Deus', 3, 2),
       ('Homo Deus', 3, 3),
       ('Homo Deus', 3, 4),
       ('Homo Deus', 3, 5),
       ('21 lessons', 3, 3);

INSERT INTO friendship (friend1_id, friend2_id)
VALUES (1, 2),
       (1, 3),
       (1, 4),
       (1, 5),
       (4, 5),
       (4, 6),
       (2, 3),
       (2, 4),
       (3, 5);
