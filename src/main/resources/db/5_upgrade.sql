-- add district (50)
alter table reader
    add district varchar(30);

alter table reader
    alter column email type varchar(50) using email::varchar(50);

alter table reader
    alter column password type varchar(50) using password::varchar(50);

alter table reader
    alter column name type varchar(50) using name::varchar(50);

alter table reader
    alter column surname type varchar(50) using surname::varchar(50);

alter table reader
    alter column city type varchar(30) using city::varchar(30);

alter table reader
    alter column fb_page type varchar(50) using fb_page::varchar(50);

alter table reader
    alter column telegram type varchar(30) using telegram::varchar(30);

alter table reader
    alter column viber type varchar(30) using viber::varchar(30);

alter table reader
    alter column hobby type varchar(200) using hobby::varchar(200);

alter table reader
    alter column hero type varchar(50) using hero::varchar(50);

alter table reader
    alter column super_power type varchar(200) using super_power::varchar(200);

alter table reader
    add country varchar(30);
