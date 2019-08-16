/*
 * @Author: w
 * @Date: 2019-08-13 13:45:51
 * @LastEditors: w
 * @LastEditTime: 2019-08-14 10:22:48
 */
import axios from "axios";
// import router from '@/router';
// import { getToken } from '@/assets/utils/token';

let baseurl = "";

switch (process.env.NODE_ENV) {
    case "production":
        baseurl = "http://localhost:888";
        break;
    case "development":
        baseurl = "http://localhost:888";   
    break;
}

const instance = axios.create({
    headers: {},
    timeout: 20000,
    baseURL: baseurl
});

//axios的一些配置
// instance.interceptors.request.use((config) => {  //配置发送请求的信息
//     config.headers = config.headers || {};
//     config.headers.Authorization = getToken();
//     return config;
// });

// // 添加响应拦截器
// instance.interceptors.response.use((response,error) => {
//     let responseData = response.data;
//     // console.log(response)
//     // console.log(error)
//     // 如果token失效 跳到登录页
//     if (responseData.code && responseData.code === 401) {
//         return router.push('/login');
//     }
//     return responseData;
// }, e => {
//     return Promise.reject(e);
// });

export default instance
export { baseurl }