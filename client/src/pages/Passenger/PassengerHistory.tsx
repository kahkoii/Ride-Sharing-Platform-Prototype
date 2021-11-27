import MainNavbar from "./PassengerNavbar";
import { useState, useEffect } from "react";
import { apiGetPassengerHistory } from "../../endpoints/Accounts";
import Cookies from "universal-cookie/es6";
import "../main.css";

interface passengerHistoryProps {
  setIsPassengerLoggedIn: React.Dispatch<React.SetStateAction<Boolean>>;
}

interface historyList {
  refID: string;
  locationPostal: string;
  destinationPostal: string;
  startTime: string;
  endTime: string;
}

const PassengerHistory = (props: passengerHistoryProps) => {
  const cookies = new Cookies();
  const pt = cookies.get("ptoken");
  const [history, setHistory] = useState<historyList[]>([]);

  useEffect(() => {
    apiGetPassengerHistory(pt)
      .then((res) => {
        const table: historyList[] = [];
        res.data.forEach((entry: any) => {
          const row: historyList = {
            refID: entry.refID,
            locationPostal: entry.locationPostal,
            destinationPostal: entry.destinationPostal,
            startTime: entry.startTime,
            endTime: entry.endTime,
          };
          table.push(row);
        });
        setHistory(table);
      })
      .catch((err) => {
        alert(err.response.data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <MainNavbar setIsPassengerLoggedIn={props.setIsPassengerLoggedIn} />
      <div>
        <div className="image-overlay passenger-bg"></div>
        <div className="main">
          <div className="registration-box">
            <h1 className="registration-title">Trip History</h1>
            {history.map((hist) => (
              <div style={{ border: "1px solid black" }}>
                <p>Reference Code: {hist.refID}</p>
                <p>Start Location: {hist.locationPostal}</p>
                <p>Destination: {hist.destinationPostal}</p>
                <p>Start Time: {hist.startTime}</p>
                <p>End Time: {hist.endTime}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PassengerHistory;
