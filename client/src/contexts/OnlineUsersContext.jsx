import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const OnlineUsersContext = createContext({ onlineUsers: 0 });

export const useOnlineUsers = () => useContext(OnlineUsersContext);

export function OnlineUsersProvider({ children }) {
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to the stats namespace
    const statsSocket = io('/stats', {
      path: '/api/socket.io',
    });

    setSocket(statsSocket);

    // Listen for online users count updates
    statsSocket.on('onlineUsers', (count) => {
      setOnlineUsers(count);
    });

    // Clean up on unmount
    return () => {
      if (statsSocket) {
        statsSocket.disconnect();
      }
    };
  }, []);

  return (
    <OnlineUsersContext.Provider value={{ onlineUsers }}>
      {children}
    </OnlineUsersContext.Provider>
  );
}