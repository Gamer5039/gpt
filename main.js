import { GoogleGenerativeAI } from "@google/generative-ai";
import md from "markdown-it";
import Typed from 'typed.js';

// Initialize chat history storage
let chatSessions = JSON.parse(localStorage.getItem('rrgptChatSessions')) || [];
let currentSessionId = Date.now().toString();
let darkMode = localStorage.getItem('darkMode') === 'true';
let isGenerating = false;
let controller = null; // AbortController for stopping AI responses
let currentModel = localStorage.getItem('currentModel') || 'rrgpt';
let modelPrompt = ''; // Store the current model's prompt

// Function to load model prompt
async function loadModelPrompt() {
  try {
<<<<<<< HEAD
    const promptFile = currentModel === 'rrgpt' ? 'prompt/RRGPT prompt.txt' : 'prompt/DAN prompt.txt';
    const response = await fetch(promptFile);
    modelPrompt = await response.text();
=======
    // Try multiple possible paths
    const paths = [
      `/prompt/${currentModel === 'rrgpt' ? 'RRGPT prompt.txt' : 'DAN prompt.txt'}`,
      `prompt/${currentModel === 'rrgpt' ? 'RRGPT prompt.txt' : 'DAN prompt.txt'}`,
      `assets/prompt/${currentModel === 'rrgpt' ? 'RRGPT prompt.txt' : 'DAN prompt.txt'}`,
      `/${currentModel === 'rrgpt' ? 'RRGPT prompt.txt' : 'DAN prompt.txt'}`
    ];
    
    let modelPrompt = null;
    for (const path of paths) {
      try {
        console.log(`Trying to load prompt from: ${path}`);
        const response = await fetch(path);
        if (response.ok) {
          modelPrompt = await response.text();
          console.log(`Successfully loaded prompt from ${path}`);
          break;
        } else {
          console.log(`Failed to load prompt from ${path}: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.log(`Failed to load prompt from ${path}:`, error);
      }
    }
    
    if (!modelPrompt) {
      throw new Error('Failed to load prompt from any path');
    }
    
>>>>>>> c550e1a2c0100f2bc9bd64310e7b1369c43a83f8
    return modelPrompt;
  } catch (error) {
    console.error('Error loading model prompt:', error);
    return null;
  }
}

// Function to start chat
function startChat() {
  document.getElementById('first-main').style.display = 'none';
  document.getElementById('second-main').style.display = 'flex';
  
  // Create a new chat session
  createNewSession();
  
  // Initialize with model prompt
  initializeWithModelPrompt();
}

document.addEventListener('DOMContentLoaded', async function () {
  // Apply dark mode if previously enabled
  if (darkMode) {
    document.body.classList.add('dark-mode');
    document.getElementById('darkModeButton').innerHTML = '<i class="fas fa-sun"></i>';
  }
  
  // Load initial model prompt
  await loadModelPrompt();
  
  // Initialize typed.js animation
  try {
    const textElement = document.querySelector('.text');
    if (textElement) {
      new Typed(textElement, {
        strings: ["Let's create", "Let's brainstorm", "Let's go", "RRGPT", "Let's explore", "Let's collaborate", "Let's invent", "RRGPT", "Let's design", "Let's chit-chat", "Let's discover", "RRGPT"],
        typeSpeed: 12,
        backSpeed: 12,
        backDelay: 1500,
        loop: true
      });
    }
  } catch (error) {
    console.error('Error initializing Typed.js:', error);
  }
  
  // Initialize model selector
  initModelSelector();
  
  // Initialize other handlers
  initHistorySidebar();
  initDarkMode();
  initNewChat();
  initStopButton();
});

// Initialize stop button functionality
function initStopButton() {
  const stopButton = document.getElementById('stopButton');
  stopButton.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (controller) {
      controller.abort();
      controller = null;
    }
    
    // Reset the button state
    const sendButton = document.getElementById('sendButton');
    sendButton.classList.remove('sending');
    isGenerating = false;
    
    console.log('AI response stopped by user');
  });
}

// Initialize dark mode toggle
function initDarkMode() {
  const darkModeButton = document.getElementById('darkModeButton');
  if (darkModeButton) {
    darkModeButton.addEventListener('click', function() {
      document.body.classList.toggle('dark-mode');
      darkMode = document.body.classList.contains('dark-mode');
      localStorage.setItem('darkMode', darkMode);
      
      // Update icon
      this.innerHTML = darkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
  }
}

// Initialize history sidebar functionality
function initHistorySidebar() {
  const historyButton = document.getElementById('historyButton');
  const historySidebar = document.getElementById('historySidebar');
  const closeHistory = document.getElementById('closeHistory');
  const clearHistory = document.getElementById('clearHistory');
  
  if (!historyButton || !historySidebar || !closeHistory || !clearHistory) {
    console.error('History elements not found');
    return;
  }
  
  // Toggle history sidebar
  historyButton.addEventListener('click', function() {
    historySidebar.classList.toggle('show-history');
  });
  
  // Close history sidebar
  closeHistory.addEventListener('click', function() {
    historySidebar.classList.remove('show-history');
  });
  
  // Clear all history
  clearHistory.addEventListener('click', function() {
    if (confirm("Are you sure you want to clear all chat history?")) {
      chatSessions = [];
      localStorage.setItem('rrgptChatSessions', JSON.stringify([]));
      updateHistoryList();
    }
  });
  
  // Load existing history
  updateHistoryList();
}

// Initialize new chat functionality
function initNewChat() {
  const newChatButton = document.getElementById('newChatButton');
  if (newChatButton) {
    newChatButton.addEventListener('click', async function() {
      if (isGenerating) {
        if (!confirm("A response is currently generating. Start a new chat anyway?")) {
          return;
        }
        if (controller) controller.abort();
      }
      
      // Create new session
      createNewSession();
      
      // Clear chat container and history
      const chatContainer = document.getElementById('chat-container');
      if (chatContainer) {
        chatContainer.innerHTML = '';
      }
      history = [];
      
      // Initialize with model prompt
      await initializeWithModelPrompt();
      
      // Reset states
      const sendButton = document.getElementById('sendButton');
      if (sendButton) {
        sendButton.classList.remove('sending');
      }
      isGenerating = false;
      
      // Focus input
      const promptInput = document.getElementById('prompt');
      if (promptInput) {
        promptInput.focus();
      }
    });
  }
}

// Initialize model selector functionality
function initModelSelector() {
  const modelSelect = document.getElementById('model-select');
  modelSelect.value = currentModel;
  
  modelSelect.addEventListener('change', async function() {
    if (isGenerating) {
      if (confirm("A response is currently generating. Change model anyway?")) {
        if (controller) controller.abort();
      } else {
        modelSelect.value = currentModel;
        return;
      }
    }
    
    currentModel = this.value;
    localStorage.setItem('currentModel', currentModel);
    
    // Load new model prompt
    await loadModelPrompt();
    
    // Create a new chat session
    createNewSession();
    
    // Clear chat container and history
    const chatContainer = document.getElementById('chat-container');
    chatContainer.innerHTML = '';
    history = [];
    
    // Initialize with new model prompt
    await initializeWithModelPrompt();
  });
}

// Function to initialize the AI with the selected model's prompt
async function initializeWithModelPrompt() {
  try {
    if (!modelPrompt) {
      await loadModelPrompt();
    }

    const chat = await model.startChat();
    const result = await chat.sendMessage(modelPrompt);
    const response = await result.response;
    const text = await response.text();
    
    // Store this initialization in history
    history = [
      {
        role: "user",
        parts: [{ text: modelPrompt }]
      },
      {
        role: "model",
        parts: [{ text: text }]
      }
    ];
    
    // Display the initial AI response
    const chatContainer = document.getElementById('chat-container');
    chatContainer.innerHTML = aiDiv(text, 0);
    
    console.log(`${currentModel.toUpperCase()} initialized with personality prompt`);
  } catch (error) {
    console.error("Error initializing with model prompt:", error);
  }
}

// Update the redirectButton event listener
const redirectButton = document.getElementById('redirectButton');
if (redirectButton) {
  redirectButton.addEventListener('click', startChat);
}

// Create a new chat session
function createNewSession() {
  currentSessionId = Date.now().toString();
  const newSession = {
    id: currentSessionId,
    name: `Chat ${chatSessions.length + 1}`,
    messages: [],
    timestamp: new Date().toISOString(),
    model: currentModel // Store the model type with the session
  };
  
  chatSessions.push(newSession);
  saveSessionsToStorage();
  updateHistoryList();
}

// Update history list in sidebar
function updateHistoryList() {
  const historyList = document.getElementById('historyList');
  historyList.innerHTML = '';
  
  if (chatSessions.length === 0) {
    historyList.innerHTML = '<div class="empty-history">No chat history yet</div>';
    return;
  }
  
  // Sort sessions by most recent first
  chatSessions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  chatSessions.forEach(session => {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    if (session.id === currentSessionId) {
      historyItem.classList.add('active');
    }
    
    // Format timestamp
    const date = new Date(session.timestamp);
    const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    historyItem.innerHTML = `
      <div class="history-item-title">${session.name}</div>
      <div class="history-item-date">${formattedDate}</div>
    `;
    
    historyItem.addEventListener('click', () => loadChatSession(session.id));
    historyList.appendChild(historyItem);
  });
}

// Load a specific chat session
async function loadChatSession(sessionId) {
  // Check if currently generating
  if (isGenerating) {
    if (confirm("A response is currently generating. Switch to a different chat anyway?")) {
      if (controller) controller.abort();
    } else {
      return;
    }
  }

  const session = chatSessions.find(s => s.id === sessionId);
  if (!session) return;
  
  currentSessionId = sessionId;
  
  // Set the correct model for the session
  if (session.model) {
    currentModel = session.model;
    const modelSelect = document.getElementById('model-select');
    modelSelect.value = currentModel;
  }
  
  // Clear chat container
  const chatContainer = document.getElementById('chat-container');
  chatContainer.innerHTML = '';
  
  // Reset history
  history = [];
  
  // If this is a new session or empty session, initialize with model prompt
  if (session.messages.length === 0) {
    try {
      const promptFile = currentModel === 'rrgpt' ? 'prompt/RRGPT prompt.txt' : 'prompt/DAN prompt.txt';
      const response = await fetch(promptFile);
      const modelPrompt = await response.text();
      await initializeWithModelPrompt();
    } catch (error) {
      console.error('Error loading model prompt:', error);
    }
  } else {
    // Reload messages
    session.messages.forEach(msg => {
      if (msg.role === 'user') {
        chatContainer.innerHTML += userDiv(msg.content);
        history.push({
          role: "user",
          parts: [{ text: msg.content }]
        });
      } else if (msg.role === 'ai') {
        const uniqueId = history.length;
        chatContainer.innerHTML += aiDiv(msg.content, uniqueId);
        history.push({
          role: "model",
          parts: [{ text: msg.content }]
        });
      }
    });
  }
  
  // Update active state in sidebar
  const historyItems = document.querySelectorAll('.history-item');
  historyItems.forEach(item => {
    item.classList.remove('active');
    if (item.querySelector('.history-item-title').textContent === session.name) {
      item.classList.add('active');
    }
  });
  
  // Close sidebar after selection on mobile
  document.getElementById('historySidebar').classList.remove('show-history');
  
  // Reset the button state
  const sendButton = document.getElementById('sendButton');
  sendButton.classList.remove('sending');
  isGenerating = false;
  
  // Scroll to bottom
  scrollToBottom();
  
  // Focus on the input
  document.getElementById('prompt').focus();
}

// Save chat sessions to localStorage
function saveSessionsToStorage() {
  localStorage.setItem('rrgptChatSessions', JSON.stringify(chatSessions));
}

// Function to add a message to the current session
function addMessageToSession(role, content) {
  const session = chatSessions.find(s => s.id === currentSessionId);
  if (!session) return;
  
  session.messages.push({
    role: role,
    content: content,
    timestamp: new Date().toISOString()
  });
  
  saveSessionsToStorage();
}

const genAI = new GoogleGenerativeAI(`${import.meta.env.VITE_API_KEY}`);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

let history = [];

// Detect code block pattern to properly format it
function formatCodeBlocks(text) {
  const markdownParser = md({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value;
        } catch (error) {
          console.error("Error highlighting: ", error);
        }
      }
      return hljs.highlightAuto(str).value;
    }
  });

  // Enable all markdown features
  markdownParser.enable([
    'emphasis',
    'strikethrough',
    'backticks',
    'blockquote',
    'list',
    'table',
    'link',
    'image'
  ]);

  // First parse with markdown-it
  let formatted = markdownParser.render(text);
  
  // Add copy button to all code blocks
  formatted = formatted.replace(/<pre><code class="language-([^"]+)">([\s\S]*?)<\/code><\/pre>/g, function(match, language, content) {
    // Store the original unescaped content for copying
    const originalContent = content
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, "/");
    
    return `
      <div class="code-block-container">
        <div class="code-block-header">
          <span class="code-block-language">${language}</span>
          <button class="copy-code-button" data-code="${encodeURIComponent(originalContent)}">
            <i class="fas fa-copy"></i> Copy
          </button>
          <div class="copy-success-message">Copied!</div>
        </div>
        <pre><code class="language-${language}">${content}</code></pre>
      </div>
    `;
  });
  
  return formatted;
}

// Initialize copy button functionality
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-code-button');
  copyButtons.forEach(button => {
    button.addEventListener('click', function() {
      const code = decodeURIComponent(this.getAttribute('data-code'));
      // Create a temporary textarea to decode HTML entities
      const textarea = document.createElement('textarea');
      textarea.innerHTML = code;
      const decodedCode = textarea.value;
      
      navigator.clipboard.writeText(decodedCode).then(() => {
        const successMessage = this.parentElement.querySelector('.copy-success-message');
        successMessage.classList.add('show');
        setTimeout(() => {
          successMessage.classList.remove('show');
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  });
}

async function getResponse(prompt) {
  try {
    // Create an AbortController to enable stopping the response
    controller = new AbortController();
    const signal = controller.signal;
    
    const chat = await model.startChat({ history: history });
    
    // Set up the request to be cancellable
    const result = await chat.sendMessage(prompt, {
      signal: signal
    });
    
    const response = await result.response;
    const text = await response.text();
    
    // Reset controller after response is complete
    controller = null;
    
    return text;
  } catch (error) {
    if (error.name === 'AbortError') {
      return "Response generation was stopped.";
    }
    
    console.error("Error getting AI response. Please reload page and try again later. Error:", error);
    throw new Error("Failed to get response from AI. Please reload page and try again later.");
  }
}

export const userDiv = (data) => {
  return `
  <!-- User Chat -->
  <div class="flex items-center gap-2 justify-end fit-content w-auto max-w-full user-message animate-fade-in">
    <p class="text-black p-1"><span class="font-bold">You</span><br>
      ${data}
    </p>
    <img
      src="user.jpeg"
      alt="user icon"
      class="w-10 h-10 rounded-full"
    />
  </div>
  `;
};

export const aiDiv = (data, id) => {
  const modelName = currentModel.toUpperCase();
  
  // For empty initial messages (when starting typing animation)
  if (!data) {
    return `
    <!-- AI Chat -->
    <div id="ai-response-container-${id}" class="flex gap-2 justify-start items-start w-full overflow-hidden whitespace-normal break-words ai-message animate-fade-in">
      <img src="chatGPT.png" alt="${modelName} icon" class="w-10 h-10 rounded-full" />
      <div id="ai-response-${id}" class="text-black p-1">
          <span class="font-bold">${modelName}</span><br>
          <span id="ai-response-text-${id}"></span>
          <span id="cursor-${id}" class="circle-cursor"></span>
      </div>
    </div>
    `;
  }
  
  // For already formatted messages (from history)
  const formattedData = formatCodeBlocks(data);
  
  return `
  <!-- AI Chat -->
  <div id="ai-response-container-${id}" class="flex gap-2 justify-start items-start w-full overflow-hidden whitespace-normal break-words ai-message">
    <img src="chatGPT.png" alt="${modelName} icon" class="w-10 h-10 rounded-full" />
    <div id="ai-response-${id}" class="text-black p-1">
        <span class="font-bold">${modelName}</span><br>
        <span id="ai-response-text-${id}">${formattedData}</span>
    </div>
  </div>
  `;
};

function scrollToBottom() {
  const chatArea = document.getElementById("chat-container");
  chatArea.scrollTop = chatArea.scrollHeight;
}

function appendCharacterByCharacter(text, id) {
  const aiResponseContainer = document.getElementById(`ai-response-text-${id}`);
  const cursor = document.getElementById(`cursor-${id}`);
  
  // Handle interruption
  if (text === "Response generation was stopped.") {
    aiResponseContainer.innerHTML = "<em>Response generation was stopped.</em>";
    if (cursor) cursor.style.display = 'none';
    return;
  }
  
  let formattedText = '';
  let currentIndex = 0;
  let inCodeBlock = false;
  let codeBlockContent = '';
  let codeLanguage = '';
  let buffer = '';
  
  // Process text to properly handle code blocks
  function processNextChunk() {
    if (currentIndex >= text.length) {
      // Final formatting once all text is processed
      if (inCodeBlock) {
        // Close any open code block
        const formattedCodeBlock = `
          <div class="code-block-container">
            <div class="code-block-header">
              <span class="code-block-language">${codeLanguage || 'plain'}</span>
              <button class="copy-code-button" data-code="${encodeURIComponent(codeBlockContent)}">
                <i class="fas fa-copy"></i> Copy
              </button>
              <div class="copy-success-message">Copied!</div>
            </div>
            <pre><code class="language-${codeLanguage || 'plaintext'}">${codeBlockContent}</code></pre>
          </div>
        `;
        formattedText += formattedCodeBlock;
      } else if (buffer) {
        // Add any remaining buffer
        formattedText += md().render(buffer);
      }
      
      aiResponseContainer.innerHTML = formattedText;
      if (cursor) cursor.style.display = 'none';
      
      // Apply syntax highlighting to code blocks
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
      
      // Initialize copy buttons
      initCopyButtons();
      
      scrollToBottom();
      return;
    }
    
    // Process text character by character, looking for code blocks
    const currentChar = text[currentIndex];
    const nextTwoChars = text.substr(currentIndex, 3);
    
    if (!inCodeBlock && nextTwoChars === '```') {
      // Start of a code block
      inCodeBlock = true;
      
      // Render any buffered markdown before the code block
      if (buffer) {
        formattedText += md().render(buffer);
        buffer = '';
      }
      
      // Find the language (if specified)
      const languageMatch = text.substr(currentIndex + 3).match(/^([a-zA-Z0-9_+-]+)?\n/);
      if (languageMatch) {
        codeLanguage = languageMatch[1] || 'plaintext';
        currentIndex += 3 + codeLanguage.length + 1; // Skip ```language\n
      } else {
        codeLanguage = 'plaintext';
        currentIndex += 3; // Skip ```
      }
      
      codeBlockContent = '';
      
      // Add code generation animation class
      const codeBlock = document.createElement('div');
      codeBlock.className = 'code-block-container code-generating';
      codeBlock.innerHTML = `
        <div class="code-block-header">
          <span class="code-block-language">${codeLanguage || 'plain'}</span>
          <button class="copy-code-button" data-code="${encodeURIComponent(codeBlockContent)}">
            <i class="fas fa-copy"></i> Copy
          </button>
          <div class="copy-success-message">Copied!</div>
        </div>
        <pre><code class="language-${codeLanguage || 'plaintext'}">${codeBlockContent}</code></pre>
      `;
      aiResponseContainer.appendChild(codeBlock);
    } else if (inCodeBlock && nextTwoChars === '```') {
      // End of a code block
      inCodeBlock = false;
      
      // Remove code generation animation class
      const lastCodeBlock = aiResponseContainer.querySelector('.code-generating');
      if (lastCodeBlock) {
        lastCodeBlock.classList.remove('code-generating');
      }
      
      // Format and add the code block
      const formattedCodeBlock = `
        <div class="code-block-container">
          <div class="code-block-header">
            <span class="code-block-language">${codeLanguage || 'plain'}</span>
            <button class="copy-code-button" data-code="${encodeURIComponent(codeBlockContent)}">
              <i class="fas fa-copy"></i> Copy
            </button>
            <div class="copy-success-message">Copied!</div>
          </div>
          <pre><code class="language-${codeLanguage || 'plaintext'}">${codeBlockContent}</code></pre>
        </div>
      `;
      
      formattedText += formattedCodeBlock;
      
      // Apply syntax highlighting to the newly added code block
      setTimeout(() => {
        const allCodeBlocks = document.querySelectorAll('pre code');
        const lastCodeBlock = allCodeBlocks[allCodeBlocks.length - 1];
        if (lastCodeBlock) {
          hljs.highlightElement(lastCodeBlock);
        }
        
        // Initialize copy buttons
        initCopyButtons();
        
        scrollToBottom();
      }, 0);
      
      currentIndex += 3; // Skip ```
    } else if (inCodeBlock) {
      // Inside a code block
      codeBlockContent += escapeHTML(currentChar);
      currentIndex++;
      
      // Update the code block content
      const lastCodeBlock = aiResponseContainer.querySelector('.code-generating');
      if (lastCodeBlock) {
        const codeElement = lastCodeBlock.querySelector('code');
        if (codeElement) {
          codeElement.textContent = codeBlockContent;
        }
      }
    } else {
      // Regular text
      buffer += currentChar;
      currentIndex++;
    }
    
    // Update display and scroll
    if (!inCodeBlock) {
      aiResponseContainer.innerHTML = formattedText + (buffer ? md().render(buffer) : '');
    }
    scrollToBottom();
    
    // Continue processing with faster animation speed
    setTimeout(processNextChunk, 4);
  }
  
  // Start processing
  processNextChunk();
}

// Helper function to escape HTML in code blocks
function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Add textarea auto-resize functionality
document.addEventListener('DOMContentLoaded', function() {
  const textarea = document.getElementById('prompt');
  
  // Auto-resize function
  function autoResize() {
    textarea.style.height = 'auto';
    let newHeight = Math.min(textarea.scrollHeight, 150); // Max height of 150px
    textarea.style.height = newHeight + 'px';
  }
  
  // Apply on input
  textarea.addEventListener('input', autoResize);
  
  // Also apply when window is resized
  window.addEventListener('resize', autoResize);
});

async function handleSubmit(event) {
  event.preventDefault();

  if (isGenerating) {
    console.log("Already generating a response");
    return;
  }

  let userMessage = document.getElementById("prompt");
  const chatArea = document.getElementById("chat-container");
  const sendButton = document.getElementById("sendButton");

  var prompt = userMessage.value.trim();
  if (prompt === "") {
    return;
  }

  // Update button state
  sendButton.classList.add('sending');
  isGenerating = true;
  
  console.log("user message", prompt);

  chatArea.innerHTML += userDiv(prompt);
  userMessage.value = "";
  
  // Reset textarea height
  userMessage.style.height = 'auto';

  // Add user message to current session
  addMessageToSession('user', prompt);

  const uniqueId = history.length;

  chatArea.innerHTML += aiDiv("", uniqueId);

  scrollToBottom();

  try {
    const aiResponse = await getResponse(prompt);
    
    appendCharacterByCharacter(aiResponse, uniqueId);

    // Add AI response to current session
    addMessageToSession('ai', aiResponse);

    let newUserRole = {
      role: "user",
      parts: [{ text: prompt }],
    };
    let newAIRole = {
      role: "model",
      parts: [{ text: aiResponse }],
    };

    history.push(newUserRole);
    history.push(newAIRole);

    // Reset button state
    setTimeout(() => {
      sendButton.classList.remove('sending');
      isGenerating = false;
    }, 500);
    
    console.log("Response complete");
  } catch (error) {
    console.error(error);
    const errorMessage = "An Error occurred. Please reload page and try again later.";
    appendCharacterByCharacter(errorMessage, uniqueId);
    
    // Reset button state
    sendButton.classList.remove('sending');
    isGenerating = false;
  }
}

const chatForm = document.getElementById("chat-form");
chatForm.addEventListener("submit", handleSubmit);

// Handle Enter key (but allow Shift+Enter for new lines)
document.getElementById('prompt').addEventListener("keydown", function(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    handleSubmit(new Event('submit'));
  }
});

// Handle click on AI response to stop generation
document.getElementById('chat-container').addEventListener('click', function(event) {
  if (isGenerating && event.target.closest('.ai-message')) {
    if (controller) {
      controller.abort();
      controller = null;
    }
    
    // Reset the button state
    const sendButton = document.getElementById('sendButton');
    sendButton.classList.remove('sending');
    isGenerating = false;
    
    console.log('AI response stopped by clicking on message');
  }
});
