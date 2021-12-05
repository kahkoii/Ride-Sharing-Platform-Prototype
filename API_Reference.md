# Microservices API Reference

## 1. PassengerAccount

Base URL: http://localhost:5001/api/v1

### 1.1 GET passenger/session

#### Description

This endpoint is used to check whether a provided token is currently valid.

#### Query Parameters

| Name  | Required | Description                                                                                                                                  | Example             |
| ----- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| token | Yes      | Pass the value of the `token` received via the [POST passenger/session](#1.2-post-passenger/session) endpoint as the value of this parameter | xGVp-Etet-9pu3-Fkx3 |

#### Example Request

```sh
curl "http://localhost:5001/api/v1/passenger/session?token=xGVp-Etet-9pu3-Fkx3"
```

#### Response

The response will be a status code `200` if the token is valid, or `400` if it is invalid.

### 1.2 POST passenger/session

#### Description

This endpoint is used to login the user using email and phone number credentials to receive a token

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

### 1.3 DELETE passenger/session

<!-- TODO
/api/v1/passenger/account GET,POST,PUT,DELETE
/api/v1/passenger/uid     GET
/api/v1/passenger/history GET,POST -->

## 2. DriverAccount

## 3. RideMatcher
