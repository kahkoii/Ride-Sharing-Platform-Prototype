import { Link, useNavigate } from "react-router-dom";
import MainNavbar from "./MainNavbar";
import "../main.css";

interface passengerMainProps {
  setIsPassengerLoggedIn: React.Dispatch<React.SetStateAction<Boolean>>;
}

const PassengerMain = (props: passengerMainProps) => {
  return (
    <>
      <MainNavbar setIsPassengerLoggedIn={props.setIsPassengerLoggedIn} />
      <div>
        <div className="image-overlay passenger-bg"></div>
        <div className="main">
          <p>hello im passenger</p>
        </div>
      </div>
    </>
  );
};

export default PassengerMain;
