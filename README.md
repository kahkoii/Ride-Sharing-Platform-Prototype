# Ride Sharing Platform Assignment

## 1. Project Description

This project was developed as part of an assignment deliverable for a Emerging Trends in IT (ETI) module, in which part of the requirements are to implement microservices using Go, making use of a MySQL database in the process and also implementing a client-side webapp to interact with these microservices.

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

### 2.2 Database Setup

Install MySQL locally and run the `passengersetup.sql` and `driversetup.sql` files located under the PassengerAccount and DriverAccount microservices to setup the databases. Afterwards, scroll to the bottom of the `passenger.go` and `driver.go` and change the username, password and port number for the database according to your local MySQL installation settings.

### 2.3 (Optional) Setup React Webapp for Development

Currently, the main go program serves the built web application from the `./client/build` folder. You may choose to install the required dependencies to run the web project independently for _development purposes_, but this is **NOT** necessary for the purposes of grading/deployment.

1. Install nodejs (any stable version should work, 12.14.1 is the one I am using)

2. Install the latest yarn version

3. Navigate into the `client` folder

4. Run `yarn install` to install the necessary node modules

5. Start the application with `yarn start` and visit 'localhost:3000' to view the application

## 3. Run Instructions

**After starting up the services, the web application can be accessed locally via http://localhost:5000**

### Manual Start

To manually start the required processes, run the following commands in separate command line terminals.

```sh
# Start client web app
go run main.go

# Start passenger microservice
go run microservices/PassengerAccount/passenger.go

# Start driver microservice
go run microservices/DriverAccount/driver.go

# Start ride matcher microservice
go run microservices/RideMatcher/matcher.go
```

### Easy Start (Windows)

**Note: Easy Start is not recommended, there are some bugs that cause the go programs to not respond occasionally when the run.bat file is used**

To start the main client web application and the 3 microservices automatically, simply run:

```sh
run.bat
```

## 4. System Architecture

![image](https://user-images.githubusercontent.com/33172738/145669790-7fdf6182-2d2c-460f-8c4b-2973a8b57c42.png)

**\*For a detailed guide to the APIs, please refer to the [API Reference](./API_Reference.md) file**

The microservices involved in this project are split into 3 groups, PassengerAccount, DriverAccount and RideMatcher. The PassengerAccount and DriverAccount microservices are designed to handle account-related processes, such as the storing of account credentials, and verifying of credentials during login. The splitting up of account-related processes into separate microservices for passengers and drivers, is specifically designed with scaling and security in mind.

Since HTTP requests can only be made client-side towards an API server and not the other way round, to facilitate the updating of the client-side frontend whenever a passenger and driver is matched, a WebSocket was used. WebSockets use a bi-directional messaging pattern as opposed to the request-response pattern of HTTP requests, and serves to better handle ongoing updates. Since the matching of passengers with drivers takes an indefinite amount of time, using HTTP requests to wait for an update may cause the requests to timeout before request fulfillment. As such, it would be more appropriate to establish a WebSocket connection when a passenger or driver client begins searching for a match, and also throughout the course of the ride, to update the client's of the ride status accordingly.

### 4.1 Scaling Considerations

Having passenger and driver account processing on different microservices allows for more resources to be allocated to the specific microservice according to user volume. For example, if the platform sees a surge in passengers using the platform while drivers remain about the same, more servers can be setup to run the PassengerAccount microservice, whilst the DriverAccount one can remain unchanged. Thus, this would help the platform scale according to demand, and better optimizing resources and saving costs.

### 4.2 Security Considerations

Since account-related processes for passengers and drivers are **handled in separate microservices**, in practice, 2 separate databases could be used for passenger and driver accounts. With this design, the passenger account database would have no direct access to the driver account database, only having the relevant API endpoints exposed to the client as required. This makes the system as a whole more secure, because in the unlikely event of a database breach, only the data within the affected database would be compromised, while the other remains safe. Having the same microservice serve both passengers and drivers, and using the same database for all accounts means all accounts being compromised in the event of a breach, thus making this system architecture comparably safer.

Another security consideration is the verification of HTTP requests using **tokens**. To verify that the actions coming from API requests for any account actually come from the account owner, a token system was implemented. For any API requests that attempt to get sensitive user information or do an action like finding a ride or editing user credentials, a token, which is a 4x4 character hexadecimal string separated by a '-', would be required as a request header. A token can be obtained when users login with their email and phone, and through the webapp, it would be saved as a cookie, to be reused in future API requests made by the client-side webapp. Currently, tokens are stored as runtime variables in the PassengerAccount and DriverAccount microservices, and if necessary, steps can be taken to make tokens expire after a certain time, requiring users to re-login frequently, significantly improving the overall security of user accounts.

On top of those, a third security consideration is the **careful usage of user unique identification (UID)**. Since the assignment requirements do not specify password as a field in account details, users are authenticated only by the email and phone. However, it is also stated that users should be able to change their emails and phone numbers at will, so neither the email nor the phone can be used as primary keys in the database, thus the UID was created. UIDs are randomly generated 16 character hexadecimal strings that serve as primary keys, and they are intended to be kept private, and is designed not to be sent to any client devices at all. This is intentional because unlike tokens, UIDs are meant to be permanently tagged to user accounts, so exposing the UID of an account may compromise the integrity of that account. Thus, transfer of UID data only occurs between the microservices, and never between the client and any microservice. Currently, both PassengerAccount and DriverAccount microservices have a `/uid` API endpoint that accepts `GET` methods to retrieve the UID of a user given a token. This is supposed to be used only by the RideMatcher microservice, but for simplicity, the current implementation exposes the `/uid` endpoint publicly. However, in practice, the endpoint can be restricted to only be used as an internal API instead of a public one, by either restricting the origin of requests made to that endpoint to be the RideMatcher's origin, or by making use of secrets to only send a UID response only if the secret is valid.

### 4.3 Downtime Considerations

With this system architecture, it is expected that in the event of any of the microservices being downed, no rides would be able to be made. This is intentional because in a real-world context, for safety and legal reasons, we need to be sure who the passenger and the driver is for any ride provided by the platform. As such, both Passenger and Driver account microservices would need to be up for verification purposes, and the Ride Matcher microservice would definitely be required to match rides in the first place.

However, if only the Ride Matcher microservice is down, users would still be able to login and manage their accounts, given that the microservice serving that account type is up. Similarly, if the DriverAccount microservice is downed, Passengers would still be able to login and perform Passenger-related account actions, vice versa for PassengerAccount.
