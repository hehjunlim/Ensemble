// src/services/aiService.js
import axios from 'axios';

// Constants
const API_URL = import.meta.env.VITE_ANTHROPIC_API_URL || 'https://api.anthropic.com/v1/messages';
const API_VERSION = import.meta.env.VITE_ANTHROPIC_API_VERSION || '2023-06-01';
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // ms

/**
 * Service for interacting with Anthropic's Claude API
 */
class AIService {
  constructor() {
    this.apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (!this.apiKey) {
      console.warn('Anthropic API key not found in environment variables');
    }
  }

  /**
   * Initialize the service with API key from user if not in env
   * @param {string} apiKey - Anthropic API key
   */
  initialize(apiKey) {
    if (apiKey) {
      this.apiKey = apiKey;
      // Store in session storage for temporary persistence
      sessionStorage.setItem('anthropic_api_key', apiKey);
    } else if (sessionStorage.getItem('anthropic_api_key')) {
      this.apiKey = sessionStorage.getItem('anthropic_api_key');
    }
  }

  /**
   * Create headers for API requests
   * @returns {Object} Headers object
   */
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
      'anthropic-version': API_VERSION,
    };
  }

  /**
   * Encode image to base64 format
   * @param {File} imageFile - Image file to encode
   * @returns {Promise<string>} Base64 encoded image
   */
  async encodeImageToBase64(imageFile) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = () => {
        // Extract the base64 part by removing the data URL prefix
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  }

  /**
   * Analyze outfit from uploaded image
   * @param {File} imageFile - Image file containing outfit
   * @param {Object} options - Additional options for analysis
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeOutfit(imageFile, options = {}) {
    if (!this.apiKey) {
      throw new Error('API key not set. Please initialize the service first.');
    }

    try {
      // Encode image to base64
      const base64Image = await this.encodeImageToBase64(imageFile);

      // Build the system prompt
      const systemPrompt = `You are an expert fashion consultant analyzing outfit images. 
      Provide detailed feedback on the outfit in the image including:
      1. Style identification (casual, formal, business, etc.)
      2. Color coordination analysis
      3. Fit assessment
      4. Occasion appropriateness
      5. Suggestions for improvements or alternatives
      6. Accessory recommendations
      
      ${options.additionalInstructions || ''}`;

      // Prepare the API request payload
      const payload = {
        model: options.model || 'claude-3-5-sonnet-20240620',
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: imageFile.type,
                  data: base64Image
                }
              },
              {
                type: 'text',
                text: options.userPrompt || 'Please analyze this outfit and provide detailed fashion advice.'
              }
            ]
          }
        ]
      };

      // Make API request with retry logic
      return await this.makeRequestWithRetry(() => 
        axios.post(API_URL, payload, { headers: this.getHeaders() })
      );
    } catch (error) {
      console.error('Error analyzing outfit:', error);
      throw new Error(`Failed to analyze outfit: ${error.message}`);
    }
  }

  /**
   * Make API request with retry logic
   * @param {Function} requestFn - Function that returns a promise for the request
   * @returns {Promise<Object>} API response data
   */
  async makeRequestWithRetry(requestFn) {
    let retries = 0;
    
    while (retries <= MAX_RETRIES) {
      try {
        const response = await requestFn();
        return response.data;
      } catch (error) {
        if (error.response && error.response.status === 429) {
          // Rate limiting error - wait and retry
          retries++;
          if (retries <= MAX_RETRIES) {
            console.log(`Rate limited. Retrying in ${RETRY_DELAY}ms...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retries));
            continue;
          }
        }
        
        // For other errors or if max retries reached
        throw error;
      }
    }
  }
}

// Export as singleton
export default new AIService();