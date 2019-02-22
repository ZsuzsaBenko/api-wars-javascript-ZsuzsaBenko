CREATE TABLE users
(
  id serial primary key,
  username varchar(255) unique,
  password varchar(255)
);

CREATE TABLE planet_votes
(
  id serial primary key,
  planet_id integer,
  planet_name varchar(255),
  user_id integer REFERENCES users(id),
  submission_time timestamp
);