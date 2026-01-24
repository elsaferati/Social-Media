import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );
  const [loading, setLoading] = useState(false);

  // Check if user is admin
  const isAdmin = currentUser?.role === 'admin';

  const login = (userData, authToken) => {
    setCurrentUser(userData);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const updateUser = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Check token validity on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (storedToken && storedUser) {
      try {
        // Decode JWT to check expiration (basic check)
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        
        if (isExpired) {
          logout();
        }
      } catch (error) {
        // Invalid token format
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      token,
      isAdmin,
      loading,
      login, 
      logout, 
      updateUser,
      setLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
