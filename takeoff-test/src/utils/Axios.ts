import axios from 'axios';

const Axios = axios.create({});

Axios.interceptors.request.use(
  config => {
    config.headers = {
      ...config.headers,
      // Подставляем токен в каждый запрос
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };

    return config;
  },
  error => Promise.reject(error),
);

export default Axios;
