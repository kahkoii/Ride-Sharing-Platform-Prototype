import { useState, useEffect } from "react";
import MainNavbar from "./DriverNavbar";
import { apiDriverStartSearch } from "../../endpoints/Matcher";
import Cookies from "universal-cookie/es6";
import "../main.css";

interface driverMainProps {
  setIsDriverLoggedIn: React.Dispatch<React.SetStateAction<Boolean>>;
}

const DriverMain = (props: driverMainProps) => {
  const cookies = new Cookies();
  const dt = cookies.get("dtoken");
  // statuses are "none", "searching", and "found"
  const [searchStatus, setSearchStatus] = useState<String>("none");

  useEffect(() => {
    if (searchStatus === "searching") {
      alert("You will now be searching for a passenger");
    }
  }, [searchStatus]);

  const establishWS = async () => {
    const ws = new WebSocket("ws://localhost:5003/api/v1/matcher/ws");
    ws.onopen = () => {
      try {
        ws.send("D" + dt);
      } catch (error) {
        alert(error);
      }
    };
    ws.onmessage = (event) => {
      const msg = event.data;
      if (msg === "1") {
        setSearchStatus("found");
        alert("A passenger has been found");
        ws.close();
      }
    };
  };

  const startSearch = (event: any) => {
    event.preventDefault();
    apiDriverStartSearch(dt)
      .then(() => {
        establishWS();
        setSearchStatus("searching");
      })
      .catch((err) => {
        alert(err.response.data);
      });
  };

  return (
    <>
      <MainNavbar setIsDriverLoggedIn={props.setIsDriverLoggedIn} />
      <div>
        <div className="image-overlay driver-bg"></div>
        <div className="main">
          <div className="driver-dashboard">
            <h2>Driver Dashboard</h2>
            {searchStatus === "none" && (
              <div className="driver-action-section">
                <p>
                  Ready to drive?
                  <br /> Start searching to be matched with a passenger soon!
                </p>
                <button
                  className="public-register-btn driver-btn"
                  onClick={startSearch}
                >
                  Search
                </button>
              </div>
            )}
            {searchStatus === "searching" && (
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
