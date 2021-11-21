import { useNavigate, NavLink } from "react-router-dom";
import Cookies from "universal-cookie/es6";
import { apiLogout } from "../../endpoints/Accounts";
import { ReactComponent as Logo } from "../../assets/ShrideLogo.svg";
import "../main.css";

interface MainNavbarProps {
  setIsDriverLoggedIn: React.Dispatch<React.SetStateAction<Boolean>>;
}

const MainNavbar = (props: MainNavbarProps) => {
  const cookies = new Cookies();
  const navigate = useNavigate();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    apiLogout(cookies.get("dtoken"), "driver").catch((err) => {
      alert(err.response.data);
    });
    props.setIsDriverLoggedIn(false);
    cookies.remove("dtoken");
    navigate("/");
  };

  return (
    <header className="navbar">
      <NavLink to="/driver">
        <Logo className="nav-logo" />
      </NavLink>
      <div className="nav-links">
        <NavLink className="nav-link" to="/driver">
          Dashboard
        </NavLink>
      </div>
      <button className="sign-in-btn driver-btn" onClick={handleSubmit}>
        Sign Out
      </button>
    </header>
  );
};

export default MainNavbar;
