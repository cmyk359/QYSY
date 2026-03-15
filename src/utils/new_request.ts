// src/utils/request.js
import axios from 'axios'

// 创建 axios 实例
const new_request = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

// 请求拦截器
// request.interceptors.request.use(
//   config => {
//     // 在发送请求之前做些什么
//     const token = localStorage.getItem('token')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   error => {
//     // 对请求错误做些什么
//     return Promise.reject(error)
//   }
// )

// 响应拦截器
new_request.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data
  },
  (error) => {
    // 对响应错误做点什么
    if (error.response) {
      switch (error.response.status) {
        case 401:
          ElMessage.error('未授权，请重新登录')
          break
        case 403:
          ElMessage.error('禁止访问')
          // 处理禁止访问
          break
        case 500:
          ElMessage.error('服务器错误，请稍后再试')
          // 处理服务器错误
          break
      }
    }
    return Promise.reject(error)
  },
)

export default new_request
