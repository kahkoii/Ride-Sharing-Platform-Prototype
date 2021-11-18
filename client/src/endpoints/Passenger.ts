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

export { postLogin };
