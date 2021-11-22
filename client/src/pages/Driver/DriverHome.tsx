import { useState } from "react";
import MainNavbar from "./DriverNavbar";
import "../main.css";

interface driverMainProps {
  setIsDriverLoggedIn: React.Dispatch<React.SetStateAction<Boolean>>;
}

const DriverMain = (props: driverMainProps) => {
  const [isSearching, setIsSearching] = useState<Boolean>(false);

  const startTrip = (event: any) => {
    event.preventDefault();
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 1000);
    console.log("STARTING TRIP");
  };

  return (
    <>
      <MainNavbar setIsDriverLoggedIn={props.setIsDriverLoggedIn} />
      <div>
        <div className="image-overlay driver-bg"></div>
        <div className="main">
          <div className="driver-dashboard">
            <h2>Driver Dashboard</h2>
            {!isSearching ? (
              <div className="driver-action-section">
                <p>
                  Ready to drive?
                  <br /> Start searching to be matched with a passenger soon!
                </p>
                <button
                  className="public-register-btn driver-btn"
                  onClick={startTrip}
                >
                  Search
                </button>
              </div>
            ) : (
              <div className="driver-loading-section">
                <p>Waiting for passengers</p>
                <div className="loader" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DriverMain;
