// src/pages/OutfitCheckPage.jsx
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ThumbsUp, Share2, Save } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import aiService from '../services/aiService';
import { AuthContext } from '../context/AuthContext';
import useMediaQuery from '../hooks/useMediaQuery';
import { saveOutfitCheck } from '../services/storageService';

const OutfitCheckPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [extraPrompt, setExtraPrompt] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { returnUrl: '/outfit-check' } });
    } else if (!aiService.apiKey) {
      // Try to initialize from session storage
      aiService.initialize();
    }
  }, [user, navigate]);

  // Handle image selection
  const handleImageSelected = (file) => {
    setSelectedImage(file);
    setAnalysisResult(null);
    setError(null);
  };

  // Handle API key submission if needed
  const handleApiKeySubmit = (e) => {
    e.preventDefault();
    const apiKey = e.target.apiKey.value;
    if (apiKey) {
      aiService.initialize(apiKey);
      e.target.reset();
    }
  };

  // Request outfit analysis
  const analyzeOutfit = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    if (!aiService.apiKey) {
      setError('API key not set. Please enter your Anthropic API key');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await aiService.analyzeOutfit(selectedImage, {
        userPrompt: extraPrompt || 'Please analyze this outfit and provide fashion advice.',
        additionalInstructions: 'Format your response in sections with emojis for better readability.'
      });
      
      setAnalysisResult(result);
      
      // Save to history
      if (user) {
        const historyItem = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          imageUrl: URL.createObjectURL(selectedImage),
          analysis: result.content[0].text,
          userId: user.id
        };
        saveOutfitCheck(historyItem);
      }
    } catch (err) {
      console.error('Error during outfit analysis:', err);
      setError(`Analysis failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sharing the result
  const handleShare = async () => {
    if (!analysisResult) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My OutfitCheck Analysis',
          text: analysisResult.content[0].text,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(analysisResult.content[0].text);
        alert('Analysis copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-center mb-6">Outfit Check</h1>

      {/* API Key Form (if not set) */}
      {!aiService.apiKey && (
        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h2 className="text-lg font-medium mb-2">Set Your API Key</h2>
          <p className="text-sm text-gray-600 mb-3">
            To use OutfitCheck, you need to provide your Anthropic Claude API key.
          </p>
          <form onSubmit={handleApiKeySubmit} className="flex gap-2">
            <input
              type="password"
              name="apiKey"
              placeholder="Your Anthropic API Key"
              className="flex-1 px-3 py-2 border rounded-md"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Set Key
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            Your key is stored in session storage and is never sent to our servers.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Image Upload */}
        <div>
          <h2 className="text-lg font-medium mb-3">Upload Your Outfit</h2>
          <ImageUploader onImageSelected={handleImageSelected} />
          
          {selectedImage && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Instructions (Optional)
              </label>
              <textarea
                value={extraPrompt}
                onChange={(e) => setExtraPrompt(e.target.value)}
                placeholder="Any specific concerns or questions about your outfit?"
                className="w-full px-3 py-2 border rounded-md h-20 resize-none"
              />
              
              <button
                onClick={analyzeOutfit}
                disabled={isLoading}
                className={`w-full mt-3 py-2 px-4 rounded-md text-white font-medium ${
                  isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Analyzing...
                  </span>
                ) : (
                  'Analyze Outfit'
                )}
              </button>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {error}
            </div>
          )}
        </div>

        {/* Right Column - Analysis Results */}
        <div>
          <h2 className="text-lg font-medium mb-3">Fashion Analysis</h2>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-gray-50">
              <Loader2 className="animate-spin h-8 w-8 text-blue-500 mb-2" />
              <p className="text-gray-600">Analyzing your outfit...</p>
              <p className="text-xs text-gray-500 mt-1">This may take a moment</p>
            </div>
          ) : analysisResult ? (
            <div className="border rounded-lg bg-white p-4 shadow-sm">
              <div className="prose max-w-none">
                {analysisResult.content[0].text.split('\n').map((paragraph, i) => (
                  paragraph ? <p key={i}>{paragraph}</p> : <br key={i} />
                ))}
              </div>
              
              <div className="mt-4 pt-3 border-t flex justify-between">
                <button 
                  className="flex items-center text-gray-600 hover:text-blue-600"
                  onClick={() => alert('Thanks for the feedback!')}
                >
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  <span className="text-sm">Helpful</span>
                </button>
                
                <button 
                  className="flex items-center text-gray-600 hover:text-blue-600"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  <span className="text-sm">Share</span>
                </button>
                
                <button 
                  className="flex items-center text-gray-600 hover:text-blue-600"
                  onClick={() => alert('Saved to favorites!')}
                >
                  <Save className="w-4 h-4 mr-1" />
                  <span className="text-sm">Save</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-gray-50 text-center p-4">
              <p className="text-gray-600 mb-2">
                Upload an outfit image and click "Analyze Outfit" to get personalized fashion advice
              </p>
              <p className="text-sm text-gray-500">
                Our AI will analyze your style, colors, fit, and provide suggestions
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutfitCheckPage;