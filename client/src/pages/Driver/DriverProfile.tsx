import MainNavbar from "./DriverNavbar";
import { useState, useEffect } from "react";
import { apiGetDetails, apiDelete } from "../../endpoints/Accounts";
import Cookies from "universal-cookie/es6";
import "../main.css";

interface driverProfileProps {
  setIsDriverLoggedIn: React.Dispatch<React.SetStateAction<Boolean>>;
}

interface driverAccount {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  id: string;
  licenseNo: string;
}

const DriverProfile = (props: driverProfileProps) => {
  const cookies = new Cookies();
  const dt = cookies.get("dtoken");
  const [account, setAccount] = useState<driverAccount>({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    id: "",
    licenseNo: "",
  });

  useEffect(() => {
    apiGetDetails("driver", dt).then((res) => {
      alert("hi");
      console.log(res);
      const acc: driverAccount = {
        email: res.data.email,
        phone: res.data.phone,
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        id: res.data.id,
        licenseNo: res.data.licenseNo,
      };
      setAccount(acc);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editProfile = (event: any) => {
    // TODO
    event.preventDefault();
    alert("Saving changes");
  };

  const deleteProfile = (event: any) => {
    event.preventDefault();
    apiDelete("driver", dt)
      .then(() => {
        alert("Account deletion successful");
        cookies.remove("dt");
      })
      .catch((err) => {
        alert(err.response.data);
      });
  };

  return (
    // TODO
    <>
      <MainNavbar setIsDriverLoggedIn={props.setIsDriverLoggedIn} />
      <div>
        <div className="image-overlay driver-bg"></div>
        <div className="main">
          <div className="registration-box">
            <h1 className="registration-title">Edit Profile</h1>
            <form className="registration-form" onSubmit={editProfile}>
              <div className="registration-form-row">
                <h5 className="label">Email</h5>
                <input type="email" name="email" placeholder={account.email} />
                <h5 className="label">Phone Number</h5>
                <input
                  type="text"
                  name="phone"
                  pattern="[0-9]{8}"
                  placeholder={account.phone}
                />
              </div>
              <div className="registration-form-row">
                <h5 className="label">First Name</h5>
                <input
                  type="text"
                  name="firstName"
                  placeholder={account.firstName}
                />
                <h5 className="label">Last Name</h5>
                <input
                  type="text"
                  name="lastName"
                  placeholder={account.lastName}
                />
              </div>
              <div className="registration-form-row">
                <h5 className="label">Car License</h5>
                <input
                  type="text"
                  name="licenseNumber"
                  placeholder={account.licenseNo}
                />
                <h5 className="label">ID</h5>
                <input
                  type="text"
                  name="id"
                  placeholder={account.id}
                  readOnly
                />
              </div>
              <div className="edit-form-actions">
                <button type="submit" className="sign-in-btn passenger-btn">
                  Save Changes
                </button>
                <button
                  className="sign-in-btn delete-acc"
                  onClick={deleteProfile}
                >
                  Delete Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default DriverProfile;
