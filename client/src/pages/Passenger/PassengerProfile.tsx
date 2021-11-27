import MainNavbar from "./PassengerNavbar";
import { useState, useEffect } from "react";
import { apiGetDetails, apiEdit, apiDelete } from "../../endpoints/Accounts";
import Cookies from "universal-cookie/es6";
import "../main.css";

interface passengerProfileProps {
  setIsPassengerLoggedIn: React.Dispatch<React.SetStateAction<Boolean>>;
}

interface passengerAccount {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
}

const PassengerProfile = (props: passengerProfileProps) => {
  const cookies = new Cookies();
  const pt = cookies.get("ptoken");
  const [account, setAccount] = useState<passengerAccount>({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    apiGetDetails("passenger", pt).then((res) => {
      const acc: passengerAccount = {
        email: res.data.email,
        phone: res.data.phone,
        firstName: res.data.firstName,
        lastName: res.data.lastName,
      };
      setAccount(acc);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editProfile = (event: any) => {
    event.preventDefault();
    const acc: passengerAccount = {
      email: event.target.email.value,
      phone: event.target.phone.value,
      firstName: event.target.firstName.value,
      lastName: event.target.lastName.value,
    };
    apiEdit("passenger", pt, acc)
      .then((res) => {
        const newAcc: passengerAccount = {
          email:
            event.target.email.value === ""
              ? account.email
              : event.target.email.value,
          phone:
            event.target.phone.value === ""
              ? account.phone
              : event.target.phone.value,
          firstName:
            event.target.firstName.value === ""
              ? account.firstName
              : event.target.firstName.value,
          lastName:
            event.target.lastName.value === ""
              ? account.lastName
              : event.target.lastName.value,
        };
        alert("Profile changes have been saved successfully.");
        event.target.reset();
        setAccount(newAcc);
      })
      .catch((err) => {
        alert(err.response.data);
      });
  };

  const deleteProfile = (event: any) => {
    event.preventDefault();
    apiDelete("passenger", pt)
      .then(() => {
        alert("Account deletion successful");
        cookies.remove("pt");
      })
      .catch((err) => {
        alert(err.response.data);
      });
  };

  return (
    // TODO
    <>
      <MainNavbar setIsPassengerLoggedIn={props.setIsPassengerLoggedIn} />
      <div>
        <div className="image-overlay passenger-bg"></div>
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

export default PassengerProfile;
