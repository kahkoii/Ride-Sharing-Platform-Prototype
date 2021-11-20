import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import PassengerPublic from "./Passenger/PassengerPublic";
import DriverPublic from "./Driver/DriverPublic";
import PassengerLogin from "./Passenger/PassengerLogin";
import PassengerHome from "./Passenger/PassengerHome";
import DriverLogin from "./Driver/DriverLogin";
import MissingPage from "./MissingPage";

const App: React.FC = () => {
  const [isPassengerLoggedIn, setIsPassengerLoggedIn] =
    useState<Boolean>(false);
  const [isDriverLoggedIn, setIsDriverLoggedIn] = useState<Boolean>(false);

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
