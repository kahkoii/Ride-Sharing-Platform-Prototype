import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { apiVerifyToken } from "../endpoints/Accounts";
import Cookies from "universal-cookie/es6";
import DriverPublic from "./Driver/DriverPublic";
import DriverLogin from "./Driver/DriverLogin";
import DriverRegister from "./Driver/DriverRegister";
import PassengerPublic from "./Passenger/PassengerPublic";
import PassengerRegister from "./Passenger/PassengerRegister";
import PassengerLogin from "./Passenger/PassengerLogin";
import PassengerHome from "./Passenger/PassengerHome";
import MissingPage from "./MissingPage";

const App: React.FC = () => {
  const [isPassengerLoggedIn, setIsPassengerLoggedIn] =
    useState<Boolean>(false);
  const [isDriverLoggedIn, setIsDriverLoggedIn] = useState<Boolean>(false);
  const cookies = new Cookies();
  // login user if token still valid
  useEffect(() => {
    var x = cookies.get("ptoken");
    if (x !== undefined) {
      apiVerifyToken(x, "passenger").then((res) => {
        if (res.status === 200) {
          setIsPassengerLoggedIn(true);
        }
      });
    } else {
      x = cookies.get("dtoken");
      if (x !== undefined) {
        apiVerifyToken(x, "driver").then((res) => {
          if (res.status === 200) {
            setIsDriverLoggedIn(true);
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isPassengerLoggedIn) {
      setIsDriverLoggedIn(false);
      <Navigate to="/passenger" />;
    }
  }, [isPassengerLoggedIn]);

  useEffect(() => {
    if (isDriverLoggedIn) {
      setIsPassengerLoggedIn(false);
      <Navigate to="/driver" />;
    }
  }, [isDriverLoggedIn]);

  return (
    <Router>
      {isPassengerLoggedIn && (
        <Routes>
          <Route
            path="/passenger"
            element={
              <PassengerHome setIsPassengerLoggedIn={setIsPassengerLoggedIn} />
            }
          />
          <Route path="*" element={<MissingPage rootPath="/passenger" />} />
        </Routes>
      )}
      {isDriverLoggedIn && (
        <Routes>
          <Route path="/driver" element={<div>hi im driver</div>} />
          <Route path="*" element={<MissingPage rootPath="/driver" />} />
        </Routes>
      )}
      {!isPassengerLoggedIn && !isDriverLoggedIn && (
        <Routes>
          <Route path="/" element={<PassengerPublic />} />
          <Route path="for-drivers" element={<DriverPublic />} />
          <Route path="driver-login" element={<DriverLogin />} />
          <Route
            path="driver-register"
            element={
              <DriverRegister setIsDriverLoggedIn={setIsDriverLoggedIn} />
            }
          />
          <Route
            path="passenger-register"
            element={
              <PassengerRegister
                setIsPassengerLoggedIn={setIsPassengerLoggedIn}
              />
            }
          />
          <Route
            path="passenger-login"
            element={
              <PassengerLogin setIsPassengerLoggedIn={setIsPassengerLoggedIn} />
            }
          />
          <Route path="*" element={<MissingPage rootPath="/" />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
