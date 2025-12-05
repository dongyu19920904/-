import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, ChatState } from './types';
import { sendMessageToGemini } from './services/geminiService';
import { INITIAL_GREETING } from './constants';
import ChatMessage from './components/ChatMessage';
import TypingIndicator from './components/TypingIndicator';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [chatState, setChatState] = useState<ChatState>('idle');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initial setup
  useEffect(() => {
    resetChat();
  }, []);

  const resetChat = () => {
    setMessages([
      {
        id: 'init-1',
        role: 'model',
        text: INITIAL_GREETING,
        timestamp: new Date(),
      },
    ]);
    setChatState('idle');
    setInputValue('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
  };

  const scrollToBottom = () => {
    // Add a small delay to ensure DOM update is complete and layout is recalculated
    setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatState]);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || chatState === 'loading') return;

    const userText = inputValue.trim();
    setInputValue('');
    
    // Reset textarea height
    if (inputRef.current) {
        inputRef.current.style.height = 'auto';
    }

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setChatState('loading');

    try {
      const aiResponseText = await sendMessageToGemini(messages, userText);

      const newAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: aiResponseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newAiMessage]);
      setChatState('idle');
    } catch (error) {
      console.error('Failed to send message:', error);
      setChatState('error');
    }
  }, [inputValue, chatState, messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(e.target.value);
      e.target.style.height = 'auto';
      e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  }

  return (
    <div className="flex flex-col h-full bg-slate-50/50 relative">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200/60 px-4 py-3 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-100 to-orange-100 flex items-center justify-center border border-amber-200/50 text-2xl shadow-sm">
                🤪
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h1 className="font-bold text-slate-800 text-base sm:text-lg leading-tight tracking-tight">
                辩论区整活大师
              </h1>
              <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <span>Gemini 3 Pro</span>
                <span className="w-0.5 h-0.5 bg-slate-300 rounded-full"></span>
                <span>专治不服</span>
              </p>
            </div>
          </div>
          
          <button 
            onClick={resetChat}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-all active:scale-95"
            title="开始新对话"
          >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 group-hover:-rotate-180 transition-transform duration-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            <span className="hidden sm:inline">重置</span>
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth scrollbar-thin scrollbar-thumb-slate-300">
        <div className="max-w-3xl mx-auto space-y-2">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          
          {chatState === 'loading' && <TypingIndicator />}
          
          {chatState === 'error' && (
            <div className="flex justify-center animate-fadeIn">
              <div className="text-center text-red-500 text-sm mt-4 bg-red-50 px-4 py-2 rounded-lg border border-red-100 shadow-sm">
                哎哟，连接断了。咱是不是网费忘交了？重试一下呗。
              </div>
            </div>
          )}
          
          {/* Spacer to push content above fixed footer. 
              Height needs to be > footer max height (approx 160px-200px) */}
          <div ref={messagesEndRef} className="h-48 w-full flex-shrink-0" />
        </div>
      </main>

      {/* Input Area */}
      <footer className="fixed bottom-0 w-full z-20 px-4 py-4 pointer-events-none">
        <div className="max-w-3xl mx-auto pointer-events-auto">
          <div className="bg-white/90 backdrop-blur-xl p-2 rounded-[2rem] border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-end gap-2 transition-shadow focus-within:shadow-[0_8px_40px_rgba(79,70,229,0.15)] focus-within:border-indigo-200">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="来，吐槽两句，或者随便聊聊..."
              rows={1}
              className="w-full bg-transparent border-0 focus:ring-0 text-slate-800 placeholder:text-slate-400 resize-none py-3 px-5 max-h-[140px] min-h-[48px] leading-6 text-sm sm:text-base"
              disabled={chatState === 'loading'}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || chatState === 'loading'}
              className={`
                mb-1 mr-1 p-3 rounded-full flex-shrink-0 transition-all duration-300 transform
                ${!inputValue.trim() || chatState === 'loading'
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 active:scale-95 hover:rotate-12'
                }
              `}
              aria-label="Send message"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 translate-x-0.5 -translate-y-0.5"
              >
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </div>
          <div className="text-center mt-2 opacity-60 hover:opacity-100 transition-opacity">
            <p className="text-[10px] text-slate-500 font-medium">
                Powered by Gemini 3.0 Pro · 本内容纯属娱乐
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;