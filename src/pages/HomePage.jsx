// src/pages/HomePage.jsx
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Image, Clock, Settings } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
  const { user, isAuthenticated } = useContext(AuthContext);

  const features = [
    {
      icon: Camera,
      title: 'AI Outfit Analysis',
      description: 'Get instant fashion advice from our advanced AI',
    },
    {
      icon: Image,
      title: 'Style Suggestions',
      description: 'Receive personalized recommendations to enhance your look',
    },
    {
      icon: Clock,
      title: 'History Tracking',
      description: 'Review your past outfit analyses and track your style evolution',
    },
    {
      icon: Settings,
      title: 'Customization',
      description: 'Tailor the AI to understand your personal style preferences',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to OutfitCheck AI</h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-8">
          Your personal fashion assistant powered by AI. Get instant feedback on your outfits and elevate your style.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          {isAuthenticated ? (
            <Link
              to="/outfit-check"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Analyze Your Outfit
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Key Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                  <IconComponent className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <div className="flex-1 max-w-md">
            <div className="rounded-lg bg-gray-100 p-2 mb-4 aspect-video flex items-center justify-center">
              <span className="text-gray-500">Outfit Image Demo</span>
            </div>
          </div>
          
          <div className="flex-1 max-w-md">
            <h3 className="text-xl font-medium mb-3">Simple 3-Step Process</h3>
            <ol className="space-y-4">
              <li className="flex items-start">
                <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full mr-3 flex-shrink-0 text-sm">
                  1
                </span>
                <p>Take a photo or upload an image of your outfit</p>
              </li>
              <li className="flex items-start">
                <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full mr-3 flex-shrink-0 text-sm">
                  2
                </span>
                <p>Our AI analyzes your style, colors, fit, and overall look</p>
              </li>
              <li className="flex items-start">
                <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full mr-3 flex-shrink-0 text-sm">
                  3
                </span>
                <p>Get detailed feedback and personalized recommendations</p>
              </li>
            </ol>
            
            {isAuthenticated ? (
              <Link
                to="/outfit-check"
                className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Try It Now
              </Link>
            ) : (
              <Link
                to="/register"
                className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Elevate Your Style?</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          Join thousands of users who are already improving their fashion sense with OutfitCheck AI.
        </p>
        
        {isAuthenticated ? (
          <Link
            to="/outfit-check"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Analyze Your First Outfit
          </Link>
        ) : (
          <Link
            to="/register"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Create Your Free Account
          </Link>
        )}
      </section>
    </div>
  );
};

export default HomePage;