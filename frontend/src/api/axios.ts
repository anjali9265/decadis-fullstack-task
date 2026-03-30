import axios from "axios";

const api = axios.create({
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("Network error:", error);
      return Promise.reject({
        message: "Network error. Please try again.",
      });
    }

    const { status, data } = error.response;

    switch (status) {
      case 400:
        console.warn("Bad request:", data.error);
        break;

      case 401:
        console.warn("Unauthorized:", data.error);
        break;

      case 404:
        console.warn("Not found:", data.error);
        break;

      case 409:
        console.warn("Conflict:", data.error);
        break;

      case 500:
      default:
        console.error("Server error:", data.error);
        break;
    }

    // Always reject with a normalized error object
    return Promise.reject({
      status,
      message: data?.error || "Unexpected error occurred",
    });
  }
);

export default api;
