/*
 * @Author: KESHAOYE
 * @Date: 2022-09-14 20:39:43
 */
/* 
   tips：简单封装axios
   author： KESHAOYE
   date： 2022-09-14
  */

import axios from "axios"
import vue from 'vue'

const api = axios.create({
    baseURL: '', 
    timeout: 3000
})

api.interceptors.request.use(config => {
   return config 
}, err => {
  Promise.reject(err)
})

api.interceptors.response.use(res => {
   return Promise.resolve(res.data?.body)
}, err => {
   vue.prototype.$message.error('因苹果服务器不稳定,造成请求错误,请重试!')
   Promise.reject(err)
})

export default api;
