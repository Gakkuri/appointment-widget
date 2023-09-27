import axios from "axios";

const serverURL = "http://localhost:3000/";
// const serverURL = "https://simple-backend-pi.vercel.app/";

export const axiosRequest = async (
  method: string,
  url: string,
  options?: any
) => {
  return await axios({
    method,
    url: `${serverURL}${url}`,
    ...options,
  });
};
