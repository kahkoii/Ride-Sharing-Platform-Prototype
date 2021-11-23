import axios from "axios";

const matcherBaseURL = "http://localhost:5003/api/v1/matcher";

const passengerFindTrip = async (
  token: string,
  locationPostal: string,
  destinationPostal: string
) => {
  const res = await axios({
    method: "post",
    url: matcherBaseURL + "/queue-passenger?token=" + token,
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({
      locationPostal,
      destinationPostal,
    }),
  });
  return res;
};

const driverStartSearch = async (token: string) => {
  const res = await axios({
    method: "post",
    url: matcherBaseURL + "/queue-driver?token=" + token,
  });
  return res;
};

export { passengerFindTrip, driverStartSearch };
