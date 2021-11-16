package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

type loginCredentials struct {
	Email string `json:"email"`
	Phone string `json:"phone"`
}

type passengerDetails struct {
	UID string `json"uid"`
	FirstName string `json"firstName"`
	LastName string `json"lastName"`
	Phone string `json:"phone"`
	Email string `json:"email"`
}

var tokenMap map[string]string
var onlineUsers map[string]string
var db *sql.DB

func getTokenFromHeader(r *http.Request) string {
    v := r.URL.Query()
    if token, ok := v["token"]; ok {
        return token[0]
    }
	return "INVALID"
}


// UID: a 16 char hexadecimal string
func generateUID() string{
	// Algorithm derived from https://stackoverflow.com/a/31832326
	const charBytes = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	const charIdxBits = 6
	const charIdxMask = 1<<charIdxBits - 1
	charCount := 16
	b := make([]byte, charCount)
	for i := 0; i < charCount; {
		if idx := int(rand.Int63() & charIdxMask); idx < len(charBytes) {
			b[i] = charBytes[idx]
			i++
		}
	}
	return string(b)
}

// Token: 4 x 4 char hexadecimal string separated by a '-'
func generateToken() string {
	// Algorithm derived from https://stackoverflow.com/a/31832326
	const charBytes = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	const charIdxBits = 6
	const charIdxMask = 1<<charIdxBits - 1
	charCount := 19
	b := make([]byte, charCount)
	for i := 0; i < charCount; {
		if idx := int(rand.Int63() & charIdxMask); idx < len(charBytes) {
			if i % 5 == 4 {
				b[i] = "-"[0]
			} else {
				b[i] = charBytes[idx]
			}
			i++
		}
	}
	return string(b)
}

func enableToken(token string, uid string) {
	// check if user already has a token
	existingToken := ""
	if user, exists := onlineUsers[uid]; exists {
		existingToken = user
	}
	// replace existing token with new token
	if existingToken != "" {
		disableToken(existingToken)
	}
	tokenMap[token] = uid
	onlineUsers[uid] = token
	fmt.Println("adding new token-uid pair to map")
	printMap(tokenMap)
}

func disableToken(token string) {
	delete(tokenMap, token)
}

func verifyToken(token string) bool {
	_, ok := tokenMap[token]
	fmt.Println("verifying token")
	return ok
}

func printMap(mapObj map[string]string) { // TODO: remove this after debug
	fmt.Println("========================\nPrinting token map")
	for k, v := range mapObj {
		fmt.Println("Token:", k, "User:", v)
	}
	fmt.Println("========================")
}

func DB_getPassengerByEmail(email string) passengerDetails {
	var p passengerDetails

	queryString := fmt.Sprintf("Select * FROM passenger_db.passengers WHERE Email='%s'", email)
	results, err := db.Query(queryString) 

    if err != nil {
        panic(err.Error())
    }

    for results.Next() {
        err = results.Scan(&p.UID, &p.FirstName, &p.LastName, &p.Phone, &p.Email)
        if err != nil {
            panic(err.Error()) 
        }      
    }
	return p
}

func DB_editPassengerByEmail() { //TODO
	fmt.Println("TODO")
}

func login(w http.ResponseWriter, r *http.Request) { // TODO
	if r.Method == "GET" {
		fmt.Println("Received LOGIN GET request for INSERT_ID_HERE")
		if r.Header.Get("Content-type")=="application/json" {
			reqBody, err := ioutil.ReadAll(r.Body)
			if err == nil {
				// convert JSON to object
				var credentials loginCredentials
				json.Unmarshal(reqBody, &credentials) 
				
				// get passenger's record from database
				p := DB_getPassengerByEmail(credentials.Email)

				// check if there is an entry with the submitted email
				if p.Email != "" {
					// check if phone submitted matches database record
					if credentials.Phone == p.Phone {
						// return access token
						token := generateToken()
						enableToken(token, p.UID)
						w.WriteHeader(http.StatusOK)
						json.NewEncoder(w).Encode(token)
					} else {
						w.WriteHeader(http.StatusUnauthorized)
                		w.Write([]byte("401 - Email or phone number incorrect"))
					}

				} else {
					w.WriteHeader(http.StatusUnauthorized)
                	w.Write([]byte("401 - No account has been registered with this email"))
				}

			} else {
                w.WriteHeader(http.StatusUnprocessableEntity)
                w.Write([]byte("422 - Credentials should be in JSON format"))
            }
		} else {
			w.WriteHeader(http.StatusBadRequest)
        	w.Write([]byte("400 - Header content type not application/json"))
		}
	} else {
		w.WriteHeader(http.StatusMethodNotAllowed)
        w.Write([]byte("405 - Invalid API method"))
	}
}

