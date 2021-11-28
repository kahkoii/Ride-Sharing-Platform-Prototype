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
          <h1 className="registration-title">Trip History</h1>
          {history.length !== 0 && (
            <table className="history-box">
              <tr>
                <th>Ref Code</th>
                <th>Start Location</th>
                <th>Destination</th>
                <th>Start Time</th>
                <th>End Time</th>
              </tr>
              {history.map((hist) => (
                <tr className="history-row">
                  <td>{hist.refID}</td>
                  <td>{hist.locationPostal}</td>
                  <td>{hist.destinationPostal}</td>
                  <td>{hist.startTime}</td>
                  <td>{hist.endTime}</td>
                </tr>
              ))}
            </table>
          )}
          {history.length === 0 && (
            <p className="no-history-msg">No rides have been made yet</p>
          )}
        </div>
      </div>
    </>
  );
};

export default PassengerHistory;
