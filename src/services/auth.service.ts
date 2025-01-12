import { User } from "@/types/user";
import { axiosInstance } from "../lib/axios-client";

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  emailOrUsername: string;
  password: string;
}

export interface GoogleLoginData {
  token: string;
}

export interface AuthResponse {
  access_token: string;
}

export const authService = {
  async register(data: RegisterData) {
    const response = await axiosInstance.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  async login(data: LoginData) {
    const response = await axiosInstance.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  async googleLogin(data: GoogleLoginData) {
    const response = await axiosInstance.post<AuthResponse>("/auth/google", data);
    return response.data;
  },

  async getProfile() {
    const response = await axiosInstance.get<User>("/auth/profile");
    return response.data;
  },

  async logout() {
    localStorage.removeItem("accessToken");
  },
};