func register(w http.ResponseWriter, r *http.Request) { // TODO
	if r.Method == "POST" {
		fmt.Println("Received REGISTER PUT request")
		if r.Header.Get("Content-type")=="application/json" {
			reqBody, err := ioutil.ReadAll(r.Body)
			if err == nil {
				// convert JSON to object
				var acc passengerDetails
				json.Unmarshal(reqBody, &acc) 
				// validate registration details
				if (acc.Email == "" || acc.Phone == "" || acc.FirstName == "" || acc.LastName == "") {
					fmt.Println("WRONG")
					w.WriteHeader(http.StatusBadRequest)
                	w.Write([]byte("400 - Account details incomplete"))
				}
				// TODO: CHECK EMAIL NOT IN DATABASE, RETURN ERROR
				// TODO: UPDATE DATABASE WITH NEW ENTRIES
				w.WriteHeader(http.StatusOK)
			} else {
                w.WriteHeader(http.StatusUnprocessableEntity)
                w.Write([]byte("422 - Account details should be in JSON format"))
            }
		} else {
			w.WriteHeader(http.StatusBadRequest)
        	w.Write([]byte("400 - Header content type not application/json"))
		}
	} else {
		w.WriteHeader(http.StatusMethodNotAllowed)
        w.Write([]byte("405 - Invalid API method"))
	}
}

func edit(w http.ResponseWriter, r *http.Request) { // TODO
	token := getTokenFromHeader(r)
	if token == "INVALID" { // TODO: VERIFY TOKEN
        w.WriteHeader(http.StatusNotFound)
        w.Write([]byte("401 - Invalid key"))
        return
    }

	if r.Method == "PUT" {
		fmt.Println("Received EDIT PUT request for INSERT_ID_HERE")
		if r.Header.Get("Content-type")=="application/json" {
			reqBody, err := ioutil.ReadAll(r.Body)
			if err == nil {
				// convert JSON to object
				var acc passengerDetails
				json.Unmarshal(reqBody, &acc) 
				// TODO: CHECK EMAIL NOT IN DATABASE, RETURN ERROR
				// TODO: UPDATE DATABASE WITH NEW ENTRIES
				w.WriteHeader(http.StatusOK)
			} else {
                w.WriteHeader(http.StatusUnprocessableEntity)
                w.Write([]byte("422 - Account details should be in JSON format"))
            }
		} else {
			w.WriteHeader(http.StatusBadRequest)
        	w.Write([]byte("400 - Header content type not application/json"))
		}
	} else {
		w.WriteHeader(http.StatusMethodNotAllowed)
        w.Write([]byte("405 - Invalid API method"))
	}
}

// LET KEY = UNIQUE ID, WHERE ID = EMAIL HASHED WITH PHONE NO. AS SALT
func main() {
	router := mux.NewRouter()
	tokenMap = make(map[string]string)
	onlineUsers = make(map[string]string)

    router.HandleFunc("/api/v1/passenger", login).Methods("GET")
	router.HandleFunc("/api/v1/passenger/{userid}", edit).Methods("PUT")
	router.HandleFunc("/api/v1/passenger/register", register).Methods("POST")

	var err error
	db, err = sql.Open("mysql", "user:password@tcp(127.0.0.1:3306)/passenger_db")
	if err != nil {
		panic(err.Error())
	} 
	defer db.Close()

	fmt.Println("Serving passenger account API at port 5001")
    log.Fatal(http.ListenAndServe(":5001", router))
}