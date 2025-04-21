import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  ChatMessage, 
  ConnectionStatusType, 
  ConnectionStatus, 
  ChatType,
  ConnectionPreferenceType
} from '@shared/schema';

interface UseChatProps {
  matchPreference: ConnectionPreferenceType;
}

export default function useChat({ matchPreference }: UseChatProps) {
  const [status, setStatus] = useState<ConnectionStatusType>(ConnectionStatus.Disconnected);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize socket connection
  useEffect(() => {
    // Create socket connection
    const socket = io('/chat', {
      path: '/api/socket.io',
      query: {
        preference: matchPreference,
        chatType: ChatType.Text
      }
    });
    
    socketRef.current = socket;

    // Set up event listeners
    socket.on('connect', () => {
      setStatus(ConnectionStatus.Waiting);
      setError(null);
    });

    socket.on('disconnect', () => {
      setStatus(ConnectionStatus.Disconnected);
    });

    socket.on('connect_error', (err) => {
      setError(`Connection error: ${err.message}`);
      setStatus(ConnectionStatus.Disconnected);
    });

    socket.on('matched', () => {
      setStatus(ConnectionStatus.Connected);
      setMessages([]);
    });

    socket.on('strangerDisconnected', () => {
      setStatus(ConnectionStatus.Waiting);
      setMessages(prev => [
        ...prev,
        {
          content: "Stranger has disconnected. Looking for a new match...",
          sender: "system",
          timestamp: Date.now()
        }
      ]);
    });

    socket.on('message', (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
      setIsTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    });

    socket.on('typing', () => {
      setIsTyping(true);
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set a timeout to hide the typing indicator after 3 seconds
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 3000);
    });

    socket.on('error', (message: string) => {
      setError(message);
    });

    // Clean up on unmount
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      socket.disconnect();
    };
  }, [matchPreference]);

  // Send typing indicator
  useEffect(() => {
    if (inputMessage && status === ConnectionStatus.Connected) {
      socketRef.current?.emit('typing');
    }
  }, [inputMessage, status]);

  // Send message handler
  const sendMessage = useCallback(() => {
    if (socketRef.current && status === ConnectionStatus.Connected && inputMessage.trim()) {
      const message: ChatMessage = {
        content: inputMessage.trim(),
        sender: 'you',
        timestamp: Date.now()
      };
      
      socketRef.current.emit('message', message);
      setMessages(prev => [...prev, message]);
      setInputMessage('');
    }
  }, [inputMessage, status]);

  // Find next stranger
  const findNextStranger = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('next');
      setStatus(ConnectionStatus.Waiting);
      setMessages([]);
    }
  }, []);

  // Disconnect
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    setStatus(ConnectionStatus.Disconnected);
  }, []);

  return {
    status,
    messages,
    isTyping,
    inputMessage,
    setInputMessage,
    sendMessage,
    findNextStranger,
    disconnect,
    error
  };
}
