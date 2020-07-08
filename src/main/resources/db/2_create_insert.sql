DROP TABLE IF EXISTS reader;
CREATE TABLE IF NOT EXISTS reader
(
    id       SERIAL PRIMARY KEY,
    email    VARCHAR(30)  NOT NULL,
    password VARCHAR(100),
    name     VARCHAR(20)  NOT NULL,
    surname  VARCHAR(30),
    city    VARCHAR(15),
    fb_page    VARCHAR(80),
    registration_type VARCHAR(10)
);
CREATE UNIQUE INDEX reader_email_uindex
    on reader (email);

DROP TABLE IF EXISTS author;
CREATE TABLE IF NOT EXISTS author
(
    id      SERIAL PRIMARY KEY,
    name    VARCHAR(20),
    surname VARCHAR(30) NOT NULL
);
create index author_name_surname_index
    on author (name, surname);


DROP TABLE IF EXISTS book;
CREATE TABLE IF NOT EXISTS book
(
    id        SERIAL PRIMARY KEY,
    title      VARCHAR(80),
    author_id SERIAL REFERENCES author (id),
    reader_id SERIAL REFERENCES reader (id),
    year int,
    publisher VARCHAR(30),
    age_group int,--     0-baby, 1-preschool, 2-junior, 3-middle, 4-teenager, 5-adult
    description varchar(600),
    is_hard_cover boolean,
    language varchar(20),
    illustrations int, --0-no, 1-bw, 2-color
    pages_quantity int
);
create unique index book_all_fields_key
    on book (title, author_id, reader_id);


DROP TABLE IF EXISTS friendship;
CREATE TABLE IF NOT EXISTS friendship
(
    id        SERIAL PRIMARY KEY,
    friend1_id   SERIAL REFERENCES reader (id),
    friend2_id SERIAL REFERENCES reader (id),
    date_added date
);
create unique index friendship_friend1_id_friend2_id_index
	on friendship (friend1_id, friend2_id);



---****

INSERT INTO author (name, surname)
VALUES ('Alexander', 'Pushkin'),
       ('Vsevolod', 'Nestajko'),
       ('Yuval', 'Harrari'),
       ('Karl', 'Marx'),
       ('Fyodor', 'Dostoyevsky'),
       ('Joanne', 'Rowling'),
       ('Georgia', 'Bing'),
       ('Robert', 'Sapolsky'),
       ('Robert', 'Pirsig');

INSERT INTO reader(email, password, name, surname, city, fb_page, registration_type)
VALUES ('bezzubik', '$2a$10$GedyCB5ig1PiQ/fVRQUGc.27Yqvt9RazEL2WVO2rjtrgLW32YIP7O', 'Varvara', 'Kunitskaya', 'Kiev', 'https://www.facebook.com/varya.kunitskaya', 'CUSTOM'),
       ('lora', '$2a$10$GedyCB5ig1PiQ/fVRQUGc.27Yqvt9RazEL2WVO2rjtrgLW32YIP7O', 'Larisa', 'Akrytova', 'Kiev', 'https://www.facebook.com/profile.php?id=100006759636741', 'CUSTOM'),
       ('vmk', '$2a$10$GedyCB5ig1PiQ/fVRQUGc.27Yqvt9RazEL2WVO2rjtrgLW32YIP7O', 'Vladimir', 'Kunitsky', 'Kiev', 'https://www.facebook.com/vladimir.kunitsky', 'CUSTOM'),
       ('minaeva', '$2a$10$GedyCB5ig1PiQ/fVRQUGc.27Yqvt9RazEL2WVO2rjtrgLW32YIP7O', 'Sveta', 'Minaeva', 'Kiev', 'https://www.facebook.com/sveta.minaeva.yes', 'CUSTOM'),
       ('sveta', '$2a$10$GedyCB5ig1PiQ/fVRQUGc.27Yqvt9RazEL2WVO2rjtrgLW32YIP7O', 'Svitlana', 'Bezsmertna', 'Berlin', 'https://www.facebook.com/SvitlanaBezsmertna', 'CUSTOM');

INSERT INTO book (title, author_id, reader_id, year, publisher, age_group, description, is_hard_cover, language, illustrations, pages_quantity)
VALUES ('Sapiens', 3, 2, 2019, 'Vivat', 5, '', true, 'ukr', 0, 313),
       ('Capital', 4, 5, 1967, 'SSSR', 5, 'a book everyone needs to read', true, 'rus', 1, 456),
       ('Onegin', 1, 2, 1980, 'SSSR', 5, 'ja pomnyu', false, 'rus', 2, 120),
       ('Toreadory z Vasyukivky', 2, 1, 2004, 'Ababahalamaha', 3, '', true, 'ukr', 0, 321),
       ('Captains Daughter', 1, 4, 1980, 'SSSR', 5, 'my favorite book', false, 'rus', 1, 105),
       ('Homo Deus', 3, 5, 2019, 'Vivat', 5, '', true, 'ukr', 2, 313),
       ('Homo Deus', 3, 1, 2019, 'Vivat', 5, '', true, 'ukr', 0, 313)

-- INSERT INTO friendship (friend1_id, friend2_id)
-- VALUES (1, 2),
--        (1, 3),
--        (1, 4),
--        (1, 5),
--        (4, 5),
--        (4, 6),
--        (2, 3),
--        (2, 4),
--        (3, 5);
