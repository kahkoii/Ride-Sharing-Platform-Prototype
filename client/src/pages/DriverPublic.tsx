import { NavLink } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/ShrideLogo.svg";
import "./main.css";

const testfunc = () => {
  alert("hello");
};

const DriverPublic = () => (
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
      <button onClick={testfunc}>Sign In</button>
    </header>
    <body>
      <div id="driver-public" className="image-overlay"></div>
      <div className="hero-section">
        <h1 className="home-title">
          Earn by <br />
          your own terms
        </h1>
        <h2 className="home-subtitle">Become a driver today.</h2>
        <button
          className="public-register-btn"
          id="driver-register-btn"
          onClick={testfunc}
        >
          Register
        </button>
      </div>
    </body>
  </>
);

export default DriverPublic;
