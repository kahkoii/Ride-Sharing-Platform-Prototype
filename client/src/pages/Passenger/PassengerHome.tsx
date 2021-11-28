import { useState, useEffect } from "react";
import MainNavbar from "./PassengerNavbar";
import { apiPassengerFindTrip } from "../../endpoints/Matcher";
import Cookies from "universal-cookie/es6";
import "../main.css";

interface passengerMainProps {
  setIsPassengerLoggedIn: React.Dispatch<React.SetStateAction<Boolean>>;
}

const PassengerMain = (props: passengerMainProps) => {
  const cookies = new Cookies();
  const pt = cookies.get("ptoken");
  // statuses consists of "none", "finding" and "found"
  const [tripStatus, setTripStatus] = useState<String>("none");

  useEffect(() => {
    if (tripStatus === "finding") {
      alert("Your request for a driver has been submitted successfully!");
    }
  }, [tripStatus]);

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
        setTripStatus("found");
        alert("A driver has been found");
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
          </div>
        </div>
      </div>
    </>
  );
};

export default PassengerMain;
