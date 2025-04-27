# OutfitCheck AI - Fashion Advice App

OutfitCheck AI is a mobile-responsive web application that provides AI-powered fashion advice for any occasion. Get instant feedback on your outfit choices, personalized suggestions for improvements, and build your style confidence.

## Features

- 📱 **Mobile-first design**: Optimized for seamless use on smartphones and tablets
- 🤖 **AI-powered feedback**: Get instant outfit analysis tailored to specific occasions
- 📷 **Image upload**: Upload photos of your outfits for more accurate advice
- 💾 **Saved history**: Review all your previous outfit checks and advice
- 👤 **User accounts**: Simple authentication system with personalized experience
- 📊 **Personal stats**: Track your style evolution and preferences

## Technologies Used

### Frontend
- **React**: Primary UI framework using functional components and hooks
- **React Router**: For client-side routing and navigation
- **Tailwind CSS**: For responsive design and styling
- **Vite**: Fast and modern build tool and development server

### AI Integration
- **Anthropic Claude API**: Provides intelligent outfit analysis and recommendations
- Local storage for persisting user data and outfit history

## AI Integration Details

The app integrates with Anthropic's Claude API to provide intelligent fashion advice:

1. **Outfit Analysis**: When a user submits an outfit for a specific occasion, the app sends this information to the Claude API along with a custom system prompt.

2. **Structured Response**: Claude analyzes the outfit and returns a structured response that includes:
   - A suitability score (1-10)
   - Aspects of the outfit that work well
   - Suggestions for improvements
   - Specific recommendations for accessories or alternatives

3. **Image Processing**: When users upload photos, the app converts these to base64 and includes them in the API request, allowing Claude to analyze the visual aspects of the outfit.

## Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/outfitcheck-ai.git
   cd outfitcheck-ai
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with your Anthropic API key:
   ```
   VITE_ANTHROPIC_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Build for production:
   ```
   npm run build
   ```

## Project Structure

```
src/
├── assets/             # Static assets
├── components/         # Reusable UI components
│   ├── Navbar.jsx      # Top navigation
│   ├── BottomNavigation.jsx # Mobile navigation
│   ├── ImageUploader.jsx # For outfit photos
│   └── ...
├── pages/              # Main application pages
│   ├── HomePage.jsx    # Landing page
│   ├── OutfitCheckPage.jsx # AI outfit analysis
│   ├── HistoryPage.jsx # Past outfit checks
│   ├── ProfilePage.jsx # User profile
│   └── LoginPage.jsx   # Authentication
├── services/           # API and data services
│   ├── aiService.js    # Anthropic API integration
│   └── storageService.js # Local storage handling
├── hooks/              # Custom React hooks
├── context/            # React context providers
│   └── AuthContext.js  # Authentication state
├── App.jsx             # Main application component
├── App.css             # Global styles
└── main.jsx            # Entry point
```

## Future Improvements

- Implement OAuth authentication with providers like Google or Apple
- Create a dedicated closet feature where users can save their clothing items
- Add outfit suggestion feature that generates outfits based on user's clothing
- Implement social sharing of outfit checks
- Create a community feature for style discussions
- Expand to include seasonal recommendations and trend analysis
- Add push notifications for style tips and reminders

## License

This project is licensed under the MIT License - see the LICENSE file for details.