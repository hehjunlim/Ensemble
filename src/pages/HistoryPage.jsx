import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOutfitCheckHistory, deleteOutfitCheck } from '../services/storageService';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Load history on component mount
  useEffect(() => {
    const loadHistory = () => {
      try {
        const outfitHistory = getOutfitCheckHistory();
        setHistory(outfitHistory);
      } catch (error) {
        console.error('Error loading history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  // Handle deleting an outfit check
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this outfit check?')) {
      const success = deleteOutfitCheck(id);
      if (success) {
        setHistory(history.filter(check => check.id !== id));
      }
    }
  };

  // Filter history based on selected filter
  const filteredHistory = () => {
    if (filter === 'all') {
      return history;
    }
    
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    
    if (filter === 'week') {
      return history.filter(check => {
        const checkDate = new Date(check.date);
        return checkDate >= oneWeekAgo;
      });
    }
    
    return history;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Outfit History</h1>
      
      {/* Filter controls */}
      <div className="mb-6 flex">
        <button
          className={`px-4 py-2 mr-2 rounded-md ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            filter === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setFilter('week')}
        >
          This Week
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center">
          <div className="spinner"></div>
        </div>
      ) : filteredHistory().length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600 mb-4">No outfit checks found</p>
          <Link
            to="/outfit-check"
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Create Your First Check
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory().map((check) => (
            <div key={check.id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{check.occasion}</h3>
                  <p className="text-gray-500 text-sm">{formatDate(check.date)}</p>
                </div>
                {check.result.score && (
                  <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                    check.result.score >= 7 ? 'bg-green-500' : 
                    check.result.score >= 4 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}>
                    Score: {check.result.score}/10
                  </div>
                )}
              </div>
              
              <p className="mt-2 line-clamp-2 text-gray-700">
                {check.outfitDescription}
              </p>
              
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleDelete(check.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
                
                <Link
                  to={`/outfit-check?id=${check.id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;