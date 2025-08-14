import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { 
  ConnectionStatus, 
  ChatType
} from '../../../shared/schema.js';

/**
 * Custom hook for chat functionality
 * @param {Object} props
 * @param {string} props.matchPreference - The match preference (same country or any)
 * @param {string} props.gender - The user's gender
 * @param {string} props.genderPreference - The user's gender preference for matching
 * @returns {Object} Chat state and functions
 */
export default function useChat({ matchPreference, gender, genderPreference }) {
  const [status, setStatus] = useState(ConnectionStatus.Disconnected);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    // Create socket connection
    const socket = io('/chat', {
      path: '/api/socket.io',
      query: {
        preference: matchPreference,
        gender: gender,
        genderPreference: genderPreference,
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

    socket.on('message', (message) => {
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

    socket.on('error', (message) => {
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
      const message = {
        content: inputMessage.trim(),
        sender: 'you',
        timestamp: Date.now()
      };
      
      // Send message to server
      socketRef.current.emit('message', message);
      
      // Add message to local state (this will trigger auto-scroll in the component)
      setMessages(prev => [...prev, message]);
      
      // Clear input field
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