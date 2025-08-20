import axios from 'axios'


// 新增：主接口配置
const APP_HOST = import.meta.env.VITE_APP_HOST

const requestAPP = axios.create({
  baseURL: APP_HOST, // 新后端
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
requestAPP.interceptors.request.use(
  (config) => {
    // 自动携带 token
    const token = localStorage.getItem('access_token')
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
requestAPP.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default requestAPP