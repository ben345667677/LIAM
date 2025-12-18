import { apiService } from '../api/api';

export interface User {
  _id: string;
  email: string;
  createdAt: string;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      console.log('AuthService: Attempting login for email:', email);
      const response = await apiService.login(email, password);
      const data = response.data;

      console.log('AuthService: Login response:', data);

      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        console.log('AuthService: Token saved successfully');
      } else {
        console.warn('AuthService: No access token in response');
      }

      return data;
    } catch (error: any) {
      console.error('AuthService: Login error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });

      // Extract the most specific error message
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.error ||
                          error.message ||
                          'Login failed';

      throw new Error(errorMessage);
    }
  }

  async register(email: string, password: string): Promise<RegisterResponse> {
    try {
      console.log('AuthService: Attempting registration for email:', email);
      const response = await apiService.register(email, password);
      console.log('AuthService: Registration successful');
      return response.data;
    } catch (error: any) {
      console.error('AuthService: Registration error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });

      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.error ||
                          error.message ||
                          'Registration failed';

      throw new Error(errorMessage);
    }
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}

export const authService = new AuthService();
export default authService;