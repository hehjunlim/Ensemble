// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import OutfitCheckPage from './pages/OutfitCheckPage';
// Temporarily comment out missing pages
// import HistoryPage from './pages/HistoryPage';
// import ProfilePage from './pages/ProfilePage';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';

// Components
// import Navbar from './components/Navbar';
// import BottomNavigation from './components/BottomNavigation';
import useMediaQuery from './hooks/useMediaQuery';

function App() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isLoaded, setIsLoaded] = useState(false);

  // Simulating app initialization
  useEffect(() => {
    // Add any initialization logic here
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">OutfitCheck AI</h1>
          <p className="text-gray-600">Loading your personal fashion assistant...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        {/* {!isMobile && <Navbar />} */}
        
        <main className={`${isMobile ? 'pb-16' : ''}`}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/outfit-check" element={<OutfitCheckPage />} />
            {/* Temporarily comment out missing routes */}
            {/* <Route path="/history" element={<HistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} /> */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        {/* {isMobile && <BottomNavigation />} */}
      </Router>
    </AuthProvider>
  );
}

export default App;