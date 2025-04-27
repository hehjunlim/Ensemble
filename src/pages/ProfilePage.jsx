import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getOutfitCheckHistory } from '../services/storageService';
import { getUserPreferences, saveUserPreferences } from '../services/storageService';

const ProfilePage = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [preferences, setPreferences] = useState({
    darkMode: false,
    notificationsEnabled: true,
    favoriteOccasions: []
  });
  
  const [stats, setStats] = useState({
    totalChecks: 0,
    topOccasions: [],
    averageScore: 0
  });

  // Load user preferences and stats
  useEffect(() => {
    if (isAuthenticated) {
      // Load preferences
      const userPrefs = getUserPreferences();
      setPreferences(userPrefs);
      
      // Calculate stats from outfit history
      const history = getOutfitCheckHistory();
      const totalChecks = history.length;
      
      // Calculate top occasions
      const occasionCounts = {};
      history.forEach(check => {
        if (check.occasion) {
          occasionCounts[check.occasion] = (occasionCounts[check.occasion] || 0) + 1;
        }
      });
      
      const topOccasions = Object.entries(occasionCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([occasion]) => occasion);
      
      // Calculate average score
      const scores = history.map(check => check.result?.score).filter(Boolean);
      const averageScore = scores.length > 0 
        ? Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 10) / 10
        : 0;
      
      setStats({
        totalChecks,
        topOccasions,
        averageScore
      });
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleToggleChange = (key) => {
    const updatedPreferences = {
      ...preferences,
      [key]: !preferences[key]
    };
    
    setPreferences(updatedPreferences);
    saveUserPreferences(updatedPreferences);
  };

  // If not logged in, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4">Profile</h1>
          <p className="mb-6">Please log in to view your profile</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header section with user info */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p>@{user.username}</p>
            </div>
          </div>
        </div>
        
        {/* Stats section */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Your Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.totalChecks}</div>
              <div className="text-gray-600">Outfit Checks</div>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.averageScore || '-'}</div>
              <div className="text-gray-600">Avg. Score</div>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-600">{new Date().toLocaleDateString()}</div>
              <div className="text-gray-600">Member Since</div>
            </div>
          </div>
        </div>
        
        {/* Favorite occasions */}
        {stats.topOccasions.length > 0 && (
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Top Occasions</h2>
            <div className="flex flex-wrap gap-2">
              {stats.topOccasions.map((occasion) => (
                <span
                  key={occasion}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {occasion}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Settings/preferences */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Dark Mode</h3>
                <p className="text-sm text-gray-600">Use dark theme throughout the app</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={preferences.darkMode}
                  onChange={() => handleToggleChange('darkMode')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Notifications</h3>
                <p className="text-sm text-gray-600">Receive style tips and reminders</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={preferences.notificationsEnabled}
                  onChange={() => handleToggleChange('notificationsEnabled')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
        
        {/* Account actions */}
        <div className="p-6">
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-200"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;