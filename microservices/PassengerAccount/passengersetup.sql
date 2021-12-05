CREATE DATABASE passenger_db;

USE passenger_db;

CREATE TABLE Passengers (
	UID VARCHAR(16) NOT NULL PRIMARY KEY,
    FirstName VARCHAR(30),
    LastName VARCHAR(30),
    Phone VARCHAR(8),
    Email VARCHAR(50)
);

CREATE TABLE History (
	id MEDIUMINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    PassengerUID VARCHAR(16),
    DriverUID VARCHAR(16),
    LocationPostal VARCHAR(6),
    DestinationPostal VARCHAR(6),
    StartTime DATETIME,
    EndTime DATETIME,
    FOREIGN KEY (PassengerUID) REFERENCES Passengers(UID)
);

INSERT INTO Passengers (UID, FirstName, LastName, Phone, Email)
VALUES ("ift3houkwp4DSkbp", "Jake", "Lee", "91234567", "test@gmail.com");