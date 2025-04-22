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

  // Retrieve preferences from sessionStorage
  const storedPreference = sessionStorage.getItem('matchPreference') as ConnectionPreferenceType || ConnectionPreference.SameCountry;
  const storedGender = sessionStorage.getItem('gender') as GenderType || Gender.PreferNotToSay;
  const storedGenderPreference = sessionStorage.getItem('genderPreference') as GenderPreferenceType || GenderPreference.Any;

  // Validate and cast preferences
  const matchPreference: ConnectionPreferenceType =
    Object.values(ConnectionPreference).includes(storedPreference)
      ? storedPreference
      : ConnectionPreference.SameCountry;
  const gender: GenderType =
    Object.values(Gender).includes(storedGender)
      ? storedGender
      : Gender.PreferNotToSay;
  const genderPreference: GenderPreferenceType =
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() !== '') {
      // Send the message - this will trigger auto-scroll in the ChatMessages component
      sendMessage();
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 h-screen flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
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
