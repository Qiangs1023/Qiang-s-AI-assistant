import React from 'react';
import { Message, Role } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { User, Bot, AlertCircle } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'
        }`}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        {/* Bubble */}
        <div
          className={`relative px-4 py-3 rounded-2xl shadow-sm text-sm md:text-base ${
            isUser 
              ? 'bg-indigo-600 text-white rounded-tr-none' 
              : 'bg-white border border-gray-100 text-slate-800 rounded-tl-none'
          } ${message.isError ? 'border-red-300 bg-red-50' : ''}`}
        >
           {message.isError && (
               <div className="flex items-center gap-2 text-red-600 mb-2 font-semibold">
                   <AlertCircle size={14} />
                   <span>Error generating response</span>
               </div>
           )}

           {isUser ? (
             <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
           ) : (
             <MarkdownRenderer content={message.text} />
           )}
           
           <div className={`text-[10px] mt-1.5 opacity-60 text-right ${isUser ? 'text-indigo-100' : 'text-slate-400'}`}>
             {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
