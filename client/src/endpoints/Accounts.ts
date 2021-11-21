import axios from "axios";

const passengerBaseURL = "http://localhost:5001/api/v1/passenger";
const driverBaseURL = "http://localhost:5001/api/v1/passenger";

const postLogin = async (email: string, phone: string, accType: string) => {
  const res = await axios({
    method: "post",
    url:
      (accType === "passenger" ? passengerBaseURL : driverBaseURL) + "/login",
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({
      email,
      phone,
    }),
  });
  return res;
};

const postLogout = async (token: string, accType: string) => {
  const res = await axios({
    method: "post",
    url:
      (accType === "passenger" ? passengerBaseURL : driverBaseURL) + "/logout",
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({
      token,
    }),
  });
  return res;
};

const tokenIsValid = async (token: string, accType: string) => {
  const res = await axios({
    method: "post",
    url:
      (accType === "passenger" ? passengerBaseURL : driverBaseURL) + "/verify",
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({
      token,
    }),
  });
  return res;
};

export { postLogin, postLogout, tokenIsValid };
