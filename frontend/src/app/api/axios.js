import React from "react";
import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      !error.config._retry
    ) {
      error.config._retry = true;
      try {
        await api.get(`${process.env.NEXT_PUBLIC_API_URL}/api/refresh-token`);
        return api(error.config);
      } catch (err) {
        console.error("Làm mới token thất bại", err);
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
