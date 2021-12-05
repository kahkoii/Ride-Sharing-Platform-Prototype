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