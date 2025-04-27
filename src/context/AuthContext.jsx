// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { saveUser, getUser, removeUser } from '../services/storageService';

// Create context
export const AuthContext = createContext();

/**
 * Authentication context provider
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on initial render
  useEffect(() => {
    const loadUser = () => {
      const savedUser = getUser();
      if (savedUser) {
        setUser(savedUser);
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  /**
   * Register a new user
   * @param {string} username - Username
   * @param {string} email - Email address
   * @param {string} password - Password (will be hashed in a real app)
   */
  const register = (username, email, password) => {
    // In a real app, this would make an API call to register
    // For demo purposes, we'll just create a user object
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      createdAt: new Date().toISOString(),
    };

    // Save user to localStorage
    saveUser(newUser);
    setUser(newUser);

    return newUser;
  };

  /**
   * Log in an existing user
   * @param {string} email - Email address
   * @param {string} password - Password (would be verified in a real app)
   */
  const login = (email, password) => {
    // In a real app, this would verify credentials with an API
    // For demo purposes, we'll create a mock user
    const mockUser = {
      id: '123456',
      username: email.split('@')[0],
      email,
      createdAt: new Date().toISOString(),
    };

    // Save user to localStorage
    saveUser(mockUser);
    setUser(mockUser);

    return mockUser;
  };

  /**
   * Log out the current user
   */
  const logout = () => {
    // Remove user from localStorage
    removeUser();
    setUser(null);
  };

  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   */
  const updateProfile = (userData) => {
    const updatedUser = { ...user, ...userData };
    saveUser(updatedUser);
    setUser(updatedUser);
    return updatedUser;
  };

  // Context value
  const contextValue = {
    user,
    loading,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;