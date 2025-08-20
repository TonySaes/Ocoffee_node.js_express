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
  reference    INTEGER NOT NULL UNIQUE,
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

-- ========= COUNTRY =========
INSERT INTO country (name) VALUES
  ("Italie"),
  ("Colombie"),
  ("Éthiopie"),
  ("Brésil"),
  ("Guatemala"),
  ("Kenya"),
  ("Indonésie"),
  ("Costa Rica"),
  ("Vietnam"),
  ("Tanzanie"),
  ("Jamaïque"),
  ("Rwanda"),
  ("Panama"),
  ("Pérou"),
  ("Hawaï"),
  ("Nicaragua");

-- ========= TASTE =========
INSERT INTO taste (type) VALUES
  ("Corsé"),
  ("Épicé"),
  ("Acide"),
  ("Doux"),
  ("Fruité"),
  ("Chocolaté");

-- ========= COFFEE =========
INSERT INTO coffee (reference, name, description, price, available, country_id) VALUES
  (100955890, "Espresso", "Café fort et concentré préparé en faisant passer de l""eau chaude à travers du café finement moulu.", 20.99, TRUE,
    (SELECT country_id FROM country WHERE name = "Italie")),
  (100955894, "Columbian", "Café moyennement corsé avec une acidité vive et une saveur riche.", 18.75, TRUE,
    (SELECT country_id FROM country WHERE name = "Colombie")),
  (105589090, "Ethiopian Yirgacheffe", "Réputé pour son arôme floral, son acidité vive et ses notes de saveur citronnée.", 22.50, TRUE,
    (SELECT country_id FROM country WHERE name = "Éthiopie")),
  (134009550, "Brazilian Santos", "Café doux et lisse avec un profil de saveur de noisette.", 17.80, TRUE,
    (SELECT country_id FROM country WHERE name = "Brésil")),
  (256505890, "Guatemalan Antigua", "Café corsé avec des nuances chocolatées et une pointe d""épice.", 21.25, TRUE,
    (SELECT country_id FROM country WHERE name = "Guatemala")),
  (295432730, "Kenyan AA", "Café complexe connu pour son acidité rappelant le vin et ses saveurs fruitées.", 23.70, TRUE,
    (SELECT country_id FROM country WHERE name = "Kenya")),
  (302932754, "Sumatra Mandheling", "Café profond et terreux avec un corps lourd et une faible acidité.", 19.95, TRUE,
    (SELECT country_id FROM country WHERE name = "Indonésie")),
  (327302954, "Costa Rican Tarrazu", "Café vif et net avec une finition propre et une acidité vive.", 24.50, TRUE,
    (SELECT country_id FROM country WHERE name = "Costa Rica")),
  (549549090, "Vietnamese Robusta", "Café audacieux et fort avec une saveur robuste distinctive.", 16.75, TRUE,
    (SELECT country_id FROM country WHERE name = "Vietnam")),
  (582954954, "Tanzanian Peaberry", "Acidité vive avec un profil de saveur rappelant le vin et un corps moyen.", 26.80, TRUE,
    (SELECT country_id FROM country WHERE name = "Tanzanie")),
  (589100954, "Jamaican Blue Mountain", "Reconnu pour sa saveur douce, son acidité vive et son absence d""amertume.", 39.25, TRUE,
    (SELECT country_id FROM country WHERE name = "Jamaïque")),
  (650753915, "Rwandan Bourbon", "Café avec des notes florales prononcées, une acidité vive et un corps moyen.", 21.90, TRUE,
    (SELECT country_id FROM country WHERE name = "Rwanda")),
  (795501340, "Panamanian Geisha", "Café rare aux arômes floraux complexes, une acidité brillante et un profil de saveur distinctif.", 42.00, TRUE,
    (SELECT country_id FROM country WHERE name = "Panama")),
  (954589100, "Peruvian Arabica", "Café équilibré avec des notes de chocolat, une acidité modérée et un corps velouté.", 19.40, FALSE,
    (SELECT country_id FROM country WHERE name = "Pérou")),
  (958090105, "Hawaiian Kona", "Café rare au goût riche, une acidité douce et des nuances subtiles.", 55.75, FALSE,
    (SELECT country_id FROM country WHERE name = "Hawaï")),
  (691550753, "Nicaraguan Maragogipe", "Café avec des notes de fruits, une acidité vive et un corps plein.", 28.60, FALSE,
    (SELECT country_id FROM country WHERE name = "Nicaragua"));


-- ========= BELONG (tastes par coffee) =========
-- Espresso (Corsé, Épicé)
INSERT INTO belong (coffee_id, taste_id) VALUES
  ((SELECT coffee_id FROM coffee WHERE reference = 100955890), (SELECT taste_id FROM taste WHERE type = "Corsé")),
  ((SELECT coffee_id FROM coffee WHERE reference = 100955890), (SELECT taste_id FROM taste WHERE type = "Épicé"));

