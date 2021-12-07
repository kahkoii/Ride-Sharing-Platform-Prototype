# Microservices API Reference

## 1. PassengerAccount

Base URL: http://localhost:5001/api/v1

---

### 1.1 GET passenger/session

This endpoint is used to check whether a provided token is currently valid.

#### Endpoint URL

```url
http://localhost:5001/api/v1/passenger/session
```

#### Query Parameters

| Name  | Required | Description                                                                                                                                | Example             |
| ----- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------- |
| token | Yes      | Pass the value of the `token` received via the [POST passenger/session](#12-post-passengersession) endpoint as the value of this parameter | xGVp-Etet-9pu3-Fkx3 |

#### Example Request

```sh
curl "http://localhost:5001/api/v1/passenger/session?token=xGVp-Etet-9pu3-Fkx3"
```

#### Response

The response will be a status code `200` if the token is valid, or `400` if it is invalid.

---

### 1.2 POST passenger/session

This endpoint is used to login the user using email and phone number credentials to receive a token.

#### Endpoint URL

```url
http://localhost:5001/api/v1/passenger/session
```

#### JSON Body Parameters

| Name    | Type   | Required | Description                                                       |
| ------- | ------ | -------- | ----------------------------------------------------------------- |
| `email` | string | Required | A valid email address that has already been registered previously |
| `phone` | string | Required | An 8-digit phone number with no country code                      |

#### Example Request

cURL

```sh
curl --request POST 'http://localhost:5001/api/v1/passenger/login' \
--header 'Content-Type: application/json' \
--data '{
    "email":"test@gmail.com",
    "phone": "91234567"
}'
```

Windows cURL

```sh
curl --request POST "http://localhost:5001/api/v1/passenger/session" --header "Content-Type:application/json" --data "{\"email\":\"test@gmail.com\",\"phone\": \"91234567\"}"
```

#### Response

The response will be the JSON string of a **newly generated token**, with a status code `200`.

---

### 1.3 DELETE passenger/session

This endpoint is used to logout the user by disabling an existing token.

#### Endpoint URL

```url
http://localhost:5001/api/v1/passenger/session
```

#### Query Parameters

| Name  | Required | Description                                                                                                                                | Example             |
| ----- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------- |
| token | Yes      | Pass the value of the `token` received via the [POST passenger/session](#12-post-passengersession) endpoint as the value of this parameter | xGVp-Etet-9pu3-Fkx3 |

#### Example Request

```sh
curl --request DELETE "http://localhost:5001/api/v1/passenger/session?token=xGVp-Etet-9pu3-Fkx3"
```

#### Response

The response will be a status code `200` if the token is valid, or `400` if it is invalid.

---

### 1.4 GET passenger/account

This endpoint is used to retrieve the account details of a user.

#### Endpoint URL

```url
http://localhost:5001/api/v1/passenger/account
```

#### Query Parameters

| Name  | Required | Description                                                                                                                                | Example             |
| ----- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------- |
| token | Yes      | Pass the value of the `token` received via the [POST passenger/session](#12-post-passengersession) endpoint as the value of this parameter | xGVp-Etet-9pu3-Fkx3 |

#### Example Request

```sh
curl "http://localhost:5001/api/v1/passenger/account?token=xGVp-Etet-9pu3-Fkx3"
```

#### Response

If the token is valid, a JSON object with a "Content-Type: application/json" will be returned, with the fields `firstName`, `lastName`, `phone` and `email`.

**Example**

```JSON
{
    "firstName": "Thomas",
    "lastName": "Lee",
    "phone": "91234567",
    "email": "test@gmail.com"
}
```

---

### 1.5 POST passenger/account

This endpoint is used to register a new account on the platform.

#### Endpoint URL

```url
http://localhost:5001/api/v1/passenger/account
```

#### JSON Body Parameters

| Name        | Type   | Required | Description                                                       |
| ----------- | ------ | -------- | ----------------------------------------------------------------- |
| `email`     | string | Required | A valid email address that has already been registered previously |
| `phone`     | string | Required | An 8-digit phone number with no country code                      |
| `firstName` | string | Required | An English personal name                                          |
| `lastName`  | string | Required | An English family name                                            |

#### Example Request

cURL

```sh
curl --request POST 'http://localhost:5001/api/v1/passenger/account' \
--header 'Content-Type: application/json' \
--data '{
    "email":"a@b.com",
    "phone": "99999999",
    "firstName": "Bob",
    "lastName": "Dylan"
}'
```

Windows cURL

```sh
curl --request POST "http://localhost:5001/api/v1/passenger/account" --header "Content-Type: application/json" --data "{\"email\":\"a@b.com\",\"phone\": \"99999999\",\"firstName\": \"Bob\",\"lastName\": \"Dylan\"}"
```

#### Response

The response will be a status code `200` is successful, or an error code with a corresponding status message if unsuccessful.

---

### 1.6 PUT passenger/account

This endpoint is used to edit the details of an existing account.

#### Endpoint URL

```url
http://localhost:5001/api/v1/passenger/account
```

#### Query Parameters

| Name  | Required | Description                                                                                                                                | Example             |
| ----- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------- |
| token | Yes      | Pass the value of the `token` received via the [POST passenger/session](#12-post-passengersession) endpoint as the value of this parameter | xGVp-Etet-9pu3-Fkx3 |

#### JSON Body Parameters

| Name        | Type   | Required | Description                                                       |
| ----------- | ------ | -------- | ----------------------------------------------------------------- |
| `email`     | string | Optional | A valid email address that has already been registered previously |
| `phone`     | string | Optional | An 8-digit phone number with no country code                      |
| `firstName` | string | Optional | An English personal name                                          |
| `lastName`  | string | Optional | An English family name                                            |

#### Example Request

cURL

```sh
curl --request PUT 'http://localhost:5001/api/v1/passenger/account?token=xGVp-Etet-9pu3-Fkx3' \
--header 'Content-Type: application/json' \
--data '{
    "email":"brucelee@gmail.com",
    "firstName": "Bruce"
}'
```

Windows cURL

```sh
curl --request PUT "http://localhost:5001/api/v1/passenger/account?token=xGVp-Etet-9pu3-Fkx3" --header "Content-Type: application/json" --data "{\"email\":\"brucelee@gmail.com\",\"firstName\": \"Bruce\"}"
```

#### Response

The response will be a status code `200` is successful, or an error code with a corresponding status message if unsuccessful.

---

### 1.7 DELETE passenger/account

Deletion of account not allowed, all requests will get a error status code of `400` by default.

#### Endpoint URL

```url
http://localhost:5001/api/v1/passenger/account
```

#### Example Request

```sh
curl --request DELETE "http://localhost:5001/api/v1/passenger/account?token=xGVp-Etet-9pu3-Fkx3"
```

---

### 1.8 GET passenger/uid

This endpoint is used to retrieve the UID of an account using the corresponding token. The endpoint was designed to be used only by backend microservices like the current RideMatcher microservice.

#### Endpoint URL

```url
http://localhost:5001/api/v1/passenger/uid
```

#### Query Parameters

| Name  | Required | Description                                                                                                                                | Example             |
| ----- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------- |
| token | Yes      | Pass the value of the `token` received via the [POST passenger/session](#12-post-passengersession) endpoint as the value of this parameter | xGVp-Etet-9pu3-Fkx3 |

#### Example Request

```sh
curl "http://localhost:5001/api/v1/passenger/uid?token=xGVp-Etet-9pu3-Fkx3"
```

#### Response

If the token is valid, a string object with a "Content-Type: application/json" will be returned containing only a `uid`

**Example**

```JSON
"ift3houkwp4DSkbp"
```

---

### 1.9 GET passenger/history

This endpoint is used to retrieve the full ride history of the passenger.

#### Endpoint URL

```url
http://localhost:5001/api/v1/passenger/history
```

#### Query Parameters

| Name  | Required | Description                                                                                                                                | Example             |
| ----- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------- |
| token | Yes      | Pass the value of the `token` received via the [POST passenger/session](#12-post-passengersession) endpoint as the value of this parameter | xGVp-Etet-9pu3-Fkx3 |

#### Example Request

```sh
curl "http://localhost:5001/api/v1/passenger/history?token=xGVp-Etet-9pu3-Fkx3"
```

#### Response

If the token is valid, a JSON object with a "Content-Type: application/json" will be returned, with the fields `refID` as reference ID for the trip, `locationPostal`, `destinationPostal`, `startTime` and `endTime` in the format `YYYY-MM-DD hh:mm:ss`.

**Example**

```JSON
[
    {
        "refID": "6",
        "locationPostal": "544657",
        "destinationPostal": "725172",
        "startTime": "2021-11-23 13:52:10",
        "endTime": "2021-11-23 13:52:16"
    },
    {
        "refID": "11",
        "locationPostal": "123456",
        "destinationPostal": "654321",
        "startTime": "2021-11-24 00:45:44",
        "endTime": "2021-11-24 00:46:15"
    }
]
```

---

### 1.10 POST passenger/history

This endpoint is used to save a list of trip histories to the database. The endpoint was designed to be used only by the RideMatcher microservice to publish trip histories whenever available.

#### Endpoint URL

```url
http://localhost:5001/api/v1/passenger/history
```

#### JSON Body Parameters

| Name                | Type   | Required | Description                                |
| ------------------- | ------ | -------- | ------------------------------------------ |
| `driverUID`         | string | Required | The unique ID of a driver account          |
| `passengerUID`      | string | Required | The unique ID of a passenger account       |
| `locationPostal`    | string | Required | 6-digit Postal code of the starting point  |
| `destinationPostal` | string | Required | 6-digit Postal code of the destination     |
| `startTime`         | string | required | Start time in `YYYY-MM-DD hh:mm:ss` format |
| `endTime`           | string | required | End time in `YYYY-MM-DD hh:mm:ss` format   |

#### Example Request

cURL

```sh
curl --request POST 'http://localhost:5001/api/v1/passenger/history' \
--header 'Content-Type: application/json' \
--data '[
    {
        "driverUID": "O8jOZIMDvjT70nAP",
        "passengerUID": "LtikJjivRBwHncUZ",
        "locationPostal": "111111",
        "destinationPostal": "111111",
        "startTime": "2020-12-24 11:11:11",
        "endTime": "2020-12-24 11:11:11"
    }
]'
```

Windows cURL

```sh
curl --request POST "http://localhost:5001/api/v1/passenger/history" --header "Content-Type: application/json" --data "[{\"driverUID\": \"O8jOZIMDvjT70nAP\",\"passengerUID\": \"LtikJjivRBwHncUZ\",\"locationPostal\": \"111111\",\"destinationPostal\": \"111111\",\"startTime\": \"2020-12-24 11:11:11\",\"endTime\": \"2020-12-24 11:11:11\"}]"
```

#### Response

The response will be a status code `200` is successful, or an error code with a corresponding status message if unsuccessful.

---

## 2. DriverAccount

Base URL: http://localhost:5002/api/v1

**\*Note**: The documentation for DriverAccount API endpoints are the same as that of PassengerAccount, except for the endpoint URLs, where the port is `5002` instead of `5001` and `/passenger` is replaced with `/driver`

---

### 2.1 GET driver/session

This endpoint is used to check whether a provided token is currently valid. Documentation for this endpoint is available at [1.1 GET passenger/session](#11-get-passengersession)

#### Endpoint URL

```url
http://localhost:5002/api/v1/driver/session
```

---

### 2.2 POST driver/session

This endpoint is used to login the user using email and phone number credentials to receive a token. Documentation for this endpoint is available at [1.2 POST passenger/session](#12-post-passengersession)

#### Endpoint URL

```url
http://localhost:5002/api/v1/driver/session
```

---

### 2.3 DELETE driver/session

This endpoint is used to logout the user by disabling an existing token. Documentation for this endpoint is available at [1.3 DELETE passenger/session](#13-delete-passengersession)

#### Endpoint URL

```url
http://localhost:5002/api/v1/driver/session
```

---

### 2.4 GET driver/account

This endpoint is used to retrieve the account details of a user. Documentation for this endpoint is available at [1.4 GET passenger/account](#14-get-passengeraccount)

#### Endpoint URL

```url
http://localhost:5002/api/v1/driver/account
```

---

### 2.5 POST driver/account

This endpoint is used to register a new account on the platform. Documentation for this endpoint is available at [1.5 POST passenger/account](#15-post-passengeraccount)

#### Endpoint URL

```url
http://localhost:5002/api/v1/driver/account
```

---

### 2.6 PUT driver/account

This endpoint is used to edit the details of an existing account. Documentation for this endpoint is available at [1.6 PUT passenger/session](#16-put-passengeraccount)

#### Endpoint URL

```url
http://localhost:5002/api/v1/driver/account
```

---

### 2.7 DELETE driver/account

Deletion of account not allowed, all requests will get a error status code of `400` by default. Documentation for this endpoint is available at [1.7 DELETE passenger/account](#17-delete-passengeraccount)

#### Endpoint URL

```url
http://localhost:5002/api/v1/driver/account
```

---

## 3. RideMatcher

Base URL: http://localhost:5003/api/v1

---

### 3.1 POST matcher/queue-passenger

This endpoint is used to add a passenger to the queue to find a driver for a ride.
**This endpoint should be used with the [WebSocket endpoint](#34-websocket) to receive updates for the queue status.**

#### Endpoint URL

```url
http://localhost:5003/api/v1/matcher/queue-passenger
```

#### Query Parameters

| Name  | Required | Description                                                                                                                                | Example             |
| ----- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------- |
| token | Yes      | Pass the value of the `token` received via the [POST passenger/session](#12-post-passengersession) endpoint as the value of this parameter | xGVp-Etet-9pu3-Fkx3 |

#### JSON Body Parameters

| Name                | Type   | Required | Description                               |
| ------------------- | ------ | -------- | ----------------------------------------- |
| `locationPostal`    | string | Required | 6-digit Postal code of the starting point |
| `destinationPostal` | string | Required | 6-digit Postal code of the destination    |

#### Example Request

cURL

```sh
curl --request POST 'http://localhost:5003/api/v1/matcher/queue-passenger?token=xGVp-Etet-9pu3-Fkx3' \
--header 'Content-Type: application/json' \
--data '{
    "locationPostal": "123456",
    "destinationPostal": "654321"
}'
```

Windows cURL

```sh
curl --request POST "http://localhost:5003/api/v1/matcher/queue-passenger?token=xGVp-Etet-9pu3-Fkx3" --header "Content-Type: application/json" --data "{\"locationPostal\": \"123456\",\"destinationPostal\": \"654321\"}"
```

#### Response

The response will be a status code `200` is successful, or an error code with a corresponding status message if unsuccessful.

**\*Note: A success response only means that the passenger was added to the queue, not that a driver was found.**

---

### 3.2 POST matcher/queue-driver

This endpoint is used to add a driver to the queue to find a passenger for a ride.
**This endpoint should be used with the [WebSocket endpoint](#34-websocket) to receive updates for the queue status.**

#### Endpoint URL

```url
http://localhost:5003/api/v1/matcher/queue-driver
```

#### Query Parameters

| Name  | Required | Description                                                                                                                          | Example             |
| ----- | -------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------- |
| token | Yes      | Pass the value of the `token` received via the [POST driver/session](#22-post-driversession) endpoint as the value of this parameter | xGVp-Etet-9pu3-Fkx3 |

#### Example Request

```sh
curl --request POST "http://localhost:5003/api/v1/matcher/queue-driver?token=xGVp-Etet-9pu3-Fkx3"
```

#### Response

The response will be a status code `200` is successful, or an error code with a corresponding status message if unsuccessful.

**\*Note: A success response only means that the driver was added to the queue, not that a passenger was found.**

---

### 3.3 POST matcher/end-trip

This endpoint is used to end an existing trip using a valid driver's token.

#### Endpoint URL

```url
http://localhost:5003/api/v1/matcher/end-trip
```

#### Query Parameters

| Name  | Required | Description                                                                                                                          | Example             |
| ----- | -------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------- |
| token | Yes      | Pass the value of the `token` received via the [POST driver/session](#22-post-driversession) endpoint as the value of this parameter | xGVp-Etet-9pu3-Fkx3 |

#### Example Request

```sh
curl --request POST "http://localhost:5003/api/v1/matcher/end-trip?token=xGVp-Etet-9pu3-Fkx3"
```

#### Response

The response will be a status code `200` is successful, or an error code with a corresponding status message if unsuccessful.

---

### 3.4 WebSocket

The WebSocket is designed to be used by both the passenger and driver to receive updates regarding the ride. The usage of this endpoint differs for Passenger and Driver account types.

#### Passenger Usage

For Passengers, upon successful connection to the WebSocket, it expects the client to send the token of the passenger with the capitalized letter `'P'` appended to the front e.g. `PxGVp-Etet-9pu3-Fkx3`. After receiving a valid token from the client, when the corresponding passenger of the token is matched with a driver, the WebSocket would send a message code `"1"` to the client. When the driver ends the ride, the passenger would then receive another message code `"2"`, before the WebSocket connection is terminated. Note that the WebSocket connection should be maintained for the duration of the trip.

#### Driver Usage

For Drivers, upon successful connection to the WebSocket, it expects the client to send the token of the driver with the capitalized letter `'D'` appended to the front e.g. `DxGVp-Etet-9pu3-Fkx3`. After receiving a valid token from the client, when the corresponding driver of the token is matched with a passenger, the WebSocket would send a message code `"1"` to the client, before terminating the WebSocket connection. **When the driver decides to end the ride, they should not be using the WebSocket, but should instead use the [POST matcher/end-trip](#33-post-matcherend-trip) endpoint to end the trip.**

#### Endpoint URL

```url
ws://localhost:5003/api/v1/matcher/ws
```

---
