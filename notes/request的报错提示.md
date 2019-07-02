```js
import axios from "axios"
import { Message } from "element-ui"
import store from "@/store"
import { getToken } from "@/utils/auth"
import config from "@/config"

// 退出登录
const logOut = () => {
  store.dispatch("FedLogOut").then(() => {
    location.reload() // 为了重新实例化vue-router对象 避免bug
  })
}

// create an axios instance
const service = axios.create({
  maxRedirects: 0,
  baseURL: config.baseURL,
  timeout: 5 * 60 * 1000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters.token) {
      config.headers["Authorization"] = `Bearer ${getToken()}`
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => response.data,
  error => {
    console.log("error", error.response)

    const response = error.response.data

    switch (response.status) {
      case 400:
        Message({
          message: "请求参数错误-400",
          type: "error",
          duration: 3 * 1000
        })
        break
      case 401:
        logOut() // 退出登录
        break
      case 404:
        Message({
          message: "网络请求资源不存在-404",
          type: "error",
          duration: 3 * 1000
        })
        break
      case 500:
        Message({
          message: "服务器错误-500",
          type: "error",
          duration: 3 * 1000
        })
        break
      case 502:
        Message({
          message: "Bad Gateway网关错误-502",
          type: "error",
          duration: 3 * 1000
        })
        break
      case 504:
        Message({
          message: "网关超时-504",
          type: "error",
          duration: 3 * 1000
        })
        break
      default:
        Message({
          message: response.msg,
          type: "error",
          duration: 3 * 1000
        })
    }

    return Promise.reject(error)
  }
)

export default service
```
