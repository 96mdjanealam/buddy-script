"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { User, LoginData } from "@/types/types";
import { authService } from "@/services/auth.service";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback(async (data: LoginData) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      if (response.success) {
        setUser(response.data.user);
        // Set the token as a same-origin cookie so proxy.ts can read it in production.
        // The backend sets it cross-domain which browsers may block; this ensures it lands.
        if (response.data.token) {
          const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
          document.cookie = `accessToken=${response.data.token}; path=/; max-age=${maxAge}; SameSite=Lax`;
        }
      }
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      // Clear the client-side cookie we set on login
      document.cookie = "accessToken=; path=/; max-age=0; SameSite=Lax";
      setIsLoading(false);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await authService.getMe();
      if (response.success) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        setUser,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};