-- Columbian (Acide)
INSERT INTO belong (coffee_id, taste_id) VALUES
  ((SELECT coffee_id FROM coffee WHERE reference = 100955894), (SELECT taste_id FROM taste WHERE type = "Acide"));

-- Ethiopian Yirgacheffe (Doux, Fruité)
INSERT INTO belong (coffee_id, taste_id) VALUES
  ((SELECT coffee_id FROM coffee WHERE reference = 105589090), (SELECT taste_id FROM taste WHERE type = "Doux")),
  ((SELECT coffee_id FROM coffee WHERE reference = 105589090), (SELECT taste_id FROM taste WHERE type = "Fruité"));

-- Brazilian Santos (Doux)
INSERT INTO belong (coffee_id, taste_id) VALUES
  ((SELECT coffee_id FROM coffee WHERE reference = 134009550), (SELECT taste_id FROM taste WHERE type = "Doux"));

-- Guatemalan Antigua (Corsé)
INSERT INTO belong (coffee_id, taste_id) VALUES
  ((SELECT coffee_id FROM coffee WHERE reference = 256505890), (SELECT taste_id FROM taste WHERE type = "Corsé"));

-- Kenyan AA (Doux, Acide)
INSERT INTO belong (coffee_id, taste_id) VALUES
  ((SELECT coffee_id FROM coffee WHERE reference = 295432730), (SELECT taste_id FROM taste WHERE type = "Doux")),
  ((SELECT coffee_id FROM coffee WHERE reference = 295432730), (SELECT taste_id FROM taste WHERE type = "Acide"));

-- Sumatra Mandheling (Corsé)
INSERT INTO belong (coffee_id, taste_id) VALUES
  ((SELECT coffee_id FROM coffee WHERE reference = 302932754), (SELECT taste_id FROM taste WHERE type = "Corsé"));

-- Costa Rican Tarrazu (Acide)
INSERT INTO belong (coffee_id, taste_id) VALUES
  ((SELECT coffee_id FROM coffee WHERE reference = 327302954), (SELECT taste_id FROM taste WHERE type = "Acide"));

-- Vietnamese Robusta (Épicé)
INSERT INTO belong (coffee_id, taste_id) VALUES
  ((SELECT coffee_id FROM coffee WHERE reference = 549549090), (SELECT taste_id FROM taste WHERE type = "Épicé"));

-- Tanzanian Peaberry (Fruité, Corsé)
INSERT INTO belong (coffee_id, taste_id) VALUES
  ((SELECT coffee_id FROM coffee WHERE reference = 582954954), (SELECT taste_id FROM taste WHERE type = "Fruité")),
  ((SELECT coffee_id FROM coffee WHERE reference = 582954954), (SELECT taste_id FROM taste WHERE type = "Corsé"));

-- Jamaican Blue Mountain (Doux)
INSERT INTO belong (coffee_id, taste_id) VALUES
  ((SELECT coffee_id FROM coffee WHERE reference = 589100954), (SELECT taste_id FROM taste WHERE type = "Doux"));

-- Rwandan Bourbon (Fruité)
INSERT INTO belong (coffee_id, taste_id) VALUES
  ((SELECT coffee_id FROM coffee WHERE reference = 650753915), (SELECT taste_id FROM taste WHERE type = "Fruité"));

-- Panamanian Geisha (Fruité)
INSERT INTO belong (coffee_id, taste_id) VALUES
  ((SELECT coffee_id FROM coffee WHERE reference = 795501340), (SELECT taste_id FROM taste WHERE type = "Fruité"));

-- Peruvian Arabica (Corsé, Chocolaté)
INSERT INTO belong (coffee_id, taste_id) VALUES
  ((SELECT coffee_id FROM coffee WHERE reference = 954589100), (SELECT taste_id FROM taste WHERE type = "Corsé")),
  ((SELECT coffee_id FROM coffee WHERE reference = 954589100), (SELECT taste_id FROM taste WHERE type = "Chocolaté"));

-- Hawaiian Kona (Doux)
INSERT INTO belong (coffee_id, taste_id) VALUES
  ((SELECT coffee_id FROM coffee WHERE reference = 958090105), (SELECT taste_id FROM taste WHERE type = "Doux"));

-- Nicaraguan Maragogipe (Corsé, Fruité)
INSERT INTO belong (coffee_id, taste_id) VALUES
  ((SELECT coffee_id FROM coffee WHERE reference = 691550753), (SELECT taste_id FROM taste WHERE type = "Corsé")),
  ((SELECT coffee_id FROM coffee WHERE reference = 691550753), (SELECT taste_id FROM taste WHERE type = "Fruité"));



