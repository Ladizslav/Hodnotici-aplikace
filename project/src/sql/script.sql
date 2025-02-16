-- Create database
CREATE DATABASE IF NOT EXISTS snacktrack;

-- Use the database
USE snacktrack;

-- Create Table_login
CREATE TABLE Table_login (
    login varchar(50) PRIMARY KEY,
    heslo varchar(50) NOT NULL
) ENGINE=InnoDB;

-- Create Table_obedy
CREATE TABLE Table_obedy (
    id_obedy int AUTO_INCREMENT PRIMARY KEY,
    Hlavni_chod_s_prilohou varchar(300),
    Polevka varchar(300),
    Dezert varchar(300),
    Piti varchar(300),
    datum date NOT NULL
) ENGINE=InnoDB;

-- Create Table_rating
CREATE TABLE Table_rating (
    id_rating int AUTO_INCREMENT PRIMARY KEY,
    FK_Table_login varchar(50) NOT NULL,
    FK_Table_obedy int NOT NULL,
    Priplatek int NOT NULL,
    Porce int NOT NULL CHECK (Porce BETWEEN 0 AND 5),
    Teplota int NOT NULL CHECK (Teplota BETWEEN 0 AND 5),
    Vzhled int NOT NULL CHECK (Vzhled BETWEEN 0 AND 5),
    Apetit int NOT NULL CHECK (Apetit BETWEEN 0 AND 5),
    Hodnoceno bit NOT NULL,
    FOREIGN KEY (FK_Table_login) REFERENCES Table_login(login) ON DELETE CASCADE,
    FOREIGN KEY (FK_Table_obedy) REFERENCES Table_obedy(id_obedy) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Create indexes for foreign keys
CREATE INDEX idx_FK_Table_login ON Table_rating (FK_Table_login);
CREATE INDEX idx_FK_Table_obedy ON Table_rating (FK_Table_obedy);



-- 1. View sorted by Table_obedy date
CREATE VIEW vw_meals_sorted_by_date AS
SELECT 
	o.Hlavni_chod_s_prilohou,
    o.Polevka,
    o.Dezert,
    o.Piti,
    o.datum,
    r.Priplatek,
    r.Porce,
    r.Teplota,
    r.Vzhled,
    r.Apetit,
    r.Hodnoceno
FROM Table_obedy o
LEFT JOIN Table_rating r ON o.id_obedy = r.FK_Table_obedy
ORDER BY o.datum;

-- 2. View for current week with bit = 1
CREATE VIEW vw_current_week_answered AS
SELECT 
	o.Hlavni_chod_s_prilohou,
    o.Polevka,
    o.Dezert,
    o.Piti,
    o.datum,
    r.Priplatek,
    r.Porce,
    r.Teplota,
    r.Vzhled,
    r.Apetit,
    r.Hodnoceno
FROM Table_obedy o
JOIN Table_rating r ON o.id_obedy = r.FK_Table_obedy
WHERE r.Hodnoceno = 1
AND YEARWEEK(o.datum) = YEARWEEK(CURDATE());

-- 3. View for current week with bit = 0
CREATE VIEW vw_current_week_unanswered AS
SELECT 
    o.Hlavni_chod_s_prilohou,
    o.Polevka,
    o.Dezert,
    o.Piti,
    o.datum,
    r.Priplatek,
    r.Porce,
    r.Teplota,
    r.Vzhled,
    r.Apetit,
    r.Hodnoceno
FROM Table_obedy o
JOIN Table_rating r ON o.id_obedy = r.FK_Table_obedy
WHERE r.Hodnoceno = 0
AND YEARWEEK(o.datum) = YEARWEEK(CURDATE());

-- 4. View for all records with bit = 1
CREATE VIEW vw_all_answered AS
SELECT 
    o.Hlavni_chod_s_prilohou,
    o.Polevka,
    o.Dezert,
    o.Piti,
    o.datum,
    r.Priplatek,
    r.Porce,
    r.Teplota,
    r.Vzhled,
    r.Apetit,
    r.Hodnoceno
FROM Table_obedy o
JOIN Table_rating r ON o.id_obedy = r.FK_Table_obedy
WHERE r.Hodnoceno = 1;

-- 5. View for all records with bit = 0
CREATE VIEW vw_all_unanswered AS
SELECT 
    o.Hlavni_chod_s_prilohou,
    o.Polevka,
    o.Dezert,
    o.Piti,
    o.datum,
    r.Priplatek,
    r.Porce,
    r.Teplota,
    r.Vzhled,
    r.Apetit,
    r.Hodnoceno
    FROM Table_obedy o
JOIN Table_rating r ON o.id_obedy = r.FK_Table_obedy
WHERE r.Hodnoceno = 0;

