import { v4 as uuidv4 } from "uuid";
import { storage } from "./storage.js";
import {
  ConnectionPreference,
  ChatType,
  GenderPreference
} from "../shared/schema.js";

class MatchLogic {
  // Add a user to the appropriate queue based on their preferences
  addToQueue(userInfo, socket) {
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
  
  // Check if users match based on gender preferences
  isGenderMatch(user1, user2) {
    // If either user doesn't have gender preferences, they match
    if (!user1.genderPreference || !user2.genderPreference || 
        !user1.gender || !user2.gender) {
      return true;
    }

    // Check if user1's gender preference matches user2's gender
    const user1PrefMatchesUser2 = 
      user1.genderPreference === GenderPreference.Any || 
      (user1.genderPreference === GenderPreference.Both && 
        (user2.gender === 'male' || user2.gender === 'female')) ||
      user1.genderPreference === user2.gender;

    // Check if user2's gender preference matches user1's gender
    const user2PrefMatchesUser1 = 
      user2.genderPreference === GenderPreference.Any || 
      (user2.genderPreference === GenderPreference.Both && 
        (user1.gender === 'male' || user1.gender === 'female')) ||
      user2.genderPreference === user1.gender;

    // Both users should match each other's preferences
    return user1PrefMatchesUser2 && user2PrefMatchesUser1;
  }

  // Try to match users from a specific queue
  tryMatchFromQueue(queueKey) {
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
      // Look for compatible matches based on gender preferences
      for (let i = 0; i < queue.length; i++) {
        for (let j = i + 1; j < queue.length; j++) {
          const user1 = queue[i];
          const user2 = queue[j];

          // Check if they match based on gender preferences
          if (this.isGenderMatch(user1.userInfo, user2.userInfo)) {
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
            
            // Return after successfully matching a pair
            return;
          }
        }
      }
    }
  }
  
  // Remove a user from all queues
  removeFromQueue(userId) {
    // Get all queue keys
    const queueKeys = Array.from(storage.queues.keys());
    
    // Remove from each queue
    queueKeys.forEach(queueKey => {
      storage.removeFromQueue(queueKey, userId);
    });
  }
  
  // Handle user leaving a room
  leaveRoom(userId, namespace) {
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
  getUserRoom(userId) {
    return storage.getUserRoom(userId);
  }
}

export const matchLogic = new MatchLogic();