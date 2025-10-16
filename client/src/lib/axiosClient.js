import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || window.location.origin,
  withCredentials: true,
});

// (optional) simple response unwrap
axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    // normalize error shape a bit
    err.normalized = {
      status: err.response?.status || 0,
      data: err.response?.data || { error: err.message },
    };
    return Promise.reject(err);
  },
);

export default axiosClient;
