import axios from 'axios'
import consts from './consts'
import { message } from 'antd'

const api = axios.create({
    baseURL: consts.BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
    }
})

api.interceptors.request.use(
    config => {
        if (config.baseURL === consts.BASE_URL && !config.headers.Authorization) {
            const token = localStorage.getItem(consts.USER_TOKEN)
  
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
      }
  
      return config;
    },
    error => Promise.reject(error)
);

api.interceptors.response.use(function (response) {
    return response;
}, function (e) {
    switch (e.response.status) {
        case 400:
            message.warning(e.response.data.message);
            break
        case 401:
        case 403:
            localStorage.clear();
            break;
        case 409:
            message.warning(e.response.data.message);
            break;
        default:
            break;
    }
    return Promise.reject(e);
});

export default api