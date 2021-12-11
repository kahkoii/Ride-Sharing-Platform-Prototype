start "Passenger Microservice" go run microservices/PassengerAccount/passenger.go

start "Driver Microservice" go run microservices/DriverAccount/driver.go

start "Ride Matcher Microservice" go run microservices/RideMatcher/matcher.go

go run main.go