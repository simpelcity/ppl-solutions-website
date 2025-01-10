DROP DATABASE IF EXISTS `ppl_solutions`;

CREATE DATABASE `ppl_solutions`;

USE `ppl_solutions`;

CREATE TABLE `users` (
    id int AUTO_INCREMENT PRIMARY KEY,
    username varchar(100),
    password varchar(100)
);

INSERT INTO users (`username`, `password`) values ('Wietsegaming', 'admin');

