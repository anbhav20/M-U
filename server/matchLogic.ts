import { Server, Socket, Namespace } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { storage } from "./storage";
import {
  UserInfo,
  ConnectionPreference,
  ChatType
} from "@shared/schema";

class MatchLogic {
  // Add a user to the appropriate queue based on their preferences
  addToQueue(userInfo: UserInfo, socket: Socket): void {
    // Remove from any existing queues first (in case they're already queued)
    this.removeFromQueue(userInfo.id);
    
    // Choose appropriate queue based on preference
    if (userInfo.preference === ConnectionPreference.SameCountry) {
      // Add to country-specific queue
      const queueKey = `${userInfo.country}-${userInfo.chatType}`;
      storage.addToQueue(queueKey, userInfo, socket);
      console.log(`Added user ${userInfo.id} to ${queueKey} queue`);
      
      // Try to find a match within the country queue
      this.tryMatchFromQueue(queueKey);
    } else {
      // Add to global queue
      const queueKey = `global-${userInfo.chatType}`;
      storage.addToQueue(queueKey, userInfo, socket);
      console.log(`Added user ${userInfo.id} to ${queueKey} queue`);
      
      // Try to find a match within the global queue
      this.tryMatchFromQueue(queueKey);
    }
  }
  
  // Try to match users from a specific queue
  tryMatchFromQueue(queueKey: string): void {
    const chatType = queueKey.includes('-text') ? ChatType.Text : ChatType.Video;
    
    // Get queue
    let queue;
    if (queueKey.startsWith('global-')) {
      queue = storage.getGlobalQueue(chatType);
    } else {
      const country = queueKey.split('-')[0];
      queue = storage.getCountryQueue(country, chatType);
    }
    
    // Match if at least 2 users are waiting
    if (queue.length >= 2) {
      const user1 = queue[0];
      const user2 = queue[1];
      
      // Create a new room with unique ID
      const roomId = uuidv4();
      storage.createRoom(roomId, user1.userInfo.id, user2.userInfo.id);
      
      // Join sockets to the room
      user1.socket.join(roomId);
      user2.socket.join(roomId);
      
      // Notify users they've been matched
      const namespace = user1.socket.nsp;
      
      if (chatType === ChatType.Text) {
        // For text chats, just notify that they're matched
        namespace.to(roomId).emit('matched');
      } else {
        // For video chats, designate caller and callee
        user1.socket.emit('matched', true); // User1 will initiate the call
        user2.socket.emit('matched', false);
      }
      
      console.log(`Matched users ${user1.userInfo.id} and ${user2.userInfo.id} in room ${roomId}`);
      
      // Remove matched users from the queue
      storage.removeFromQueue(queueKey, user1.userInfo.id);
      storage.removeFromQueue(queueKey, user2.userInfo.id);
    }
  }
  
  // Remove a user from all queues
  removeFromQueue(userId: string): void {
    // Get all queue keys
    const queueKeys = Array.from(storage.queues.keys());
    
    // Remove from each queue
    queueKeys.forEach(queueKey => {
      storage.removeFromQueue(queueKey, userId);
    });
  }
  
  // Handle user leaving a room
  leaveRoom(userId: string, namespace: Namespace): void {
    const roomId = storage.getUserRoom(userId);
    
    if (roomId) {
      // Get room info to find the other user
      const room = storage.getRoom(roomId);
      
      if (room) {
        // Determine the ID of the other user
        const otherId = room.user1 === userId ? room.user2 : room.user1;
        
        // Notify the other user that the stranger disconnected
        namespace.to(otherId).emit('strangerDisconnected');
        
        // Remove all users from the room
        namespace.in(roomId).socketsLeave(roomId);
        
        // Delete the room
        storage.removeRoom(roomId);
        console.log(`User ${userId} left room ${roomId}, notified ${otherId}`);
      }
    }
  }
  
  // Get the room ID for a user
  getUserRoom(userId: string): string | undefined {
    return storage.getUserRoom(userId);
  }
}

export const matchLogic = new MatchLogic();
