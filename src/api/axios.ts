import axios, { AxiosError } from 'axios';
import { store } from '../store/store';
import { BackEndUrl } from '../constants/BackEndUrl';

const Api = axios.create({
  baseURL: BackEndUrl,
});

// Add a request interceptor to include the auth token
Api.interceptors.request.use((config) => {
  const { token } = store.getState().auth;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers.Accept = 'application/json';
  return config;
});

// Export axios directly for type checking if needed
export { axios };
export default Api;