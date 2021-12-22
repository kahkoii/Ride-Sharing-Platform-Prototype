CREATE USER 'user'@'%' IDENTIFIED BY 'password';
GRANT ALL ON *.* TO 'user'@'%';

-- Passenger Database Setup
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

-- Driver Database Setup
CREATE DATABASE driver_db;

USE driver_db;

CREATE TABLE Drivers (
	UID VARCHAR(16) NOT NULL PRIMARY KEY,
    FirstName VARCHAR(30),
    LastName VARCHAR(30),
    Phone VARCHAR(8),
    Email VARCHAR(50),
    ID VARCHAR(9),
    LicenseNo VARCHAR(8)
);

INSERT INTO Drivers (UID, FirstName, LastName, Phone, Email, ID, LicenseNo)
VALUES ("l29skA2pXatUW5i7", "Lewis", "Hamilton", "91234567", "test@gmail.com", "T0209172L", "SGX9261R");