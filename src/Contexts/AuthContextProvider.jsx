import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext.jsx";

const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const token = localStorage.getItem("refreshToken");
      const response = await axios.post(`${API_URL}auth/token`, { token });

      const { accessToken, refreshToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      return accessToken;
    } catch (error) {
      console.error("Failed to refresh token: ", error);
      logout();
      return null;
    }
  }, [logout]);

  const authAxios = useMemo(() => {
    const instance = axios.create();

    instance.interceptors.request.use(
      async (config) => {
        let token = localStorage.getItem("accessToken");

        if (!token) {
          const refreshTokenValue = localStorage.getItem("refreshToken");
          if (refreshTokenValue) {
            token = await refreshToken();
          }
        }

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return instance;
  }, [refreshToken]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}auth/login`, {
        email,
        password,
      });
      const { accessToken, refreshToken, user } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      setUser(user);
      return { status: "SUCCESS" };
    } catch (error) {
      console.error("Login Failed: ", error.response.data);
      return { status: "FAILED", error: error.response.data };
    }
  };

  const register = async (formData) => {
    try {
      await axios.post(`${API_URL}auth/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("User Successfully Registered.");
      return { status: "SUCCESS" };
    } catch (error) {
      console.error(
        "Registration Failed: ",
        error.response?.data || error.message
      );
      return { status: "FAILED", error: error.message };
    }
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem("accessToken");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const access = localStorage.getItem("accessToken");
        if (access) {
          const response = await authAxios.get(`${API_URL}auth/profile`);
          const userData = response.data.user || response.data;
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching user: ", error);
        if (
          error.response?.status === 401 ||
          error.response?.status === 403 ||
          error.message?.includes("token") ||
          error.message?.includes("unauthorized")
        ) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [authAxios, logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        authAxios,
        isAuthenticated,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
