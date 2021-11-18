import { NavLink, Link } from "react-router-dom";
import { ReactComponent as Logo } from "../../assets/ShrideLogo.svg";
import { postLogin } from "../../endpoints/Passenger";
import Cookies from "universal-cookie/es6";
import "../main.css";

interface loginProps {
  setIsPassengerLoggedIn: React.Dispatch<React.SetStateAction<Boolean>>;
}

const PassengerLogin = (props: loginProps) => {
  const cookies = new Cookies();
  const handleSubmit = (event: any) => {
    postLogin(event.target.email.value, event.target.phone.value)
      .then((res) => {
        cookies.set("token", res.data);
        props.setIsPassengerLoggedIn(true);
      })
      .catch((err) => {
        console.log("Login error: ", err);
      });
    event.preventDefault();
  };

  return (
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
      <div>
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

            <form className="login-form" onSubmit={handleSubmit}>
              <h5 className="label">Email</h5>
              <input
                type="email"
                name="email"
                id="userEmail"
                placeholder="example@domain.com"
                required
              />
              <h5 className="label">Phone Number</h5>
              <input
                type="text"
                name="phone"
                id="phoneNumber"
                pattern="[0-9]{8}"
                placeholder="91234567"
                required
              />
              <div className="login-form-actions">
                <input type="submit" className="passenger-btn" />
                <Link to="/passenger-signup" className="signup-text">
                  No account? Sign up here
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PassengerLogin;
