DROP TABLE IF EXISTS belong;
DROP TABLE IF EXISTS coffee;
DROP TABLE IF EXISTS country;
DROP TABLE IF EXISTS taste;

-- === ENTITÉS ===
CREATE TABLE country (
  country_id   SERIAL PRIMARY KEY,
  name         VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE taste (
  taste_id     SERIAL PRIMARY KEY,
  type         VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE coffee (
  coffee_id    SERIAL PRIMARY KEY,
  reference    VARCHAR(20) NOT NULL UNIQUE,
  name         VARCHAR(100) NOT NULL,
  description  TEXT,
  price        NUMERIC(10,2) CHECK (price >= 0),
  available    BOOLEAN NOT NULL DEFAULT TRUE,
  -- COME : 1,1 côté COFFEE ; 0,N côté COUNTRY
  country_id   INTEGER NOT NULL REFERENCES country(country_id)
);

-- ASSOCIATION N-N (BELONG) 
-- 1,N côté COFFEE → chaque coffee doit avoir >= 1 taste
-- 0,N côté TASTE  → un taste peut n’être lié à aucun coffee
CREATE TABLE belong (
  coffee_id  INTEGER NOT NULL REFERENCES coffee(coffee_id)
              ON UPDATE CASCADE
              ON DELETE CASCADE,
  taste_id   INTEGER NOT NULL REFERENCES taste(taste_id)
              ON UPDATE CASCADE
              ON DELETE RESTRICT,
  PRIMARY KEY (coffee_id, taste_id)
);

