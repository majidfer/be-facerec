-- SELECT DISTINCT usename FROM pg_stat_activity;
-- SELECT pg_backend_pid();
--  SELECT pg_terminate_backend(26542) 
--  FROM pg_stat_get_activity(NULL::integer) 
--  WHERE datid=(SELECT oid from pg_database where datname = 'facerec');
DROP DATABASE IF EXISTS facerec;

CREATE DATABASE facerec;

\c facerec

CREATE TABLE
    users (
        id serial PRIMARY KEY,
        name varchar(100),
        email text UNIQUE NOT NULL,
        entries BIGINT DEFAULT 0,
        joined TIMESTAMP NOT NULL
    );
CREATE TABLE login (
    id serial PRIMARY KEY,
    hash varchar(100) NOT NULL,
    email text UNIQUE NOT NULL
);