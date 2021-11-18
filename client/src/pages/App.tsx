import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import PassengerPublic from "./Passenger/PassengerPublic";
import DriverPublic from "./Driver/DriverPublic";
import PassengerLogin from "./Passenger/PassengerLogin";
import DriverLogin from "./Driver/DriverLogin";

const App: React.FC = () => {
  const [isPassengerLoggedIn, setIsPassengerLoggedIn] =
    useState<Boolean>(false);

  useEffect(() => {
    alert(isPassengerLoggedIn);
  }, [isPassengerLoggedIn]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PassengerPublic />} />
        <Route path="/for-drivers" element={<DriverPublic />} />
        <Route
          path="/passenger-login"
          element={
            <PassengerLogin setIsPassengerLoggedIn={setIsPassengerLoggedIn} />
          }
        />
        <Route path="/driver-login" element={<DriverLogin />} />
      </Routes>
    </Router>
  );
};

export default App;
