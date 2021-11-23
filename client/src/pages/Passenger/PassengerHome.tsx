import { useState, useEffect } from "react";
import MainNavbar from "./PassengerNavbar";
import { passengerFindTrip } from "../../endpoints/Matcher";
import Cookies from "universal-cookie/es6";
import "../main.css";

interface passengerMainProps {
  setIsPassengerLoggedIn: React.Dispatch<React.SetStateAction<Boolean>>;
}

const PassengerMain = (props: passengerMainProps) => {
  const cookies = new Cookies();
  const [isFindingTrip, setIsFindingTrip] = useState<Boolean>(false);

  useEffect(() => {
    if (isFindingTrip) {
      alert("Your request for a driver has been submitted successfully!");
    }
  }, [isFindingTrip]);

  const findTrip = (event: any) => {
    event.preventDefault();
    const pt = cookies.get("ptoken");
    passengerFindTrip(
      pt,
      event.target.locationPostal.value,
      event.target.destinationPostal.value
    )
      .then((res) => {
        setIsFindingTrip(true);
      })
      .catch((err) => {
        alert(err.response.data);
      });
    setIsFindingTrip(true);
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
