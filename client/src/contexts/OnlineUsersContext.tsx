import React, { createContext, useContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

interface OnlineUsersContextType {
  onlineUsers: number;
}

const OnlineUsersContext = createContext<OnlineUsersContextType>({ onlineUsers: 0 });

export const useOnlineUsers = () => useContext(OnlineUsersContext);

export function OnlineUsersProvider({ children }: { children: React.ReactNode }) {
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Connect to the stats namespace
    const statsSocket = io('/stats', {
      path: '/api/socket.io',
    });

    setSocket(statsSocket);

    // Listen for online users count updates
    statsSocket.on('onlineUsers', (count: number) => {
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