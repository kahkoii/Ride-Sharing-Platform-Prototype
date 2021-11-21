import { NavLink, useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../../assets/ShrideLogo.svg";
import "../main.css";

const DriverPublic = () => {
  const navigate = useNavigate();
  const goRegister = () => {
    navigate("/driver-register");
  };

  return (
    <>
      {/* Navbar */}
      <header className="navbar">
        <NavLink to="/">
          <Logo className="nav-logo" />
        </NavLink>
        <div className="nav-links">
          <NavLink className="nav-link" to="/">
            For Passengers
          </NavLink>
          <NavLink className="nav-link" to="/for-drivers">
            For Drivers
          </NavLink>
        </div>
        <NavLink to="/driver-login" className="sign-in-btn driver-btn">
          Sign In
        </NavLink>
      </header>
      <div>
        <div id="driver-public" className="image-overlay"></div>
        <div className="main">
          <h1 className="home-title">
            Earn by <br />
            your own terms
          </h1>
          <h2 className="home-subtitle">Become a driver today.</h2>
          <button
            className="public-register-btn driver-btn"
            onClick={goRegister}
          >
            Register
          </button>
        </div>
      </div>
    </>
  );
};

export default DriverPublic;
