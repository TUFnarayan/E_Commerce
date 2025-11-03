import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5264/api", // replace with your backend port if different
});

export default axiosClient;
