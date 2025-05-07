import React from 'react';

export function ChatHeader({ status, onFindNext, onEndChat }) {
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
    <div className="border-b p-3 sm:p-4 flex justify-between items-center">
      <div className="flex items-center">
        <div className="mr-2 sm:mr-3">
          <div className="relative">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
              <i className="fas fa-user"></i>
            </div>
            <span className={`absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 ${getStatusColor().split(' ')[0]} rounded-full border-2 border-white`} />
          </div>
        </div>
        <div>
          <h3 className="font-medium text-sm sm:text-base">Stranger</h3>
          <div className={`flex items-center text-xs sm:text-sm ${getStatusColor().split(' ')[1]}`}>
            <span>{getStatusText()}</span>
          </div>
        </div>
      </div>
      <div className="flex space-x-2 sm:space-x-3">
        <button
          onClick={onFindNext}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 sm:px-4 py-1 sm:py-2 rounded-lg flex items-center text-xs sm:text-sm"
          disabled={status === 'disconnected'}
        >
          <i className="fas fa-random mr-1 sm:mr-2"></i>
          <span className="hidden xs:inline">Next</span>
        </button>
        <button
          onClick={onEndChat}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 sm:px-4 py-1 sm:py-2 rounded-lg flex items-center text-xs sm:text-sm"
        >
          <i className="fas fa-times mr-1 sm:mr-2"></i>
          <span className="hidden xs:inline">End</span>
        </button>
      </div>
    </div>
  );
}

export function ChatMessages({ messages, status, isTyping }) {
  const messagesContainerRef = React.useRef(null);
  const prevMessagesLengthRef = React.useRef(messages.length);
  
  // Function to scroll to bottom of the container
  const scrollToBottom = (smooth = true) => {
    if (messagesContainerRef.current) {
      // On mobile, we want to use 'auto' behavior to avoid issues with the keyboard
      const isMobile = window.innerWidth <= 768;
      const scrollBehavior = isMobile ? 'auto' : (smooth ? 'smooth' : 'auto');
      
      const scrollOptions = { 
        top: messagesContainerRef.current.scrollHeight,
        behavior: scrollBehavior
      };
      messagesContainerRef.current.scrollTo(scrollOptions);
    }
  };

  // Scroll to bottom when user sends a message
  React.useEffect(() => {
    // Check if new messages were added
    if (messages.length > prevMessagesLengthRef.current) {
      // Get the last message
      const lastMessage = messages[messages.length - 1];
      
      // If the last message is from "you", scroll to bottom immediately
      if (lastMessage?.sender === 'you') {
        // Use setTimeout to ensure this happens after the DOM update
        setTimeout(() => {
          scrollToBottom();
        }, 0);
      }
    }
    
    // Update the previous messages length
    prevMessagesLengthRef.current = messages.length;
  }, [messages]);
  
  // Initial scroll to bottom when chat first connects
  React.useEffect(() => {
    if (status === 'connected' && messages.length === 0) {
      // Only scroll to bottom on initial connection
      scrollToBottom();
    }
  }, [status, messages.length]);

  return (
    <div
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto p-4"
    >
      {/* Connection & initial messages */}
      {status === 'waiting' && (
        <div className="flex justify-center my-4">
          <div className="bg-gray-200 text-gray-600 text-sm py-1 px-3 rounded-full">
            Looking for someone to chat with you...
          </div>
        </div>
      )}
      {status === 'connected' && messages.length === 0 && (
        <div className="flex justify-center my-4">
          <div className="bg-green-100 text-green-700 text-sm py-1 px-3 rounded-full">
            Connected! Say hello to your new friend.
          </div>
        </div>
      )}

      {/* Chat bubbles */}
      {messages.map((message, index) => (
        <div
          key={index}
          className={`chat-bubble ${
            message.sender === 'you'
              ? 'chat-bubble-you'
              : message.sender === 'system'
              ? 'chat-bubble-system'
              : 'chat-bubble-stranger'
          } mb-2 max-w-[70%] break-words`}
        >
          <p>{message.content}</p>
        </div>
      ))}

      {/* Typing indicator */}
      {isTyping && (
        <div className="chat-bubble chat-bubble-stranger max-w-[100px] mb-2">
          <div className="typing-indicator flex space-x-1">
            <span className="animate-pulse">•</span>
            <span className="animate-pulse delay-150">•</span>
            <span className="animate-pulse delay-300">•</span>
          </div>
        </div>
      )}

      {/* Add some padding at the bottom for better scrolling experience */}
      <div style={{ height: '12px' }} />
    </div>
  );
}

