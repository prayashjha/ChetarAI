import { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  MessageSquarePlus, Send, Mic, MicOff, Moon, Sun, Menu, X,
  Download, Trash2, Copy, Check, Image, ChevronLeft, ChevronRight,
  Sparkles, Code, BookOpen, Briefcase
} from 'lucide-react';

// Types
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  images?: string[];
  timestamp: number;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

// Utility functions
const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

const STORAGE_KEY = 'chetar_ai_chats';
const THEME_KEY = 'chetar_ai_theme';

// Load chats from localStorage
const loadChats = (): Chat[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Save chats to localStorage
const saveChats = (chats: Chat[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  } catch (e) {
    console.error('Failed to save chats:', e);
  }
};

// Suggestion cards data
const suggestions = [
  { icon: BookOpen, text: 'Kahani likho', prompt: 'Ek interesting short story likho Hindi mein, jisme ek moral ho.' },
  { icon: Image, text: 'Image banao - ek sher jungle me', prompt: 'Generate an image of a majestic lion in a dense green jungle, sunlight filtering through trees, photorealistic' },
  { icon: Code, text: 'Code help karo', prompt: 'Mujhe JavaScript mein ek simple todo app ka code likh ke do with explanation.' },
  { icon: Briefcase, text: 'Career advice do', prompt: 'Main ek college student hoon. Mujhe career guidance do - tech field mein kaise grow karun?' },
];

// System prompt for Chetar AI
const SYSTEM_PROMPT = `You are Chetar AI, a friendly and helpful AI assistant made by Prayash. You communicate in a warm Hinglish style (mix of Hindi and English). You are knowledgeable, creative, and always helpful.

Rules:
- Be friendly and conversational
- Use Hinglish naturally (Hindi + English mix)
- If user asks for an image, photo, tasveer, or picture - include [IMAGE: detailed English prompt] in your response
- Be concise but thorough
- Help with coding, writing, advice, and general questions
- Always be respectful and positive`;

// Code block component with copy button
function CodeBlock({ children, className }: { children: React.ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false);
  const code = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-3 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between bg-gray-800 dark:bg-gray-900 px-4 py-2 text-xs text-gray-400">
        <span className={className?.replace('language-', '') || 'code'}>{className?.replace('language-', '') || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition-colors"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="bg-gray-900 dark:bg-gray-950 p-4 overflow-x-auto text-sm">
        <code className="text-gray-100">{code}</code>
      </pre>
    </div>
  );
}

// Message component
function MessageBubble({ message, darkMode }: { message: Message; darkMode: boolean }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4 animate-fadeIn`}>
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
          C
        </div>
      )}
      
      {/* Message content */}
      <div className={`max-w-[80%] md:max-w-[70%] ${isUser ? 'ml-auto' : ''}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-blue-50 dark:bg-blue-900/30 text-gray-800 dark:text-gray-100'
              : 'bg-transparent text-gray-700 dark:text-gray-200'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const isInline = !match && !String(children).includes('\n');
                    if (isInline) {
                      return (
                        <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                          {children}
                        </code>
                      );
                    }
                    return <CodeBlock className={className}>{children}</CodeBlock>;
                  },
                  p({ children }) {
                    return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>;
                  },
                  ul({ children }) {
                    return <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>;
                  },
                  ol({ children }) {
                    return <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>;
                  },
                  h1({ children }) {
                    return <h1 className="text-xl font-bold mb-2">{children}</h1>;
                  },
                  h2({ children }) {
                    return <h2 className="text-lg font-bold mb-2">{children}</h2>;
                  },
                  h3({ children }) {
                    return <h3 className="text-base font-bold mb-1">{children}</h3>;
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
        
        {/* Images */}
        {message.images && message.images.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.images.map((img, idx) => (
              <div key={idx} className="relative group rounded-xl overflow-hidden shadow-lg">
                <img
                  src={img}
                  alt={`Generated ${idx + 1}`}
                  className="w-full max-w-md rounded-xl"
                  loading="lazy"
                />
                <a
                  href={img}
                  download={`chetar-ai-image-${idx + 1}.png`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Download size={16} className="text-gray-700 dark:text-gray-300" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  const [chats, setChats] = useState<Chat[]>(loadChats);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === 'dark';
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeChat = chats.find(c => c.id === activeChatId) || null;

  // Dark mode effect
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem(THEME_KEY, darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Save chats whenever they change
  useEffect(() => {
    saveChats(chats);
  }, [chats]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, displayedContent]);

  // Typewriter effect
  const typeText = useCallback((text: string, chatId: string, messageId: string) => {
    setIsTyping(true);
    setDisplayedContent('');
    let index = 0;
    
    const type = () => {
      if (index < text.length) {
        const chunk = text.slice(0, index + Math.min(3, text.length - index));
        setDisplayedContent(chunk);
        index += 3;
        typingTimeoutRef.current = setTimeout(type, 15);
      } else {
        setDisplayedContent(text);
        setIsTyping(false);
        // Update the chat message with full content
        setChats(prev => prev.map(chat => {
          if (chat.id === chatId) {
            return {
              ...chat,
              messages: chat.messages.map(msg =>
                msg.id === messageId ? { ...msg, content: text } : msg
              )
            };
          }
          return chat;
        }));
      }
    };
    type();
  }, []);

  // Cleanup typing timeout
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  // Extract image prompts from response
  const extractImagePrompts = (text: string): { cleanText: string; prompts: string[] } => {
    const regex = /\[IMAGE:\s*(.*?)\]/gi;
    const prompts: string[] = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      prompts.push(match[1].trim());
    }
    const cleanText = text.replace(regex, '').trim();
    return { cleanText, prompts };
  };

  // Check if message implies image request
  const impliesImageRequest = (text: string): boolean => {
    const keywords = ['image', 'photo', 'tasveer', 'picture', 'banao', 'generate', 'draw', 'paint', 'illustration', ' banao', ' chitra'];
    const lower = text.toLowerCase();
    return keywords.some(k => lower.includes(k));
  };

  // Send message to API
  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    let chatId = activeChatId;
    let currentChats = [...chats];

    // Create new chat if needed
    if (!chatId) {
      const newChat: Chat = {
        id: generateId(),
        title: userMessage.slice(0, 40) + (userMessage.length > 40 ? '...' : ''),
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      currentChats = [newChat, ...currentChats];
      chatId = newChat.id;
      setActiveChatId(chatId);
    }

    // Add user message
    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content: userMessage,
      timestamp: Date.now(),
    };

    currentChats = currentChats.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: [...chat.messages, userMsg],
          updatedAt: Date.now(),
        };
      }
      return chat;
    });
    setChats(currentChats);
    setInput('');
    setIsLoading(true);

    // Prepare messages for API
    const chatMessages = currentChats.find(c => c.id === chatId)!.messages;
    const apiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...chatMessages.map(m => ({ role: m.role, content: m.content })),
    ];

    try {
      // Call Pollinations text API
      const response = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'openai',
          messages: apiMessages,
        }),
      });

      if (!response.ok) throw new Error('API Error');

      const data = await response.json();
      let aiContent = data.choices?.[0]?.message?.content || 'Sorry, kuch galat ho gaya.';

      // Check for image generation
      const { cleanText, prompts: extractedPrompts } = extractImagePrompts(aiContent);
      let imagePrompts = extractedPrompts;

      // If no explicit [IMAGE] tag but message implies image request
      if (imagePrompts.length === 0 && impliesImageRequest(userMessage)) {
        imagePrompts = [userMessage];
      }

      // Generate images
      let images: string[] = [];
      if (imagePrompts.length > 0) {
        for (const prompt of imagePrompts.slice(0, 2)) {
          const encodedPrompt = encodeURIComponent(prompt);
          const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&enhance=true&model=flux`;
          images.push(imageUrl);
        }
      }

      // Create AI message
      const aiMsg: Message = {
        id: generateId(),
        role: 'assistant',
        content: cleanText || aiContent,
        images: images.length > 0 ? images : undefined,
        timestamp: Date.now(),
      };

      // Add AI message to chat
      setChats(prev => prev.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, aiMsg],
            updatedAt: Date.now(),
          };
        }
        return chat;
      }));

      // Typewriter effect
      typeText(cleanText || aiContent, chatId!, aiMsg.id);

    } catch (error) {
      console.error('API Error:', error);
      const errorMsg: Message = {
        id: generateId(),
        role: 'assistant',
        content: '🙏 Chetar thoda busy hai, fir se try karo! Error: Network issue ya API down ho sakta hai.',
        timestamp: Date.now(),
      };

      setChats(prev => prev.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, errorMsg],
            updatedAt: Date.now(),
          };
        }
        return chat;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input.trim());
  };

  // Handle key down (Shift+Enter for new line)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // New chat
  const newChat = () => {
    setActiveChatId(null);
    setInput('');
    setDisplayedContent('');
    inputRef.current?.focus();
  };

  // Delete chat
  const deleteChat = (chatId: string) => {
    setChats(prev => prev.filter(c => c.id !== chatId));
    if (activeChatId === chatId) {
      setActiveChatId(null);
    }
  };

  // Clear all chats
  const clearAllChats = () => {
    if (confirm('Sabhi chats delete karni hain?')) {
      setChats([]);
      setActiveChatId(null);
    }
  };

  // Export chat
  const exportChat = () => {
    if (!activeChat) return;
    const text = activeChat.messages
      .map(m => `[${m.role === 'user' ? 'You' : 'Chetar AI'}]: ${m.content}`)
      .join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chetar-chat-${activeChat.title.slice(0, 20)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Speech recognition
  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser. Try Chrome.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'hi-IN';

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      setInput(transcript);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  // Handle suggestion click
  const handleSuggestion = (prompt: string) => {
    setInput(prompt);
    sendMessage(prompt);
  };

  return (
    <div className={`h-full flex ${darkMode ? 'dark' : ''}`}>
      <div className="flex w-full h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} flex-shrink-0 transition-all duration-300 overflow-hidden border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col`}>
          <div className="p-4 flex flex-col h-full min-w-[256px]">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                C
              </div>
              <span className="font-semibold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Chetar AI
              </span>
            </div>

            {/* New Chat Button */}
            <button
              onClick={newChat}
              className="flex items-center gap-2 w-full px-4 py-3 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mb-4 text-sm font-medium"
            >
              <MessageSquarePlus size={18} />
              New Chat
            </button>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin">
              {chats.map(chat => (
                <div
                  key={chat.id}
                  className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-sm ${
                    chat.id === activeChatId
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                  onClick={() => { setActiveChatId(chat.id); setDisplayedContent(''); }}
                >
                  <MessageSquarePlus size={14} className="flex-shrink-0 opacity-50" />
                  <span className="truncate flex-1">{chat.title}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Bottom section */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
              {activeChat && (
                <button
                  onClick={exportChat}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-600 dark:text-gray-400 transition-colors"
                >
                  <Download size={16} />
                  Export Chat
                </button>
              )}
              {chats.length > 0 && (
                <button
                  onClick={clearAllChats}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-sm text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                  Clear All Chats
                </button>
              )}
              <div className="flex items-center gap-2 px-3 py-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                  P
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Prayash</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
              </button>
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-blue-500" />
                <span className="font-medium text-sm">Chetar AI</span>
                <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                  Free
                </span>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
            </button>
          </header>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            {!activeChat || activeChat.messages.length === 0 ? (
              // Welcome Screen
              <div className="max-w-3xl mx-auto flex flex-col items-center justify-center h-full">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg">
                    C
                  </div>
                  <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Namaste, Prayash
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Soch Se Zyada ✨
                  </p>
                </div>

                {/* Suggestion Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestion(suggestion.prompt)}
                      className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all text-left group"
                    >
                      <suggestion.icon size={20} className="text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors">
                        {suggestion.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Messages
              <div className="max-w-3xl mx-auto">
                {activeChat.messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} darkMode={darkMode} />
                ))}
                
                {/* Typing indicator */}
                {isLoading && !displayedContent && (
                  <div className="flex gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      C
                    </div>
                    <div className="flex gap-1 items-center py-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                )}

                {/* Typewriter content */}
                {isTyping && displayedContent && (
                  <div className="flex gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      C
                    </div>
                    <div className="max-w-[80%] md:max-w-[70%]">
                      <div className="rounded-2xl px-4 py-3 bg-transparent">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {displayedContent}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="px-4 pb-4 pt-2">
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
              <div className="flex items-end gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 border border-gray-200 dark:border-gray-700 focus-within:border-blue-400 dark:focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900/30 transition-all shadow-sm">
                {/* Mic button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2 rounded-full transition-colors flex-shrink-0 ${
                    isListening
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-500'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500'
                  }`}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>

                {/* Text input */}
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Chetar se kuch pucho..."
                  rows={1}
                  className="flex-1 bg-transparent border-none outline-none resize-none text-sm py-2 max-h-32 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  style={{ minHeight: '24px' }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                  }}
                />

                {/* Send button */}
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 disabled:opacity-30 disabled:hover:bg-blue-500 text-white transition-all flex-shrink-0"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
                Chetar AI by Prayash • Free & Open Source • Powered by Pollinations AI
              </p>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
