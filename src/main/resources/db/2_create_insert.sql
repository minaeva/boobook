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

