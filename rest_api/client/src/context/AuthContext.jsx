// AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "../Api/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Initialize token from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await axiosInstance.get("/auth/profile");
      setUser(response.data);
      setError(null);
    } catch (error) {
      console.error("Auth check failed:", error);
      // If token is invalid, clear it
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        delete axiosInstance.defaults.headers.common["Authorization"];
      }
      setUser(null);
      setError(error.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setError(null);
    setActionLoading(true);
    
    try {
      const response = await axiosInstance.post("/auth/login", { email, password });
      const { user, token } = response.data;
      
      if (token) {
        localStorage.setItem("token", token);
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      
      setUser(user);
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setActionLoading(false);
    }
  };

  const logout = async () => {
    setActionLoading(true);
    
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local state regardless of API response
      localStorage.removeItem("token");
      delete axiosInstance.defaults.headers.common["Authorization"];
      setUser(null);
      setError(null);
      setActionLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    setActionLoading(true);
    
    try {
      const response = await axiosInstance.post("/auth/register", { 
        name, 
        email, 
        password 
      });
      const { user, token } = response.data;
      
      if (token) {
        localStorage.setItem("token", token);
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      
      setUser(user);
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setActionLoading(false);
    }
  };

  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    actionLoading,
    login,
    logout,
    register,
    checkUser,
    updateUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};