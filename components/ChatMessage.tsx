import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-6 animate-fadeIn ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] sm:max-w-[75%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        
        {/* Avatar / Name Label */}
        <div className={`flex items-center mb-1.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
            isUser ? 'bg-indigo-100 text-indigo-600 ml-2' : 'bg-amber-100 text-amber-700 mr-2'
          }`}>
             {isUser ? '我' : '大师'}
          </div>
          <span className="text-xs text-slate-400 font-medium">
             {isUser ? 'User' : '整活大师'}
          </span>
        </div>
        
        {/* Message Bubble */}
        <div
          className={`
            relative px-5 py-3.5 text-[15px] leading-7 rounded-2xl shadow-sm whitespace-pre-wrap transition-all duration-200
            ${isUser 
              ? 'bg-indigo-600 text-white rounded-tr-sm shadow-indigo-200' 
              : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm shadow-slate-200'
            }
          `}
        >
          {message.text}
        </div>
        
        {/* Timestamp */}
        <span className={`text-[10px] text-gray-300 mt-1.5 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;