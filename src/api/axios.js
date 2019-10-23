import axios from 'axios';
import {
  Toast
} from 'vant';
let toast = null;

const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 20000,
  withCredentials: true //允许携带cookie
});


//request
service.interceptors.request.use(config => {
  //console.log(config);
  if (config.showLoading) {
    toast = Toast.loading();
  }
  return config;
}, error => {
  return Promise.reject(error);
});

//response
service.interceptors.response.use(response => {
  //console.log(response);
  if (response.data.errorCode === 0) {
    if (response.config.showLoading) {
      toast.clear();
    }
  }
  return response;
}, error => {
  toast.clear();
  return Promise.reject(error);
});



export default service;
