import Axios from "axios";

const headers = {
  "Content-Type": "application/json",
};

const baseURL = `http://127.0.0.1:8000/api`;

export const axiosInstance  = Axios.create({
  baseURL,
  headers,
});
