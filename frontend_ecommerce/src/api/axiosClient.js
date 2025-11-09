import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5264/api",
  withCredentials: true,
});

// Attach Authorization header if token is stored in localStorage
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to try refresh once on 401
axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const resp = await axiosClient.post("/auth/refresh", {}, { withCredentials: true });
        const newToken = resp.data?.token;
        if (newToken) {
          localStorage.setItem("token", newToken);
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosClient(originalRequest);
        }
      } catch (err) {
        // refresh failed, fall through to rejection
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
