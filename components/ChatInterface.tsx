
import React, { useRef, useEffect } from 'react';
import { ChatMessage, Grade, Subject } from '../types';
import { Icons } from '../constants';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  grade: Grade | null;
  subject: Subject | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading,
  onSendMessage,
  grade,
  subject,
}) => {
  const [input, setInput] = React.useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading && grade && subject) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const isDisabled = !grade || !subject || isLoading;

  return (
    <div className="flex flex-col h-[calc(100vh-28rem)] min-h-[400px] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Messages area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/30"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center px-4">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <Icons.Bot />
            </div>
            <p className="text-lg font-medium text-slate-600">How can I help you today?</p>
            <p className="text-sm mt-1">Pick a grade and subject, then ask me anything!</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[85%] sm:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
              }`}>
                {msg.role === 'user' ? <Icons.User /> : <Icons.Bot />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
              }`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                <Icons.Bot />
              </div>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              !grade ? "Please select a grade first..." :
              !subject ? "Please select a subject first..." :
              "Ask your academic question here..."
            }
            disabled={isDisabled}
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={isDisabled || !input.trim()}
            className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icons.Send />
          </button>
        </form>
        {!grade || !subject ? (
          <p className="mt-2 text-[10px] text-amber-600 font-medium text-center uppercase tracking-wider">
            Selection Required: Choose a grade and subject above to start learning
          </p>
        ) : (
          <p className="mt-2 text-[10px] text-slate-400 text-center uppercase tracking-wider">
            Powered by EduGenie AI for {grade} • {subject}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
