import MainNavbar from "./PassengerNavbar";
import { apiDelete } from "../../endpoints/Accounts";
import Cookies from "universal-cookie/es6";
import "../main.css";

interface passengerProfileProps {
  setIsPassengerLoggedIn: React.Dispatch<React.SetStateAction<Boolean>>;
}

const PassengerProfile = (props: passengerProfileProps) => {
  const cookies = new Cookies();
  const pt = cookies.get("ptoken");

  const editProfile = (event: any) => {
    // TODO
    event.preventDefault();
    // passengerFindTrip(
    //   pt,
    //   event.target.locationPostal.value,
    //   event.target.destinationPostal.value
    // )
    //   .then((res) => {
    //     setIsFindingTrip(true);
    //   })
    //   .catch((err) => {
    //     alert(err.response.data);
    //   });
    // setIsFindingTrip(true);
  };

  const deleteProfile = (event: any) => {
    event.preventDefault();
    apiDelete(pt, "passenger")
      .then(() => {
        alert("Account deletion successful");
        cookies.remove("pt");
      })
      .catch(() => {
        alert("Account cannot be deleted");
      });
  };

  return (
    // TODO
    <>
      <MainNavbar setIsPassengerLoggedIn={props.setIsPassengerLoggedIn} />
      <div>
        <div className="image-overlay passenger-bg"></div>
        <div className="main">
          <div className="request-trip-section">
            <div className="request-trip-inner">
              <h1>Edit Profile</h1>
              <form className="login-form" onSubmit={editProfile}>
                <button
                  className="request-btn public-register-btn passenger-btn"
                  onClick={deleteProfile}
                >
                  Delete
                </button>
                <h5 className="label">Location Postal Code</h5>
                <input
                  type="text"
                  name="locationPostal"
                  pattern="[0-9]{6}"
                  placeholder="599489"
                  required
                />
                <h5 className="label">Destination Postal Code</h5>
                <input
                  type="text"
                  name="destinationPostal"
                  pattern="[0-9]{6}"
                  placeholder="599489"
                  required
                />
                <button
                  type="submit"
                  className="request-btn public-register-btn passenger-btn"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PassengerProfile;
