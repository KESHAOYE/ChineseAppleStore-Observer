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

const api = axios.create({
    baseURL: '', 
    timeout: 3000
})

api.interceptors.request.use(config => {
   return config 
}, err => {
  return Promise.reject(err)
})

api.interceptors.response.use(res => {
   return Promise.resolve('body' in res.data? res.data.body: res.data)
}, err => {
   return Promise.reject(err)
})

export default api;
