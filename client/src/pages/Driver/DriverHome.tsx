import { useState } from "react";
import MainNavbar from "./DriverNavbar";
import { apiDriverStartSearch } from "../../endpoints/Matcher";
import Cookies from "universal-cookie/es6";
import "../main.css";

interface driverMainProps {
  setIsDriverLoggedIn: React.Dispatch<React.SetStateAction<Boolean>>;
}

const DriverMain = (props: driverMainProps) => {
  const cookies = new Cookies();
  const [isSearching, setIsSearching] = useState<Boolean>(false);

  const startSearch = (event: any) => {
    event.preventDefault();
    const dt = cookies.get("dtoken");
    apiDriverStartSearch(dt)
      .then(() => {
        setIsSearching(true);
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
            {!isSearching ? (
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
