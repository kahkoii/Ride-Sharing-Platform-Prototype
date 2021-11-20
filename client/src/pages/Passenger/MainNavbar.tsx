import { useNavigate, NavLink } from "react-router-dom";
import Cookies from "universal-cookie/es6";
import { postLogout } from "../../endpoints/Passenger";
import { ReactComponent as Logo } from "../../assets/ShrideLogo.svg";
import "../main.css";

interface MainNavbarProps {
  setIsPassengerLoggedIn: React.Dispatch<React.SetStateAction<Boolean>>;
}

const MainNavbar = (props: MainNavbarProps) => {
  const cookies = new Cookies();
  const navigate = useNavigate();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    postLogout(cookies.get("token"))
      .then((res) => {
        cookies.remove("token");
        props.setIsPassengerLoggedIn(false);
        navigate("/");
      })
      .catch((err) => {
        alert(err.response.data);
      });
  };

  return (
    <header className="navbar">
      <NavLink to="/passenger">
        <Logo className="nav-logo" />
      </NavLink>
      <div className="nav-links">
        <NavLink className="nav-link" to="/passenger">
          Find Ride
        </NavLink>
        <NavLink className="nav-link" to="/passenger/history">
          History
        </NavLink>
      </div>
      <button className="sign-in-btn passenger-btn" onClick={handleSubmit}>
        Sign Out
      </button>
    </header>
  );
};

export default MainNavbar;
