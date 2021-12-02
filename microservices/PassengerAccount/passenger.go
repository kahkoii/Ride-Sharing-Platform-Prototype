package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

type loginCredentials struct {
	Email string `json:"email"`
	Phone string `json:"phone"`
}

type passengerDetails struct {
	UID string `json:"uid"`
	FirstName string `json:"firstName"`
	LastName string `json:"lastName"`
	Phone string `json:"phone"`
	Email string `json:"email"`
}

type passengerDetailsNoID struct {
	FirstName string `json:"firstName"`
	LastName string `json:"lastName"`
	Phone string `json:"phone"`
	Email string `json:"email"`
}

type tokenString struct {
	Token string `json:"token"`
}

type completedTrip struct {
	DriverUID string 			`json:"driverUID"`
	PassengerUID string 		`json:"passengerUID"`
	LocationPostal string 		`json:"locationPostal"`
	DestinationPostal string	`json:"destinationPostal"`
	StartTime string			`json:"startTime"`
	EndTime string 				`json:"endTime"`
}

type completedTripNoID struct {
	ReferenceID string			`json:"refID"`
	LocationPostal string 		`json:"locationPostal"`
	DestinationPostal string	`json:"destinationPostal"`
	StartTime string			`json:"startTime"`
	EndTime string 				`json:"endTime"`
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

func tokenIsValid(token string) bool {
	_, ok := tokenMap[token]
	return ok
}

func printMap(mapObj map[string]string) {
	fmt.Println("=================================================\n[Current valid tokens]")
	for k, v := range mapObj {
		fmt.Println("Token:", k, "User:", v)
	}
	fmt.Println("=================================================")
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

func DB_createPassenger(acc passengerDetails) bool {
	acc.UID = generateUID()
	queryString := fmt.Sprintf("INSERT INTO Passengers (UID, FirstName, LastName, Phone, Email) VALUES ('%s', '%s', '%s', '%s', '%s');",
								acc.UID, acc.FirstName, acc.LastName, acc.Phone, acc.Email)
	_, err := db.Query(queryString) 

    if err != nil {
        fmt.Println(err.Error())
		return true
    }
	return false
}

func DB_editPassengerByUID(uid string, acc passengerDetails) bool {
	relevantFields := ""
	if acc.Email != "" { relevantFields += " Email='" + acc.Email + "'," }
	if acc.Phone != "" { relevantFields += " Phone='" + acc.Phone + "'," }
	if acc.FirstName != "" { relevantFields += " FirstName='" + acc.FirstName + "'," }
	if acc.LastName != "" { relevantFields += " LastName='" + acc.LastName + "'," }
	// remove trailing "," if present
	if last := len(relevantFields) - 1; last >= 0 && relevantFields[last] == ',' {
        relevantFields = relevantFields[:last]
    }
	queryString := fmt.Sprintf("UPDATE Passengers SET" + relevantFields + " WHERE UID='%s'", uid)

	_, err := db.Query(queryString)   
	if err != nil {
		fmt.Println(err.Error())
		return true
	}
	return false		
}

func DB_getDetailsByUID(uid string) passengerDetailsNoID {
	var p passengerDetailsNoID

	queryString := fmt.Sprintf("SELECT FirstName, LastName, Phone, Email FROM passengers WHERE UID='%s'", uid);
	results, err := db.Query(queryString) 

    if err != nil {
        panic(err.Error())
    }

    for results.Next() {
        err = results.Scan(&p.FirstName, &p.LastName, &p.Phone, &p.Email)
        if err != nil {
            panic(err.Error()) 
        }      
    }
	return p
}

func DB_saveHistory(hist []completedTrip) bool {
	fmt.Println("Retrieved history data, saving to database...")
	for _, ct := range hist {
		queryString := fmt.Sprintf("INSERT INTO History (DriverUID, PassengerUID, LocationPostal, DestinationPostal, StartTime, EndTime) VALUES ('%s', '%s', '%s', '%s', '%s', '%s');",
									ct.DriverUID, ct.PassengerUID, ct.LocationPostal, ct.DestinationPostal, ct.StartTime, ct.EndTime)
		_, err := db.Query(queryString)
		if err != nil {
			fmt.Println(err.Error())
			return true
		}
	}
	fmt.Println("History database table has been successfully updated")
	return false
}

func DB_retrieveHistory(uid string) []completedTripNoID {
	fmt.Println("Retrieving history information from database...")
	trips := make([]completedTripNoID, 0)
	queryString := fmt.Sprintf("SELECT id, LocationPostal, DestinationPostal, StartTime, EndTime FROM History WHERE PassengerUID='%s'", uid)
	results, err := db.Query(queryString)
	
	if err != nil {
		fmt.Println(err.Error())
	}

	for results.Next() {
		var trip completedTripNoID
        err = results.Scan(&trip.ReferenceID, &trip.LocationPostal, &trip.DestinationPostal, &trip.StartTime, &trip.EndTime)
        if err != nil {
            panic(err.Error()) 
        } else {
			trips = append(trips, trip)
		}
    }
	return trips
}

func login(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		fmt.Println("Received LOGIN POST request")
		if r.Header.Get("Content-type")=="application/json" {
			reqBody, err := ioutil.ReadAll(r.Body)
			if err == nil {
				// convert JSON to object
				var credentials loginCredentials
				json.Unmarshal(reqBody, &credentials) 
				fmt.Println("RECEIVED: ", credentials)
				
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

func logout(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		fmt.Println("Received LOGOUT POST request")
		if r.Header.Get("Content-type")=="application/json" {
			reqBody, err := ioutil.ReadAll(r.Body)
			if err == nil {
				// convert JSON to object
				var tokenObj tokenString
				json.Unmarshal(reqBody, &tokenObj)
				token := tokenObj.Token
				if tokenObj.Token == "" {
					w.WriteHeader(http.StatusBadRequest)
        			w.Write([]byte("400 - No token received"))
				} else {
					if tokenIsValid(token) {
						fmt.Println("Removing token: ", token)
						disableToken(token)
						printMap(tokenMap)
						w.WriteHeader(http.StatusOK)
					} else {
						w.WriteHeader(http.StatusBadRequest)
        				w.Write([]byte("400 - Invalid token"))
					}
					
				}
			} else {
                w.WriteHeader(http.StatusUnprocessableEntity)
                w.Write([]byte("422 - Logout token should be in JSON format"))
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

func verifyToken(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		fmt.Println("Received LOGOUT POST request")
		if r.Header.Get("Content-type")=="application/json" {
			reqBody, err := ioutil.ReadAll(r.Body)
			if err == nil {
				// convert JSON to object
				var tokenObj tokenString
				json.Unmarshal(reqBody, &tokenObj)
				token := tokenObj.Token
				if tokenObj.Token == "" {
					w.WriteHeader(http.StatusBadRequest)
        			w.Write([]byte("400 - No token received"))
				} else {
					if tokenIsValid(token) {
						w.WriteHeader(http.StatusOK)
					} else {
						w.WriteHeader(http.StatusBadRequest)
        				w.Write([]byte("400 - Invalid token"))
					}
				}
			} else {
                w.WriteHeader(http.StatusUnprocessableEntity)
                w.Write([]byte("422 - Token should be in JSON format"))
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

func account(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		// get account details
		fmt.Println("Received ACCOUNT GET request")
		token := getTokenFromHeader(r)
		existingUID := tokenMap[token]
		if existingUID == "" {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte("401 - Invalid token"))
		} else {
			accDetails := DB_getDetailsByUID(existingUID)
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(accDetails)
		}
	} else if r.Method == "POST" {
		// register account
		fmt.Println("Received ACCOUNT POST request")
		if r.Header.Get("Content-type")=="application/json" {
			reqBody, err := ioutil.ReadAll(r.Body)
			if err == nil {
				// convert JSON to object
				var acc passengerDetails
				json.Unmarshal(reqBody, &acc) 
				// validate registration details
				if (acc.Email == "" || acc.Phone == "" || acc.FirstName == "" || acc.LastName == "") {
					w.WriteHeader(http.StatusBadRequest)
                	w.Write([]byte("400 - Account details incomplete"))
				} else {
					// check if email is already registered
					if dbEntry := DB_getPassengerByEmail(acc.Email); dbEntry.Email == "" {
						// update database with new passenger entry
						if err := DB_createPassenger(acc); err {
							w.WriteHeader(http.StatusInternalServerError)
							w.Write([]byte("500 - Error creating passenger entry, please try again"))
						} else {
							// successfully created passenger entry
							w.WriteHeader(http.StatusOK)
						}
					} else {
						w.WriteHeader(http.StatusBadRequest)
						w.Write([]byte("400 - Account already registered"))
					}
				}
			} else {
                w.WriteHeader(http.StatusUnprocessableEntity)
                w.Write([]byte("422 - Account details should be in JSON format"))
            }
		} else {
			w.WriteHeader(http.StatusBadRequest)
        	w.Write([]byte("400 - Header content type not application/json"))
		}
	} else if r.Method == "PUT" {
		// edit account details
		fmt.Println("Received ACCOUNT PUT request")
		token := getTokenFromHeader(r)
		existingUID := tokenMap[token]
		if existingUID == "" {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte("401 - Invalid token"))
			return
		}
		if r.Header.Get("Content-type")=="application/json" {
			reqBody, err := ioutil.ReadAll(r.Body)
			if err == nil {
				// convert JSON to object
				var acc passengerDetails
				json.Unmarshal(reqBody, &acc) 
				// undo operation if all fields are empty
				if acc.Email == "" && acc.Phone == "" && acc.FirstName == "" && acc.LastName == "" {
					w.WriteHeader(http.StatusBadRequest)
					w.Write([]byte("400 - There are no valid fields provided"))
					return
				}
				// check if email is already taken
				if dbEntry := DB_getPassengerByEmail(acc.Email); dbEntry.Email == "" {
					// update database entry by UID
					if err := DB_editPassengerByUID(existingUID, acc); err {
						w.WriteHeader(http.StatusInternalServerError)
						w.Write([]byte("500 - Error updating account details, please try again"))
					} else {
						// successfully updated passenger details
						w.WriteHeader(http.StatusOK)
					}
				} else {
					w.WriteHeader(http.StatusBadRequest)
					w.Write([]byte("400 - This email has already been registered in another account"))
				}
			} else {
                w.WriteHeader(http.StatusUnprocessableEntity)
                w.Write([]byte("422 - Account details should be in JSON format"))
            }
		} else {
			w.WriteHeader(http.StatusBadRequest)
        	w.Write([]byte("400 - Header content type not application/json"))
		}
	} else if r.Method == "DELETE" {
		// deletion of account not allowed according to requirements
		fmt.Println("Received DELETE ACCOUNT request")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("400 - Deletion of account not allowed"))
	} else {
		w.WriteHeader(http.StatusMethodNotAllowed)
        w.Write([]byte("405 - Invalid API method"))
	}
}

func retrieveUID(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		token := getTokenFromHeader(r)
		existingUID := tokenMap[token]
		if existingUID == "" {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte("401 - Invalid token"))
		} else {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(existingUID)
		}
	} else {
		w.WriteHeader(http.StatusMethodNotAllowed)
        w.Write([]byte("405 - Invalid API method"))
	}
}

func history(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		// retrieve history
		token := getTokenFromHeader(r)
		existingUID := tokenMap[token]
		if existingUID == "" {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte("401 - Invalid token"))
			return
		}
		fmt.Println("Received HISTORY GET request")
		trips := DB_retrieveHistory(existingUID)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(trips)
	} else if r.Method == "POST" {
		// save history from ride matcher to database
		if r.Header.Get("Content-type") != "application/json" {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("400 - Header content type not application/json"))
			return
		}
		fmt.Println("Received HISTORY POST request")
		reqBody, err := ioutil.ReadAll(r.Body)
		if err != nil {
			w.WriteHeader(http.StatusUnprocessableEntity)
			w.Write([]byte(err.Error()))
			return
		}
		// convert JSON to object
		var ct []completedTrip
		json.Unmarshal(reqBody, &ct)
		if DB_saveHistory(ct) {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("500 - Error saving history to database, please try again"))
		}
		w.WriteHeader(http.StatusOK)
	} else {
		w.WriteHeader(http.StatusMethodNotAllowed)
        w.Write([]byte("405 - Invalid API method"))
		return
	}
}

func main() {
	// initialize variables
	tokenMap = make(map[string]string)
	onlineUsers = make(map[string]string)
	rand.Seed(time.Now().UnixNano())

	// setup API routers
	router := mux.NewRouter()
    router.HandleFunc("/api/v1/passenger/login", login).Methods("POST")
	router.HandleFunc("/api/v1/passenger/logout", logout).Methods("POST")
	router.HandleFunc("/api/v1/passenger/verify", verifyToken).Methods("POST")
	router.HandleFunc("/api/v1/passenger/account", account).Methods("GET","POST","PUT","DELETE")
	router.HandleFunc("/api/v1/passenger/uid", retrieveUID).Methods("GET")
	router.HandleFunc("/api/v1/passenger/history", history).Methods("GET","POST")

	// establish database connection
	var err error
	db, err = sql.Open("mysql", "user:password@tcp(127.0.0.1:3306)/passenger_db")
	if err != nil {
		panic(err.Error())
	} 
	defer db.Close()

	headersOk := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type"})
	originsOk := handlers.AllowedOrigins([]string{"http://localhost:3000", "http://localhost:5000"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"})
	fmt.Println("Serving passenger account API at port 5001")
    log.Fatal(http.ListenAndServe(":5001", handlers.CORS(originsOk, headersOk, methodsOk)(router)))
}