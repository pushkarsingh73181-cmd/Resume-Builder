import axios from 'axios'

const rawBaseUrl = import.meta.env.VITE_API_URL || '/api'
const baseUrl = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl.replace(/\/$/, '')}/api`

const instance = axios.create({
  baseURL: baseUrl,
})

// Request interceptor: attach token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cfp_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: handle 401
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cfp_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default instance
