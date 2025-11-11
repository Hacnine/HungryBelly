import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

// Add access token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle token refresh on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true })
        localStorage.setItem("accessToken", data.accessToken)
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return axiosInstance(originalRequest)
      } catch (err) {
        localStorage.removeItem("accessToken")
        window.location.href = "/login"
        return Promise.reject(err)
      }
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
