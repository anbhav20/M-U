import React from 'react';
import { ChatMessage, ConnectionStatusType } from '@shared/schema';

interface ChatHeaderProps {
  status: ConnectionStatusType;
  onFindNext: () => void;
  onEndChat: () => void;
}

export function ChatHeader({ status, onFindNext, onEndChat }: ChatHeaderProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'bg-status-connected text-status-connected';
      case 'waiting': return 'bg-status-waiting text-status-waiting';
      default: return 'bg-status-error text-status-error';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected': return 'Connected';
      case 'waiting': return 'Looking for someone to chat...';
      default: return 'Disconnected';
    }
  };

  return (
    <div className="border-b p-4 flex justify-between items-center">
      <div className="flex items-center">
        <div className="mr-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
              <i className="fas fa-user"></i>
            </div>
            <span className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor().split(' ')[0]} rounded-full border-2 border-white`}></span>
          </div>
        </div>
        <div>
          <h3 className="font-medium">Stranger</h3>
          <div className={`flex items-center text-sm ${getStatusColor().split(' ')[1]}`}>
            <span>{getStatusText()}</span>
          </div>
        </div>
      </div>
      <div className="flex space-x-3">
        <button 
          onClick={onFindNext}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center"
          disabled={status === 'disconnected'}
        >
          <i className="fas fa-random mr-2"></i>
          <span>Next</span>
        </button>
        <button 
          onClick={onEndChat}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center"
        >
          <i className="fas fa-times mr-2"></i>
          <span>End</span>
        </button>
      </div>
    </div>
  );
}

interface ChatMessagesProps {
  messages: ChatMessage[];
  status: ConnectionStatusType;
  isTyping: boolean;
}

export function ChatMessages({ messages, status, isTyping }: ChatMessagesProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
      {/* Connection message */}
      {status === 'waiting' && (
        <div className="flex justify-center my-4">
          <div className="bg-gray-200 text-gray-600 text-sm py-1 px-3 rounded-full">
            Looking for someone to chat with you...
          </div>
        </div>
      )}

      {/* Connected message */}
      {status === 'connected' && messages.length === 0 && (
        <div className="flex justify-center my-4">
          <div className="bg-green-100 text-green-700 text-sm py-1 px-3 rounded-full">
            Connected! Say hello to your new friend.
          </div>
        </div>
      )}

      {/* Chat messages */}
      {messages.map((message, index) => (
        <div 
          key={index} 
          className={`chat-bubble ${
            message.sender === 'you' ? 'chat-bubble-you' : 'chat-bubble-stranger'
          }`}
        >
          <p>{message.content}</p>
        </div>
      ))}

      {/* Typing indicator */}
      {isTyping && (
        <div className="chat-bubble chat-bubble-stranger max-w-[100px]">
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
}

export function ChatInput({ value, onChange, onSubmit, disabled }: ChatInputProps) {
  return (
    <div className="border-t p-4">
      <form onSubmit={onSubmit} className="flex">
        <input 
          type="text" 
          placeholder="Type a message..." 
          className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
        <button 
          type="submit" 
          className={`${disabled ? 'bg-gray-400' : 'bg-primary hover:bg-blue-600'} text-white px-4 py-2 rounded-r-lg transition-colors`}
          disabled={disabled}
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
}

export function ChatContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-[80vh]">
      {children}
    </div>
  );
}
