# RRGPT - Advanced AI Chat Interface

RRGPT is a sophisticated web-based chat interface that leverages Google's Gemini AI model to provide an interactive and dynamic conversational experience. The application features multiple AI personalities and a modern, responsive design.

## 🌟 Features

### Multiple AI Personalities
- **RRGPT**: The default personality with standard chat capabilities
- **DAN GPT**: An alternative personality with different interaction style
- Seamless switching between personalities during conversations

### Chat Interface
- Real-time character-by-character response generation
- Syntax-highlighted code blocks with copy functionality
- Markdown support for rich text formatting
- Smooth animations and transitions
- Dark/Light mode toggle

### Session Management
- Multiple chat sessions support
- Chat history persistence
- Session restoration
- Easy navigation between past conversations

### Mobile Responsiveness
- Fully responsive design
- Optimized for both desktop and mobile devices
- Touch-friendly interface
- Adaptive layout for different screen sizes

### Code Handling
- Syntax highlighting for multiple programming languages
- One-click code copying
- Code block language detection
- Copy success confirmation

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Google AI Studio API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rehan5039/rrgpt.git
cd rrgpt
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your Google AI API key:
```env
VITE_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open `http://localhost:5173` in your browser

## 💡 Usage

### Starting a New Chat
1. Click the "+" button in the header to start a new chat
2. Select your preferred AI model from the dropdown
3. Type your message and press Enter or click the send button

### Switching Models
1. Use the model selector dropdown in the header
2. Choose between RRGPT and DAN GPT
3. Confirm the switch if a response is being generated

### Managing Chat History
1. Click the history icon to view past conversations
2. Select any previous chat to continue the conversation
3. Use the clear history option to remove all past chats

### Using Dark Mode
- Click the sun/moon icon in the header to toggle between light and dark modes
- Your preference will be saved for future sessions

### Code Interaction
1. When the AI generates code:
   - Code blocks are automatically syntax highlighted
   - Click the copy button to copy the code
   - A success message appears when code is copied

### Mobile Usage
- Swipe gestures supported for navigation
- Responsive design adapts to screen size
- Optimized touch targets for mobile interaction

## ⚙️ Configuration

### Model Prompts
- `RRGPT prompt.txt`: Contains the personality configuration for RRGPT
- `DAN prompt.txt`: Contains the personality configuration for DAN GPT

### Environment Variables
- `VITE_API_KEY`: Your Google AI Studio API key

## 🔧 Technical Details

### Built With
- Vite.js - Build tool and development server
- Google Generative AI - AI model integration
- Markdown-it - Markdown parsing and rendering
- Highlight.js - Code syntax highlighting
- Typed.js - Typing animation effects

### Key Files
- `main.js`: Core application logic
- `extra.css`: Custom styling and animations
- `index.html`: Main HTML structure
- `style.css`: Base styling

### Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google AI Studio for providing the Gemini AI model
- The open-source community for various tools and libraries
- Contributors and testers who helped improve the application

## 📞 Support

For support, please:
1. Check the existing issues
2. Create a new issue with detailed information
3. Include steps to reproduce any problems
4. Provide relevant error messages and screenshots

---

Made with ❤️ by Rehan

## 📁 Project Structure

```
rrgpt/
├── src/
│   ├── assets/
│   ├── components/
│   ├── styles/
│   ├── utils/
│   ├── main.js
│   └── index.html
├── public/
├── prompt/              # AI Model Prompts Directory
│   ├── RRGPT prompt.txt  # Default RRGPT personality
│   └── DAN prompt.txt    # DAN personality variant
├── package.json
└── vite.config.js
```

## 🤖 AI Model Prompts

The `prompt/` directory contains personality prompts for different AI models. Each prompt file defines the behavior and characteristics of its respective AI personality.

### Available Prompts

- `RRGPT prompt.txt`: Default personality with helpful and professional responses
- `DAN prompt.txt`: Alternative personality with different interaction style

### Adding a New Model Prompt

To add a new AI personality:

1. Create a new text file in the `prompt/` directory (e.g., `prompt/CUSTOM prompt.txt`)
2. Write your personality prompt in the file
3. Update `main.js` to include your new model:
   ```javascript
   // In the model selector HTML:
   <select id="model-select">
     <option value="rrgpt">RRGPT</option>
     <option value="dan">DAN</option>
     <option value="custom">CUSTOM</option>  // Add your new model
   </select>

   // In the loadModelPrompt function:
   const promptFile = currentModel === 'rrgpt' 
     ? 'prompt/RRGPT prompt.txt' 
     : currentModel === 'dan'
     ? 'prompt/DAN prompt.txt'
     : 'prompt/CUSTOM prompt.txt';  // Add your new model path
   ```

4. Test the new personality by selecting it in the model dropdown

### Prompt Writing Guidelines

When creating a new personality prompt:

1. Be clear and specific about the AI's role and behavior
2. Include any special instructions or limitations
3. Define the tone and style of responses
4. Specify any particular areas of expertise
5. Include example interactions if helpful

