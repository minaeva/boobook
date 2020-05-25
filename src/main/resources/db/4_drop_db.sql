UPDATE pg_database SET datallowconn = 'false' WHERE datname = 'bubuk';

SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'bubuk';

DROP DATABASE bubuk;

DROP TABLE IF EXISTS friendship;
DROP TABLE IF EXISTS reader;
DROP TABLE IF EXISTS book;
DROP TABLE IF EXISTS author;

GRANT ALL ON SCHEMA public TO admin;
GRANT ALL ON SCHEMA public TO public;
