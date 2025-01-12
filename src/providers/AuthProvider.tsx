"use client";

import { createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { AuthResponse, authService, GoogleLoginData, LoginData, RegisterData } from "@/services/auth.service";
import { User } from "@/types/user";

interface AuthContextType {
  user: User | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  googleLoginMutation: UseMutationResult<AuthResponse, unknown, GoogleLoginData, unknown>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Query for getting user profile
  const { data: user, isLoading } = useQuery({
    queryKey: ["auth-user"],
    queryFn: authService.getProfile,
    retry: false,
    enabled: typeof window !== "undefined" ? !!localStorage.getItem("accessToken") : false,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", data.access_token);
      }
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      router.push("/");
    },
    onError: (error) => {
      const message = error.message || "Login failed";
      throw new Error(message);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", data.access_token);
      }
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      router.push("/");
    },
    onError: (error) => {
      const message = error.message || "Registration failed";
      throw new Error(message);
    },
  });

  // Google login mutation
  const googleLoginMutation = useMutation({
    mutationFn: authService.googleLogin,
    onSuccess: (data) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", data.access_token);
      }
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      router.push("/");
    },
    onError: (error) => {
      const message = error.message || "Google login failed";
      throw new Error(message);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();
      router.push("/login");
    },
  });

  const login = async (data: LoginData) => {
    await loginMutation.mutateAsync(data);
  };

  const register = async (data: RegisterData) => {
    await registerMutation.mutateAsync(data);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    googleLoginMutation,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
