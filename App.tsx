import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, Role } from './types';
import { sendMessageToGemini } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import { WELCOME_MESSAGE } from './constants';
import { BrainCircuit, Trash2 } from 'lucide-react';

const STORAGE_KEY = 'second_brain_chat_history';

const App: React.FC = () => {
  // Initialize state from localStorage if available
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        // Parse and revive Date objects
        return JSON.parse(saved, (key, value) => {
           if (key === 'timestamp') return new Date(value);
           return value;
        });
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message if empty
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: uuidv4(),
          role: Role.MODEL,
          text: WELCOME_MESSAGE,
          timestamp: new Date(),
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: uuidv4(),
      role: Role.USER,
      text: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // We pass the current messages + the new user message to the service
      // The service will handle the API format
      const responseText = await sendMessageToGemini(messages, text);
      
      const botMsg: Message = {
        id: uuidv4(),
        role: Role.MODEL,
        text: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: uuidv4(),
        role: Role.MODEL,
        text: "Sorry, I encountered an issue processing that. Please try again.",
        timestamp: new Date(),
        isError: true
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Special handler to trigger the daily summary event
  const handleTriggerSummary = () => {
    handleSendMessage("[SYSTEM_EVENT: DAILY_SUMMARY_1800]");
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear the conversation history?")) {
      const initialMsg = {
        id: uuidv4(),
        role: Role.MODEL,
        text: WELCOME_MESSAGE,
        timestamp: new Date(),
      };
      setMessages([initialMsg]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([initialMsg]));
    }
  };

  return (
    // Use 100dvh (Dynamic Viewport Height) for mobile browsers to avoid address bar hiding content
    <div className="flex flex-col h-[100dvh] bg-slate-50 w-full overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <BrainCircuit size={18} />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-base leading-tight">Second Brain</h1>
            <p className="text-[10px] text-slate-500 font-medium">Content Strategy AI</p>
          </div>
        </div>
        <button 
          onClick={handleClearChat}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors active:scale-95"
          title="Clear History"
        >
          <Trash2 size={20} />
        </button>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto px-4 py-4 md:px-0 scroll-smooth">
        <div className="max-w-4xl mx-auto flex flex-col justify-end min-h-full">
            <div className="flex flex-col pb-2">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isLoading && (
                <div className="flex justify-start mb-6">
                   <div className="flex max-w-[85%] gap-3">
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white animate-pulse flex-shrink-0">
                        <BrainCircuit size={16} />
                      </div>
                      <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
        </div>
      </main>

      {/* Input Area */}
      <ChatInput 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading} 
        onTriggerSummary={handleTriggerSummary}
      />
    </div>
  );
};

export default App;