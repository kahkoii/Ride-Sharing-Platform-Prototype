import MainNavbar from "./DriverNavbar";
import "../main.css";

interface driverMainProps {
  setIsDriverLoggedIn: React.Dispatch<React.SetStateAction<Boolean>>;
}

const DriverMain = (props: driverMainProps) => {
  const startTrip = (event: any) => {
    event.preventDefault();
    console.log("STARTING TRIP");
  };

  return (
    <>
      <MainNavbar setIsDriverLoggedIn={props.setIsDriverLoggedIn} />
      <div>
        <div className="image-overlay driver-bg"></div>
        <div className="main">
          <p>DRIVER HOME PAGE</p>
          <button onClick={startTrip}>Start Trip</button>
        </div>
      </div>
    </>
  );
};

export default DriverMain;
