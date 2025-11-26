CREATE database JS_SITE;

USE JS_SITE;

CREATE TABLE user (
    idx INT AUTO_INCREMENT PRIMARY KEY,
    userid VARCHAR(50) NOT NULL UNIQUE, 
    password VARCHAR(255) NOT NULL, 
    name VARCHAR(50) NOT NULL,
    birth_year INT NOT NULL,
    birth_month TINYINT NOT NULL,
    birth_day TINYINT NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE, 
    gender ENUM('male', 'female', 'other') NOT NULL
);
DROP TABLE user;

SELECT * FROM user;