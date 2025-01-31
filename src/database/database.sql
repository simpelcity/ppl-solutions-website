DROP DATABASE IF EXISTS `ppl_solutions`;

CREATE DATABASE `ppl_solutions`;

USE `ppl_solutions`;

CREATE TABLE users (
    id MEDIUMINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL
);