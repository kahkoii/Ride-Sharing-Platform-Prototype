import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PassengerPublic from "./PassengerPublic";
import DriverPublic from "./DriverPublic";

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<PassengerPublic />} />
      <Route path="/for-drivers" element={<DriverPublic />} />
    </Routes>
  </Router>
);

export default App;
