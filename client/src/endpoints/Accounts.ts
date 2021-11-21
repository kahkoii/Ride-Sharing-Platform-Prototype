import axios from "axios";

const passengerBaseURL = "http://localhost:5001/api/v1/passenger";
const driverBaseURL = "http://localhost:5001/api/v1/passenger";

const apiLogin = async (email: string, phone: string, accType: string) => {
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

const apiLogout = async (token: string, accType: string) => {
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

const apiVerifyToken = async (token: string, accType: string) => {
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

const apiRegister = async (accType: string, accDetails: any) => {
  const res = await axios({
    method: "post",
    url:
      (accType === "passenger" ? passengerBaseURL : driverBaseURL) +
      "/register",
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify(accDetails),
  });
  return res;
};

export { apiLogin, apiLogout, apiVerifyToken, apiRegister };
