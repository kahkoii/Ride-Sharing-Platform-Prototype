# Ride Sharing Platform Assignment

## 1. Project Description

This webapp was developed as part of an assignment deliverable for a Emerging Trends in IT (ETI) module, in which part of the requirements are to implement microservices using Go, and at the same time make use of a database.

## 2. Setup Instructions

### 2.1 Go Library Installations

Install the necessary go libaries by following the commands below:

```sh
go get -u github.com/gin-gonic/contrib/static
go get -u github.com/gin-gonic/gin
go get -u github.com/gorilla/mux
go get -u github.com/gorilla/handlers
go get -u github.com/gorilla/websocket
go get -u github.com/go-sql-driver/mysql
```

### 2.2 (Optional) Setup React Webapp for Development

Currently, the main go program serves the built web application from the `./client/build` folder. You may choose to install the required dependencies to run the web project independently for _development purposes_, but this is **NOT** necessary for the purposes of grading/deployment.

1. Install nodejs (any stable version should work, 12.14.1 is the one I am using)

2. Install the latest yarn version

3. Navigate into the `client` folder

4. Run `yarn install` to install the necessary node modules

5. Start the application with `yarn start` and visit 'localhost:3000' to view the application

## 3. System Architecture

The microservices involved in this project are split into 3 groups, PassengerAccount, DriverAccount and RideMatcher. The PassengerAccount and DriverAccount microservices are designed to handle account-related processes, such as the storing of account credentials, and verifying of credentials during login. The splitting up of account-related processes into separate microservices for passengers and drivers, is specifically designed with scaling and security in mind.

### 3.1 Scaling

Having passenger and driver account processing on different microservices allows for more resources to be allocated to the specific microservice according to user volume. For example, if the platform sees a surge in passengers using the platform while drivers remains about the same, more servers can be setup to run the PassengerAccount microservice, whilst the DriverAccount one can remain unchanged. Thus, this which would help the platform scale according to demand, and better optimizing resources and saving costs.

### 3.2 Security

Since account-related processes for passengers and drivers are handled in separate microservices, in practice, 2 separate databases could be used for passenger and driver accounts. With this design, the passenger account database would have no direct access to the driver account database, only having the relevant API endpoints exposed to the client as required. This makes the system as a whole more secure, because in the unlikely event of a database breach, only the data within the affected database would be compromised, while the other remains safe. Having the same microservice serve both passengers and drivers, and using the same database for all accounts means all accounts being compromised in the event of a breach, thus making this system architecture comparibly safer.

## 4. Microservices Design
