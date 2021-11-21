import { NavLink, Link, useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../../assets/ShrideLogo.svg";
import { apiRegister, apiLogin } from "../../endpoints/Accounts";
import Cookies from "universal-cookie/es6";
import "../main.css";

interface registerProps {
  setIsDriverLoggedIn: React.Dispatch<React.SetStateAction<Boolean>>;
}

const DriverRegister = (props: registerProps) => {
  const cookies = new Cookies();
  const navigate = useNavigate();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const accJSON = {
      email: event.target.email.value,
      phone: event.target.phone.value,
      firstName: event.target.firstName.value,
      lastName: event.target.lastName.value,
      id: event.target.id.value,
      licenseNumber: event.target.licenseNumber.value,
    };
    apiRegister("driver", accJSON)
      .then((res) => {
        apiLogin(accJSON.email, accJSON.phone, "driver").then((res) => {
          cookies.set("ptoken", res.data);
          cookies.remove("dtoken");
          props.setIsDriverLoggedIn(true);
        });
        navigate("/driver");
      })
      .catch((err) => {
        alert(err.response.data);
      });
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
        <NavLink to="/driver-login" className="sign-in-btn driver-btn">
          Sign In
        </NavLink>
      </header>
      <div>
        <div className="image-overlay driver-bg"></div>
        <div className="main">
          <div className="registration-box">
            <h1 className="registration-title">Account Registration</h1>
            <div className="login-tab-switch">
              <Link to="/passenger-register" className="login-tab">
                Passenger
              </Link>
              <Link to="/driver-register" className="login-tab active">
                Driver
              </Link>
            </div>

            <form className="registration-form" onSubmit={handleSubmit}>
              <div className="registration-form-row">
                <h5 className="label">Email</h5>
                <input
                  type="email"
                  name="email"
                  placeholder="example@domain.com"
                  required
                />
                <h5 className="label">Phone Number</h5>
                <input
                  type="text"
                  name="phone"
                  pattern="[0-9]{8}"
                  placeholder="91234567"
                  required
                />
              </div>
              <div className="registration-form-row">
                <h5 className="label">First Name</h5>
                <input
                  type="text"
                  name="firstName"
                  placeholder="John"
                  required
                />
                <h5 className="label">Last Name</h5>
                <input type="text" name="lastName" placeholder="Tan" required />
              </div>
              <div className="registration-form-row">
                <h5 className="label">ID</h5>
                <input type="text" name="id" placeholder="T0201234A" required />
                <h5 className="label">Car License</h5>
                <input
                  type="text"
                  name="licenseNumber"
                  placeholder="SGX1234R"
                  required
                />
              </div>
              <div className="registration-form-actions">
                <input type="submit" className="driver-btn" />
                <Link to="/driver-login" className="signup-text">
                  Login with existing account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default DriverRegister;
