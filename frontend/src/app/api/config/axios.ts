import Axios from "axios";

const headers = {
  "Content-Type": "application/json",
};

const baseURL = `http://127.0.0.1:8000/api`;

export const axiosPublic = Axios.create({
  baseURL,
  headers,
});
export const axiosPrivate = Axios.create({
  baseURL,
  headers,
  
});