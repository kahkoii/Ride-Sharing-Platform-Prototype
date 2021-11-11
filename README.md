# Ride Sharing Platform Assignment

## Project Description

This webapp was developed as part of an assignment deliverable for a Emerging Trends in IT (ETI) module, in which part of the requirements are to implement microservices using Go, and at the same time make use of a database.

## Setup Instructions

### Go Library Installations

Install the necessary go libaries by following the commands below:

```sh
go get -u github.com/gin-gonic/contrib/static
go get -u github.com/gin-gonic/gin
go get -u github.com/gorilla/mux
go get -u github.com/go-sql-driver/mysql
```

### (Optional) Setup React Webapp for Development

Currently, the main go program serves the built web application from the `./client/build` folder. You may choose to install the required dependencies to run the web project independently for _development purposes_, but this is **NOT** necessary for the purposes of grading/deployment.

1. Install nodejs (any stable version should work, 12.14.1 is the one I am using)

2. Install the latest yarn version

3. Navigate into the `client` folder

4. Run `yarn install` to install the necessary node modules

5. Start the application with `yarn start` and visit 'localhost:3000' to view the application

## System Architecture

## Microservices Design
