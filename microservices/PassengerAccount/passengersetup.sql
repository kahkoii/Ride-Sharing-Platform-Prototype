CREATE DATABASE passenger_db;

USE passenger_db;

CREATE TABLE Passengers (
	UID VARCHAR(16) NOT NULL PRIMARY KEY,
    FirstName VARCHAR(30),
    LastName VARCHAR(30),
    Phone VARCHAR(8),
    Email VARCHAR(50)
);

INSERT INTO Passengers (UID, FirstName, LastName, Phone, Email)
VALUES ("ift3houkwp4DSkbp", "Jake", "Lee", "91827162", "jakelee@gmail.com");