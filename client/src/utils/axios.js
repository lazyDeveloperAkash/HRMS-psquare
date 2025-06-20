import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true, // important for cookie JWT
});

export default instance;
