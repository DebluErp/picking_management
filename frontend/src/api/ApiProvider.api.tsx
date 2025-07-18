import axios from 'axios';
import type { AxiosInstance } from 'axios';
import Constant from '../common/Constant';

const LOGIN_BASE_URL = Constant.LOGIN_BASE_URL
// const BASE_URL = Constant.BASE_URL
const CONNECTION_TIMEOUT = Constant.CONNECTION_TIMEOUT

class ApiProvider {
  private static axiosInstance: AxiosInstance;

  // ✅ สร้าง axios instance ครั้งเดียว
  private static get instance(): AxiosInstance {
    if (!this.axiosInstance) {
      this.axiosInstance = axios.create({
        baseURL: LOGIN_BASE_URL,
        timeout: CONNECTION_TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // ✅ แนบ token อัตโนมัติถ้ามี
      this.axiosInstance.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      });
    }

    return this.axiosInstance;
  }

  // ✅ GET
  static async get<T = unknown>(endpoint: string, params?: object): Promise<T> {
    const response = await this.instance.get(endpoint, { params });
    return response.data;
  }

  // ✅ POST
  static async post<T = unknown>(endpoint: string, data?: object): Promise<T> {
    const response = await this.instance.post(endpoint, data);
    return response.data;
  }

  // ✅ PUT
  static async put<T = unknown>(endpoint: string, data?: object): Promise<T> {
    const response = await this.instance.put(endpoint, data);
    return response.data;
  }

  // ✅ DELETE
  static async delete<T = unknown>(endpoint: string, params?: object): Promise<T> {
    const response = await this.instance.delete(endpoint, { params });
    return response.data;
  }

  // ✅ UPLOAD FILE
  static async upload<T = unknown>(endpoint: string, file: File): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await this.instance.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export default ApiProvider;
