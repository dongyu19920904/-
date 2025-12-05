import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex w-full mb-6 justify-start">
      <div className="max-w-[85%] flex flex-col items-start">
         <span className="text-xs text-gray-400 mb-1 px-1 ml-1">
          整活大师 (92年老哥)
        </span>
        <div className="bg-white px-4 py-4 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm flex items-center space-x-1.5 h-[50px]">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
