import axios from 'axios'
import { API_CONFIG, REQUEST_CONFIG } from './config'

const requestUser = axios.create({
  baseURL: API_CONFIG.USER_BASE_URL,
  timeout: REQUEST_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
requestUser.interceptors.request.use(
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
requestUser.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data, config } = error.response
      console.error(`API请求失败: ${config.method?.toUpperCase()} ${config.url} - 状态码: ${status}`, {
        status,
        message: data?.message || data?.detail || '服务器错误',
        url: config.url
      })
      
      // 针对500错误的特殊处理
      if (status === 500) {
        console.error('服务器内部错误，请稍后重试')
      }
    }
    return Promise.reject(error)
  }
)

export default requestUser