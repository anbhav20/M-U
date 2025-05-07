import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import useChat from '@/hooks/useChat';
import { 
  ConnectionPreference, 
  Gender,
  GenderPreference
} from '@shared/schema.js';
import { 
  ChatContainer, 
  ChatHeader, 
  ChatMessages, 
  ChatInput 
} from '@/components/TextChatComponents';

export default function TextChat() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Retrieve preferences from sessionStorage
  const storedPreference = sessionStorage.getItem('matchPreference') || ConnectionPreference.SameCountry;
  const storedGender = sessionStorage.getItem('gender') || Gender.PreferNotToSay;
  const storedGenderPreference = sessionStorage.getItem('genderPreference') || GenderPreference.Any;

  // Validate and cast preferences
  const matchPreference =
    Object.values(ConnectionPreference).includes(storedPreference)
      ? storedPreference
      : ConnectionPreference.SameCountry;
  const gender =
    Object.values(Gender).includes(storedGender)
      ? storedGender
      : Gender.PreferNotToSay;
  const genderPreference =
    Object.values(GenderPreference).includes(storedGenderPreference)
      ? storedGenderPreference
      : GenderPreference.Any;

  const {
    status,
    messages,
    isTyping,
    inputMessage,
    setInputMessage,
    sendMessage,
    findNextStranger,
    disconnect,
    error
  } = useChat({ matchPreference, gender, genderPreference });

  useEffect(() => {
    if (error) {
      toast({
        title: 'Connection Error',
        description: error,
        variant: 'destructive'
      });
    }
  }, [error, toast]);

  const handleEndChat = () => {
    disconnect();
    navigate('/');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() !== '') {
      // Send the message - this will trigger auto-scroll in the ChatMessages component
      sendMessage();
      
      // Focus on the input field after sending
      setTimeout(() => {
        const inputElement = document.querySelector('input[type="text"]');
        if (inputElement) {
          inputElement.focus();
        }
      }, 10);
    }
  };

  // Add a useEffect to handle viewport height for mobile
  React.useEffect(() => {
    // Fix for mobile browsers: set a CSS variable with the viewport height
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    // Set initial value
    setVh();
    
    // Update on resize and orientation change
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);
    
    return () => {
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
    };
  }, []);

  return (
    <div className="container mx-auto px-0 sm:px-4 py-0 sm:py-6 min-h-screen flex flex-col" 
         style={{ 
           // Use the CSS variable for height on mobile
           height: 'calc(var(--vh, 1vh) * 100)',
           // Prevent overscroll/bounce
           overscrollBehavior: 'none'
         }}>
      <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col">
        <ChatContainer>
          <ChatHeader
            status={status}
            onFindNext={findNextStranger}
            onEndChat={handleEndChat}
          />

          <ChatMessages
            messages={messages}
            status={status}
            isTyping={isTyping}
          />

          <ChatInput
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onSubmit={handleSendMessage}
            disabled={status !== 'connected'}
          />
        </ChatContainer>
      </div>
    </div>
  );
}