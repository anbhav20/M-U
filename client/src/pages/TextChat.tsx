import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import useChat from '@/hooks/useChat';
import { 
  ConnectionPreference, 
  ConnectionPreferenceType,
  Gender,
  GenderType,
  GenderPreference,
  GenderPreferenceType
} from '@shared/schema';
import { 
  ChatContainer, 
  ChatHeader, 
  ChatMessages, 
  ChatInput 
} from '@/components/TextChatComponents';

export default function TextChat() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Get preferences from sessionStorage (set on the home page)
  const storedPreference = sessionStorage.getItem('matchPreference') || 'same-country';
  const storedGender = sessionStorage.getItem('gender') || Gender.PreferNotToSay;
  const storedGenderPreference = sessionStorage.getItem('genderPreference') || GenderPreference.Any;
  
  // Cast to proper types
  const matchPreference = (
    storedPreference === ConnectionPreference.SameCountry || 
    storedPreference === ConnectionPreference.AnyCountry
  ) ? storedPreference as ConnectionPreferenceType : ConnectionPreference.SameCountry;
  
  const gender = Object.values(Gender).includes(storedGender as GenderType) 
    ? storedGender as GenderType 
    : Gender.PreferNotToSay;
    
  const genderPreference = Object.values(GenderPreference).includes(storedGenderPreference as GenderPreferenceType)
    ? storedGenderPreference as GenderPreferenceType
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
  } = useChat({ 
    matchPreference,
    gender,
    genderPreference 
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Connection Error",
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const handleEndChat = () => {
    disconnect();
    navigate('/');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() !== '') {
      sendMessage();
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 h-screen flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full">
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
        </div>
      </div>
    </div>
  );
}
