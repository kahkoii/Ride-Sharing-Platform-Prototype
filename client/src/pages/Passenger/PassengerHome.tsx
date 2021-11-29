import { useState } from "react";
import MainNavbar from "./PassengerNavbar";
import { apiPassengerFindTrip } from "../../endpoints/Matcher";
import Cookies from "universal-cookie/es6";
import map from "../../assets/map.png";
import car_gif from "../../assets/moving_car.gif";
import "../main.css";

interface passengerMainProps {
  setIsPassengerLoggedIn: React.Dispatch<React.SetStateAction<Boolean>>;
}

const PassengerMain = (props: passengerMainProps) => {
  const cookies = new Cookies();
  const pt = cookies.get("ptoken");
  // statuses consists of "none", "finding" and "found"
  const [tripStatus, setTripStatus] = useState<String>("none");

  const establishWS = async () => {
    const ws = new WebSocket("ws://localhost:5003/api/v1/matcher/ws");
    ws.onopen = () => {
      try {
        ws.send("P" + pt);
      } catch (error) {
        alert(error);
      }
    };
    ws.onmessage = (event) => {
      const msg = event.data;
      if (msg === "1") {
        alert("A driver has been found!");
        setTripStatus("found");
      } else if (msg === "2") {
        setTripStatus("none");
        alert("You have arrived at your destination!");
        ws.close();
      }
    };
  };

  const findTrip = (event: any) => {
    event.preventDefault();
    apiPassengerFindTrip(
      pt,
      event.target.locationPostal.value,
      event.target.destinationPostal.value
    )
      .then(() => {
        establishWS();
        setTripStatus("finding");
        alert("Your request for a driver has been submitted successfully!");
      })
      .catch((err) => {
        alert(err.response.data);
      });
  };

  return (
    <>
      <MainNavbar setIsPassengerLoggedIn={props.setIsPassengerLoggedIn} />
      <div>
        <div className="image-overlay passenger-bg"></div>
        <div className="main">
          {tripStatus === "none" && (
            <div className="request-trip-section">
              <div className="request-trip-inner">
                <h1>Request Trip</h1>
                <form className="login-form" onSubmit={findTrip}>
                  <h5 className="label">Location Postal Code</h5>
                  <input
                    type="text"
                    name="locationPostal"
                    pattern="[0-9]{6}"
                    placeholder="599489"
                    required
                  />
                  <h5 className="label">Destination Postal Code</h5>
                  <input
                    type="text"
                    name="destinationPostal"
                    pattern="[0-9]{6}"
                    placeholder="599489"
                    required
                  />
                  <button
                    type="submit"
                    className="request-btn public-register-btn passenger-btn"
                  >
                    Find Trip
                  </button>
                </form>
              </div>
              <img src={map} alt="sample map api" className="passenger-map" />
            </div>
          )}
          {tripStatus === "finding" && (
            <div className="passenger-trip-box">
              <div className="passenger-loading-section">
                <p>Finding a driver...</p>
                <div className="loader" />
              </div>
            </div>
          )}
          {tripStatus === "found" && (
            <div className="passenger-trip-box">
              <div className="passenger-loading-section">
                <p>Ride in progress</p>
                <img src={car_gif} alt="" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PassengerMain;
