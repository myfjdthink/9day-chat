import axios from 'axios'


// 新增：主接口配置
const APP_HOST = import.meta.env.VITE_APP_HOST

console.log('APP_HOST', APP_HOST)

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
    const { data, code, message } = response.data
    
    // 如果返回的不是标准格式，直接返回原始响应
    if (typeof code === 'undefined') {
      return response
    }
    
    // 处理业务错误
    if (code !== 0) {
      return Promise.reject(new Error(message || '请求失败'))
    }
    
    // 成功则直接返回 data
    return data
  },
  (error) => {
    // 处理网络错误等
    const message = error.response?.data?.message || error.message || '网络请求失败'
    return Promise.reject(new Error(message))
  }
)

export default requestAPP