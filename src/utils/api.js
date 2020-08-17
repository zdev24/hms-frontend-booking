import axios from 'axios';
import { BE_URL, ENVIRONMENT } from './constants';
import authService from '../services/auth.service';

const api_instance = axios.create({
  baseURL: BE_URL,
  timeout: ENVIRONMENT().timeOutApi,
});

api_instance.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken();
    const isExpire = authService.isExpire();
    const isRefresh = authService.isRefresh();

    if (token && !isExpire) {
      config.headers.authorization = `Bearer ${token}`;
      if (isRefresh) {
        authService.getRefreshToken();
      }
    } else {
      // authService.logout();
      // window.location.href = `/login`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api_instance;
