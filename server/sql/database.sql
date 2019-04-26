CREATE DATABASE IF NOT EXISTS webshop;

USE webshop;    --Tell mariaDB that we're using the newly created Database

CREATE TABLE IF NOT EXISTS Users (
    id INT NOT NULL AUTO_INCREMENT,
    uname VARCHAR(128) NOT NULL,
    umail VARCHAR(128) NOT NULL,
    upass VARCHAR(256) NOT NULL,
    phoneNumber VARCHAR(64),
    addrId INT,
    uimg TEXT,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Prods (
    id INT NOT NULL AUTO_INCREMENT,
    pname TEXT NOT NULL,
    price INT NOT NULL,
    pdesc TEXT,
    pimg TEXT,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Addr (
    id INT NOT NULL AUTO_INCREMENT,
    road TEXT,
    houseNumber TEXT,
    zipcode TEXT,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Orders (
    id INT NOT NULL AUTO_INCREMENT,
    userId INT NOT NULL,
    createdAt DATETIME NOT NULL,
    orderStatus TEXT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS ShipmentLists (
    id INT NOT NULL AUTO_INCREMENT,
    orderId INT NOT NULL,
    productId INT NOT NULL,
    PRIMARY KEY (id)
);
