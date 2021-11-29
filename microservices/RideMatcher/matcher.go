package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

type tripDetails struct {
	TripID string
	PassengerUID string
	LocationPostal string
	DestinationPostal string
	StartTime string
}

type completedTrip struct {
	DriverUID string 			`json:"driverUID"`
	PassengerUID string 		`json:"passengerUID"`
	LocationPostal string 		`json:"locationPostal"`
	DestinationPostal string	`json:"destinationPostal"`
	StartTime string			`json:"startTime"`
	EndTime string 				`json:"endTime"`
}

var passenger_api 	string
var driver_api 		string
var activeTrips 	map[string]tripDetails
// Map tripID to driver UID
var tripMap			map[string]string
// FIFO Queue Implementation
var passengerQueue 	[]tripDetails
var driverQueue 	[]string
var historyQueue 	[]completedTrip
// Map account UID to channel
var wsConnections map[string]chan string
var upgrader = websocket.Upgrader{
	ReadBufferSize: 1024,
	WriteBufferSize: 1024,
}

func getValueFromHeader(r *http.Request, valueName string) string {
    v := r.URL.Query()
    if token, ok := v[valueName]; ok {
        return token[0]
    }
	return ""
}

func getUIDByToken(token string, accType string) string {
	// send tokens to respective APIs to get ID back
	url := "/retrieve-uid" + "?token=" + token
	if accType == "passenger" {
    	url = passenger_api + url
	} else if accType == "driver" {
		url = driver_api + url
	}

	res, _ := http.Get(url)
	if res.StatusCode == 200 {
		data, _ := ioutil.ReadAll(res.Body)
		// strip off surrounding " and trailing \n
		uid := string(data)
		uid = uid[1:len(uid) - 2]
		return uid
	}
	fmt.Println("Received invalid token:", token)
	return ""
}

func channelSend(uid string, msg string) {
	c := wsConnections[uid]
	c <- msg
}

func attemptMatch() {
	// check if there are people ready to ride/drive
	fmt.Println("Attempting to match passengers with drivers")
	if len(passengerQueue) > 0 && len(driverQueue) > 0 {
		var trip tripDetails
		trip.PassengerUID = passengerQueue[0].PassengerUID
		trip.LocationPostal = passengerQueue[0].LocationPostal
		trip.DestinationPostal = passengerQueue[0].DestinationPostal
		trip.StartTime = time.Now().Format("2006-01-02 15:04:05")
		activeTrips[driverQueue[0]] = trip
		// notify passenger and driver through WS channel
		go channelSend(passengerQueue[0].PassengerUID, "1")
		go channelSend(driverQueue[0], "1")
		// remove earliest entry from queue
		passengerQueue = passengerQueue[1:]
		driverQueue = driverQueue[1:]
		fmt.Println("A passenger was matched with a driver")
		return
	}
	fmt.Println("No matches were made")
}

func sendPassengerTripHistory() {
	printHistory()
	fmt.Println("Attempting to send history to Passenger API")
	if len(historyQueue) > 0 {
		// attempt send to passenger API endpoint
		jsonValue, _ := json.Marshal(historyQueue)
		url := passenger_api + "/save-history"
		res, _ := http.Post(url, "application/json", bytes.NewBuffer(jsonValue))
		if res.StatusCode == 200 {
			// if request is successful, delete stored history
			fmt.Println("History successfully sent")
			historyQueue = nil
			return
		}
	}
	fmt.Println("History send failed")
}

func printHistory() {
	fmt.Println("=================================================\n[Current completed trip history]")
	for i, trip := range historyQueue {
		fmt.Println("[", i, "] Driver: ", trip.DriverUID, " Passenger: ",
		 trip.PassengerUID, " Start: ", trip.StartTime, " End: ", trip.EndTime)
	}
	fmt.Println("=================================================")
}

func checkPassengerQueueForDuplicates(slice []tripDetails, uid string) bool {
	for _, item := range slice {
        if item.PassengerUID == uid {
            return true
        }
    }
	return false
}

func checkDriverQueueForDuplicates(slice []string, uid string) bool {
	for _, item := range slice {
        if item == uid {
            return true
        }
    }
	return false
}

func enqueuePassenger(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		fmt.Println("Received ENQUEUE PASSENGER POST request")
		token := getValueFromHeader(r, "token")
		if token == "" {
			w.WriteHeader(http.StatusBadRequest)
        	w.Write([]byte("400 - Invalid passenger token"))
			return
		}
		uid := getUIDByToken(token, "passenger")
		if uid != "" {
			if !checkPassengerQueueForDuplicates(passengerQueue, uid) {
				if r.Header.Get("Content-type") == "application/json" {
					reqBody, err := ioutil.ReadAll(r.Body)
					if err == nil {
						var newTrip tripDetails
						json.Unmarshal(reqBody, &newTrip)
						if (newTrip.LocationPostal == "" || newTrip.DestinationPostal == ""){
							w.WriteHeader(http.StatusBadRequest)
							w.Write([]byte("400 - Location and destination postal codes are required"))
							return
						}
						newTrip.PassengerUID = uid
						fmt.Println("Added passenger ", uid, " to queue")
						passengerQueue = append(passengerQueue, newTrip)
						// create a new ws channel
						c := make(chan string)
						wsConnections[uid] = c
						attemptMatch()
						w.WriteHeader(http.StatusOK)
					} else {
						w.WriteHeader(http.StatusBadRequest)
						w.Write([]byte(err.Error()))
					}
				} else {
					w.WriteHeader(http.StatusBadRequest)
					w.Write([]byte("400 - Header content type not application/json"))
				}
			} else {
				w.WriteHeader(http.StatusBadRequest)
        		w.Write([]byte("400 - Passenger is already in queue"))
			}
		} else {
			w.WriteHeader(http.StatusBadRequest)
        	w.Write([]byte("400 - Invalid passenger UID"))
		}
	} else {
		w.WriteHeader(http.StatusMethodNotAllowed)
        w.Write([]byte("405 - Invalid API method"))
	}
}

