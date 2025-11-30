import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Loader2, Sparkles, FileText } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onTriggerSummary: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, onTriggerSummary }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // On mobile, Enter usually creates a new line, so we keep that behavior.
    // On desktop (Shift not pressed), we submit.
    if (e.key === 'Enter' && !e.shiftKey) {
      // Check if it's likely a mobile device (touch) to allow Enter for new lines if preferred,
      // but standard is Enter sends on desktop.
      // For simplicity: Always send on Enter unless Shift is held.
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [text]);

  return (
    // Add pb-safe for iPhone home indicator area
    <div className="bg-white border-t border-slate-200 px-4 py-3 md:px-8 md:py-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe flex-shrink-0 z-20">
      <div className="max-w-4xl mx-auto flex flex-col gap-2">
        
        {/* Helper Actions */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
           <button 
             onClick={onTriggerSummary}
             disabled={isLoading}
             className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full hover:bg-emerald-100 transition-colors border border-emerald-100 disabled:opacity-50 whitespace-nowrap active:scale-95"
           >
             <FileText size={14} />
             Generate Daily Summary
           </button>
           <div className="flex-1"></div>
        </div>

        {/* Input Field */}
        <div className="relative flex items-end gap-2 bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your thoughts..."
            className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-32 md:max-h-40 py-2 text-slate-800 placeholder-slate-400 leading-relaxed text-base"
            rows={1}
            disabled={isLoading}
            style={{ minHeight: '44px' }} // Ensure touch target size
          />
          <button
            onClick={() => handleSubmit()}
            disabled={!text.trim() || isLoading}
            className={`flex-shrink-0 p-3 rounded-lg mb-0.5 transition-all duration-200 active:scale-95 ${
              text.trim() && !isLoading
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <SendHorizontal size={20} />}
          </button>
        </div>
        
        <div className="text-center text-[10px] text-slate-400 pb-1">
          AI Content Strategist
        </div>
      </div>
    </div>
  );
};

export default ChatInput;