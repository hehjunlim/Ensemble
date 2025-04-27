// src/services/storageService.js

// Constants
const STORAGE_KEYS = {
    USER: 'outfitcheck_user',
    HISTORY: 'outfitcheck_history',
    SETTINGS: 'outfitcheck_settings'
  };
  
  /**
   * Save user data to local storage
   * @param {Object} userData - User data object
   */
  export const saveUser = (userData) => {
    if (!userData) return;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
  };
  
  /**
   * Get user data from local storage
   * @returns {Object|null} User data object or null if not found
   */
  export const getUser = () => {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userData) return null;
    
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };
  
  /**
   * Remove user data from local storage (logout)
   */
  export const removeUser = () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  };
  
  /**
   * Save an outfit check result to history
   * @param {Object} outfitCheck - Outfit check data
   */
  export const saveOutfitCheck = (outfitCheck) => {
    if (!outfitCheck) return;
    
    const history = getOutfitHistory() || [];
    
    // Add new check to the beginning of the array
    history.unshift(outfitCheck);
    
    // Limit history to 50 items
    const limitedHistory = history.slice(0, 50);
    
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(limitedHistory));
  };
  
  /**
   * Get all outfit history for the current user
   * @param {string} userId - Optional user ID to filter by
   * @returns {Array} Array of outfit check objects
   */
  export const getOutfitHistory = (userId = null) => {
    const historyData = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!historyData) return [];
    
    try {
      const history = JSON.parse(historyData);
      
      // Filter by user ID if provided
      if (userId) {
        return history.filter(item => item.userId === userId);
      }
      
      return history;
    } catch (error) {
      console.error('Error parsing history data:', error);
      return [];
    }
  };
  
  /**
   * Remove a specific outfit check from history
   * @param {string} checkId - ID of the outfit check to remove
   */
  export const removeOutfitCheck = (checkId) => {
    const history = getOutfitHistory();
    const updatedHistory = history.filter(item => item.id !== checkId);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
  };
  
  /**
   * Clear all outfit history
   */
  export const clearOutfitHistory = () => {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  };
  
  /**
   * Save user settings
   * @param {Object} settings - User settings object
   */
  export const saveSettings = (settings) => {
    if (!settings) return;
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  };
  
  /**
   * Get user settings
   * @returns {Object} User settings object
   */
  export const getSettings = () => {
    const settingsData = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!settingsData) return {};
    
    try {
      return JSON.parse(settingsData);
    } catch (error) {
      console.error('Error parsing settings data:', error);
      return {};
    }
  };