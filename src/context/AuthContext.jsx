import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Create Axios custom instance
export const api = axios.create({
  baseURL: '/api',
  withCredentials: true // send cookies
});

// Helper to decode JWT payload safely without external dependencies
const getJwtPayload = (jwtToken) => {
  try {
    if (!jwtToken || typeof jwtToken !== 'string') return null;
    const parts = jwtToken.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

// Helper to calculate remaining time in milliseconds until JWT expires
const getTokenRemainingMs = (jwtToken) => {
  const payload = getJwtPayload(jwtToken);
  if (!payload || !payload.exp) return 0;
  const remaining = payload.exp * 1000 - Date.now();
  return remaining > 0 ? remaining : 0;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('accessToken') || null);
  const [loading, setLoading] = useState(true);

  // Helper to handle expired session (1-hour limit)
  const handleSessionExpired = (message = 'Your session has expired (1 hour limit). Please login again.') => {
    sessionStorage.setItem('authErrorMessage', message);
    setToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    delete api.defaults.headers.common['Authorization'];
    const currentPath = window.location.pathname;
    if (currentPath !== '/login' && currentPath !== '/forgot-password' && currentPath !== '/reset-password') {
      window.location.href = '/login';
    }
  };

  // Set auth header whenever token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('accessToken', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('accessToken');
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Initial load: Fetch current user profile if token exists and is not expired
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('accessToken');
      if (storedToken) {
        const remainingMs = getTokenRemainingMs(storedToken);
        if (remainingMs <= 0) {
          handleSessionExpired('Your session has expired (1 hour limit). Please login again.');
          setLoading(false);
          return;
        }

        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          }
        } catch (error) {
          console.error('Error fetching initial profile:', error);
          if (error.response?.status === 401) {
            handleSessionExpired('Your session has expired (1 hour limit). Please login again.');
          } else {
            logout();
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // 1-Hour Session Timer & Active Visibility Check
  useEffect(() => {
    if (!token) return;

    const remainingMs = getTokenRemainingMs(token);
    if (remainingMs <= 0) {
      handleSessionExpired('Your session has expired (1 hour limit). Please login again.');
      return;
    }

    // Auto-logout exactly when token / 1-hour session expires
    const timer = setTimeout(() => {
      handleSessionExpired('Your session has expired (1 hour limit). Please login again.');
    }, remainingMs);

    // Also check when tab becomes visible or receives focus
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible' || document.hasFocus()) {
        const checkRemaining = getTokenRemainingMs(token);
        if (checkRemaining <= 0) {
          handleSessionExpired('Your session has expired (1 hour limit). Please login again.');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
    };
  }, [token]);

  // Axios interceptor to handle expired tokens and 401 responses
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          const msg = error.response.data?.message || 'Your session has expired (1 hour limit). Please login again.';
          handleSessionExpired(msg);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  // Login handler
  const login = async (username, password) => {
    try {
      const cleanUsername = (username || '').trim();
      sessionStorage.removeItem('authErrorMessage');
      const res = await api.post('/auth/login', { username: cleanUsername, password });
      if (res.data.success) {
        setToken(res.data.accessToken);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
    } catch (error) {
      if (error.response?.data?.message) {
        return {
          success: false,
          message: error.response.data.message
        };
      }
      if (error.code === 'ERR_NETWORK' || !error.response || error.response?.status >= 500) {
        return {
          success: false,
          message: 'Unable to connect to backend server. Please verify backend is running on port 5000.'
        };
      }
      return {
        success: false,
        message: 'Login failed. Please check your credentials.'
      };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error on server:', err);
    }
    sessionStorage.removeItem('authErrorMessage');
    setToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    delete api.defaults.headers.common['Authorization'];
  };

  // Refresh user profile helper
  const refreshProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (error) {
      console.error('Profile refresh failed', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

