import axios from 'axios'

const requestMain = axios.create({
  baseURL: 'https://api.9day.tech',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
requestMain.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
requestMain.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
)

export default requestMain 