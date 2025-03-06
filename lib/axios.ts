import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.convertkr.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance; 