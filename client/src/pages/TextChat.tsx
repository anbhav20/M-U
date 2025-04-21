import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import useChat from '@/hooks/useChat';
import { ConnectionPreference, ConnectionPreferenceType } from '@shared/schema';
import { 
  ChatContainer, 
  ChatHeader, 
  ChatMessages, 
  ChatInput 
} from '@/components/TextChatComponents';

export default function TextChat() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Get preference from sessionStorage (set on the home page)
  const storedPreference = sessionStorage.getItem('matchPreference') || 'same-country';
  // Cast to ConnectionPreferenceType
  const matchPreference = (
    storedPreference === ConnectionPreference.SameCountry || 
    storedPreference === ConnectionPreference.AnyCountry
  ) ? storedPreference as ConnectionPreferenceType : ConnectionPreference.SameCountry;

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
  } = useChat({ matchPreference });

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
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-[80vh]">
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
