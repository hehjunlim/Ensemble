// src/components/ImageUploader.jsx
import { useState, useRef } from 'react';
import { Camera } from 'lucide-react';

/**
 * Component for uploading outfit images with preview
 */
const ImageUploader = ({ onImageSelected, className }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processSelectedFile(file);
  };

  // Handle drag and drop events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  // Process the selected file
  const processSelectedFile = (file) => {
    if (!file) return;

    // Check if file is an image
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setIsLoading(true);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
      setIsLoading(false);
      
      // Pass the file to parent component
      if (onImageSelected) {
        onImageSelected(file);
      }
    };
    reader.onerror = () => {
      console.error('Error reading file');
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Reset the uploader
  const resetUploader = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onImageSelected) {
      onImageSelected(null);
    }
  };

  return (
    <div className={`w-full ${className || ''}`}>
      {!previewUrl ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
          onClick={triggerFileInput}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          <div className="flex flex-col items-center justify-center space-y-2">
            <Camera className="w-12 h-12 text-gray-400" />
            <p className="text-lg font-medium text-gray-700">
              Upload your outfit photo
            </p>
            <p className="text-sm text-gray-500">
              Drag and drop an image or click to browse
            </p>
            <p className="text-xs text-gray-400 mt-2">
              JPG, PNG, or GIF • Max 5MB
            </p>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-lg">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
              <div className="loader" />
            </div>
          )}
          
          <img
            src={previewUrl}
            alt="Outfit preview"
            className="w-full h-auto object-contain"
          />
          
          <div className="absolute bottom-0 left-0 right-0 flex justify-between p-2 bg-black bg-opacity-50">
            <button
              onClick={resetUploader}
              className="px-3 py-1 bg-white text-red-600 rounded text-sm font-medium hover:bg-gray-100"
            >
              Remove
            </button>
            
            <button
              onClick={triggerFileInput}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
            >
              Change
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;