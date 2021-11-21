import MainNavbar from "./PassengerNavbar";
import "../main.css";

interface passengerMainProps {
  setIsPassengerLoggedIn: React.Dispatch<React.SetStateAction<Boolean>>;
}

const PassengerMain = (props: passengerMainProps) => {
  const findTrip = (event: any) => {
    event.preventDefault();
    console.log("Current location: " + event.target.locationPostal.value);
    console.log("Want to go: " + event.target.destinationPostal.value);
  };

  return (
    <>
      <MainNavbar setIsPassengerLoggedIn={props.setIsPassengerLoggedIn} />
      <div>
        <div className="image-overlay passenger-bg"></div>
        <div className="main">
          <div className="request-trip-section">
            <div className="request-trip-inner">
              <h1>Request Trip</h1>
              <form className="login-form" onSubmit={findTrip}>
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
                  Find Trip
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PassengerMain;