export function ChatInput({ value, onChange, onSubmit, disabled }) {
  const inputRef = React.useRef(null);
  
  // Handle keyboard appearance on mobile
  React.useEffect(() => {
    // Function to handle visual viewport resize (keyboard appearance)
    const handleVisualViewportResize = () => {
      if (window.innerWidth <= 768 && 'visualViewport' in window) {
        // When keyboard appears, the visual viewport height decreases
        const visualViewport = window.visualViewport;
        
        // Adjust the container to avoid being covered by keyboard
        document.documentElement.style.setProperty(
          '--keyboard-height', 
          `${window.innerHeight - visualViewport.height}px`
        );
      }
    };
    
    // Add event listener if visualViewport API is available
    if ('visualViewport' in window) {
      window.visualViewport?.addEventListener('resize', handleVisualViewportResize);
    }
    
    return () => {
      if ('visualViewport' in window) {
        window.visualViewport?.removeEventListener('resize', handleVisualViewportResize);
      }
    };
  }, []);
  
  // Handle focus and blur for mobile keyboard
  const handleFocus = () => {
    // On mobile, when input is focused, we want to ensure it's visible
    if (window.innerWidth <= 768) {
      // Mark the input as focused for CSS targeting
      document.documentElement.classList.add('keyboard-open');
      
      // Scroll to the input after a short delay to ensure the keyboard is open
      setTimeout(() => {
        inputRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };
  
  const handleBlur = () => {
    // When input loses focus on mobile, we want to restore the viewport
    if (window.innerWidth <= 768) {
      document.documentElement.classList.remove('keyboard-open');
    }
  };

  return (
    <div className="border-t p-2 sm:p-4 sticky bottom-0 bg-white">
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e);
          
          // Keep focus on input after sending on mobile
          if (window.innerWidth <= 768) {
            setTimeout(() => {
              inputRef.current?.focus();
            }, 10);
          }
        }} 
        className="flex items-center gap-1 sm:gap-2"
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-l-lg px-2 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete="off"
        />
        <button
          type="submit"
          className={`${disabled ? 'bg-gray-400' : 'bg-primary hover:bg-blue-600'} text-white px-3 sm:px-4 py-2 rounded-r-lg transition-colors`}
          disabled={disabled}
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
}

export function ChatContainer({ children }) {
  const [viewportHeight, setViewportHeight] = React.useState(window.innerHeight);
  
  // Update viewport height when window resizes or orientation changes
  React.useEffect(() => {
    const handleResize = () => {
      // Use a small timeout to ensure we get the correct height after orientation changes
      setTimeout(() => {
        setViewportHeight(window.innerHeight);
      }, 100);
    };
    
    // Set initial height
    handleResize();
    
    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);
  
  // Calculate container height based on viewport
  // On mobile, we use a dynamic approach to account for the keyboard
  const containerHeight = React.useMemo(() => {
    if (window.innerWidth <= 768) {
      // Use CSS variable for keyboard height if available
      return 'calc(100% - var(--keyboard-height, 0px))';
    } else {
      return '80vh';
    }
  }, [viewportHeight]);
  
  return (
    <div 
      className="chat-container bg-white rounded-none sm:rounded-xl shadow-none sm:shadow-md overflow-hidden flex flex-col w-full h-full"
      style={{ 
        height: containerHeight,
        maxHeight: containerHeight
      }}
    >
      {children}
    </div>
  );
}