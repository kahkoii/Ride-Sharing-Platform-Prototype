import { NavLink, Link } from "react-router-dom";
import { ReactComponent as Logo } from "../../assets/ShrideLogo.svg";
import "../main.css";

const PassengerLogin = () => (
  <>
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
      <button className="sign-in-btn passenger-btn">Sign In</button>
    </header>
    <body>
      <div id="passenger-login" className="image-overlay"></div>
      <div className="main">
        <div className="login-box">
          <div className="login-tab-switch">
            <Link to="/passenger-login" className="login-tab active">
              Passenger
            </Link>
            <Link to="/driver-login" className="login-tab">
              Driver
            </Link>
          </div>

          <form className="login-form">
            <h5 className="label">Email</h5>
            <input
              type="email"
              id="userEmail"
              placeholder="example@domain.com"
              required
            />
            <h5 className="label">Phone Number</h5>
            <input
              type="text"
              id="phoneNumber"
              pattern="[0-9]{8}"
              placeholder="91234567"
              required
            />

            <div className="login-form-actions">
              <input type="submit" value="Submit" className="passenger-btn" />
              <Link to="/passenger-signup" className="signup-text">
                No account? Sign up here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </body>
  </>
);

export default PassengerLogin;
