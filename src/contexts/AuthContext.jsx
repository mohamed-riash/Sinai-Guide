import React, { createContext, useState, useCallback, useMemo } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const loggedUser = authService.login(email, password);
      setUser(loggedUser);
      return loggedUser;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setLoading(true);
    try {
      const registeredUser = authService.register(userData);
      setUser(registeredUser);
      return registeredUser;
    } finally {
      setLoading(false);
    }
  }, []);

  const setupSystemAdmin = useCallback(async (adminData) => {
    const systemAdmin = authService.setupSystemAdmin(adminData);
    setUser(systemAdmin);
    return systemAdmin;
  }, []);

  const updateProfile = useCallback(async (updatedData) => {
    const updated = authService.updateProfile(updatedData);
    setUser(updated);
    return updated;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, login, register, setupSystemAdmin, logout, updateProfile, isAuthenticated: !!user }), [user, loading, login, register, setupSystemAdmin, logout, updateProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
