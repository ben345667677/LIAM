import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('API Request:', {
          url: config.url,
          method: config.method,
          hasToken: !!token
        });
        return config;
      },
      (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Response Error:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });

        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log('API: Unauthorized, removing token and redirecting');
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(email: string, password: string): Promise<AxiosResponse> {
    return this.api.post('/register', { email, password });
  }

  async login(email: string, password: string): Promise<AxiosResponse> {
    return this.api.post('/login', { email, password });
  }

  // Shift endpoints
  async createShift(shiftData: {
    employeeName: string;
    checkIn: string;
    checkOut: string;
    createdAt: string;
  }): Promise<AxiosResponse> {
    return this.api.post('/home/newShift', shiftData);
  }

  async checkHomeAccess(): Promise<AxiosResponse> {
    return this.api.get('/home');
  }

  // Generic GET request
  async get(url: string): Promise<AxiosResponse> {
    return this.api.get(url);
  }

  // Generic POST request
  async post(url: string, data: any): Promise<AxiosResponse> {
    return this.api.post(url, data);
  }

  // Generic PUT request
  async put(url: string, data: any): Promise<AxiosResponse> {
    return this.api.put(url, data);
  }

  // Generic DELETE request
  async delete(url: string): Promise<AxiosResponse> {
    return this.api.delete(url);
  }
}

export const apiService = new ApiService();
export default apiService;