func enqueueDriver(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		fmt.Println("Received ENQUEUE DRIVER POST request")
		token := getValueFromHeader(r, "token")
		if token == "" {
			w.WriteHeader(http.StatusBadRequest)
        	w.Write([]byte("400 - Invalid driver token"))
			return
		}
		uid := getUIDByToken(token, "driver")
		if uid != "" {
			if checkDriverQueueForDuplicates(driverQueue, uid) {
				w.WriteHeader(http.StatusBadRequest)
        		w.Write([]byte("400 - Driver is already in queue"))
				return
			}
			driverQueue = append(driverQueue, uid)
			fmt.Println("Added driver ", uid, " to queue")
			// create a new ws channel
			c := make(chan string)
			wsConnections[uid] = c
			attemptMatch()
			w.WriteHeader(http.StatusOK)
		} else {
			w.WriteHeader(http.StatusBadRequest)
        	w.Write([]byte("400 - Invalid driver UID"))
		}
	} else {
		w.WriteHeader(http.StatusMethodNotAllowed)
        w.Write([]byte("405 - Invalid API method"))
	}
}

func endTrip(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		fmt.Println("Received END TRIP POST request")
		token := getValueFromHeader(r, "token")
		if token == "" {
			w.WriteHeader(http.StatusBadRequest)
        	w.Write([]byte("400 - Invalid driver token"))
			return
		}
		uid := getUIDByToken(token, "driver")
		if uid != "" {
			// remove trip by driver UID from activeTrips
			// and add new entry to historyQueue
			var c completedTrip
			trip := activeTrips[uid]
			c.DriverUID = uid
			c.PassengerUID = trip.PassengerUID
			c.LocationPostal = trip.LocationPostal
			c.DestinationPostal = trip.DestinationPostal
			c.StartTime = trip.StartTime
			c.EndTime = time.Now().Format("2006-01-02 15:04:05")
			historyQueue = append(historyQueue, c)
			delete(activeTrips, uid)
			// notify passenger of trip end through WS
			wsConnections[trip.PassengerUID] <- "2"
			// attempt to send history to passenger API
			sendPassengerTripHistory()
			w.WriteHeader(http.StatusOK)
		} else {
			w.WriteHeader(http.StatusBadRequest)
        	w.Write([]byte("400 - Invalid driver UID"))
		}
	} else {
		w.WriteHeader(http.StatusMethodNotAllowed)
        w.Write([]byte("405 - Invalid API method"))
	}
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Received WS connection request")
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
	}
	go wsReadWrite(ws)
}

func wsReadWrite(conn *websocket.Conn) {
	log.Println("Client successfully connected to WebSocket")
	for {
		// Read incoming message
		messageType, msg, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		log.Println("Awaiting message from channel")
		token := string(msg)
		var accType string
		if token[0:1] == "P" {
			accType = "passenger"
		} else {
			accType = "driver"
		}
		uid := getUIDByToken(token[1:], accType)
		channel := wsConnections[uid]
		reply := <- channel
		// Send message
		if err := conn.WriteMessage(messageType, []byte(reply)); err != nil {
			log.Println(err)
			return
		}
		// Write end trip message for passenger
		if (accType == "passenger") {
			reply = <- channel
			if err := conn.WriteMessage(messageType, []byte(reply)); err != nil {
				log.Println(err)
				return
			}
		}
		// Close and remove channel
		close(channel)
		delete(wsConnections, uid)
		defer conn.Close()
	}
}

func main() {
	// initialize variables
	passenger_api = "http://localhost:5001/api/v1/passenger"
	driver_api = "http://localhost:5002/api/v1/driver/"
	activeTrips = make(map[string]tripDetails)
	tripMap = make(map[string]string)
	passengerQueue = make([]tripDetails, 0)
	driverQueue = make([]string, 0)
	historyQueue = make([]completedTrip, 0)
	wsConnections = make(map[string]chan string)

	// setup API routers
	router := mux.NewRouter()
    router.HandleFunc("/api/v1/matcher/queue-passenger", enqueuePassenger).Methods("POST")
	router.HandleFunc("/api/v1/matcher/queue-driver", enqueueDriver).Methods("POST")
	router.HandleFunc("/api/v1/matcher/end-trip", endTrip).Methods("POST")
	router.HandleFunc("/api/v1/matcher/ws", wsHandler)

	headersOk := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type"})
	originsOk := handlers.AllowedOrigins([]string{"http://localhost:3000", "http://localhost:5000"})
	methodsOk := handlers.AllowedMethods([]string{"POST"})

	fmt.Println("Serving matcher API at port 5003")
    log.Fatal(http.ListenAndServe(":5003", handlers.CORS(originsOk, headersOk, methodsOk)(router)))
}