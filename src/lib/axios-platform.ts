import axios from 'axios';
import { CONFIG } from '../../src/config/api.config'

// ----------------------------------------------------------------------
const axiosPlatformInstance = axios.create({ baseURL: CONFIG.hostApi });

axiosPlatformInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosPlatformInstance;

