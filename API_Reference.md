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
curl 'http://localhost:5001/api/v1/passenger/session?token=xGVp-Etet-9pu3-Fkx3'
```

#### Response

The response will be a status code `200` if the token is valid, or `400` if it is invalid.

### 1.2 POST passenger/session

#### JSON Body Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |

### 1.3 DELETE passenger/session

<!-- TODO
/api/v1/passenger/account GET,POST,PUT,DELETE
/api/v1/passenger/uid     GET
/api/v1/passenger/history GET,POST -->

## 2. DriverAccount

## 3. RideMatcher
