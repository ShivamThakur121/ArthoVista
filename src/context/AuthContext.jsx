import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Create Axios custom instance
export const api = axios.create({
  baseURL: '/api',
  withCredentials: true // send cookies
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('accessToken') || null);
  const [loading, setLoading] = useState(true);

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

  // Initial load: Fetch current user profile if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          }
        } catch (error) {
          console.error('Error fetching initial profile:', error);
          // If token is invalid or expired, try to refresh first
          if (error.response && error.response.status === 401) {
            try {
              const refreshRes = await axios.post('/api/auth/refresh');
              if (refreshRes.data.success) {
                setToken(refreshRes.data.accessToken);
                const meRes = await axios.get('/api/auth/me', {
                  headers: { Authorization: `Bearer ${refreshRes.data.accessToken}` }
                });
                setUser(meRes.data.user);
              } else {
                logout();
              }
            } catch (err) {
              logout();
            }
          } else {
            logout();
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Axios interceptor to handle expired tokens and auto-refresh
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Check if error is 401 (Unauthorized) and has code TOKEN_EXPIRED
        if (
          error.response && 
          error.response.status === 401 && 
          error.response.data.code === 'TOKEN_EXPIRED' && 
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          try {
            // Attempt to fetch new token using refresh endpoint
            const res = await axios.post('/api/auth/refresh');
            if (res.data.success) {
              const newAccessToken = res.data.accessToken;
              setToken(newAccessToken);
              
              // Update original request headers and retry
              originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
              return api(originalRequest);
            }
          } catch (refreshError) {
            console.error('Refresh token failed:', refreshError);
            logout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [token]);

  // Login handler
  const login = async (username, password) => {
    try {
      const cleanUsername = (username || '').trim();
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
    setToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
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
