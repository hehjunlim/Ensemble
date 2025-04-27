// src/components/TestComponent.jsx
import React from 'react';

const TestComponent = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg max-w-md">
        <h2 className="text-2xl font-bold mb-4">Tailwind CSS is Working!</h2>
        <p className="mb-2">
          If you can see this styled card with blue background and white text, 
          your Tailwind configuration is working correctly.
        </p>
        <button className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-gray-100 transition-colors">
          Test Button
        </button>
      </div>
    </div>
  );
};

export default TestComponent;