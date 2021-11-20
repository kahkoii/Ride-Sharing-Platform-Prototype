import axios from "axios";

const baseURL = "http://localhost:5001/api/v1/passenger";

const postLogin = async (email: string, phone: string) => {
  const raw = await axios({
    method: "post",
    url: baseURL + "/login",
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({
      email,
      phone,
    }),
  });
  const res = raw;
  return res;
};

const postLogout = async (token: string) => {
  console.log("LOGGING OUT TOKEN: " + token);
  const raw = await axios({
    method: "post",
    url: baseURL + "/logout",
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({
      token,
    }),
  });
  const res = raw;
  return res;
};

export { postLogin, postLogout };
