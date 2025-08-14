/**
 * Storage class for managing queues and rooms
 */
export class MemStorage {
  constructor() {
    this.queues = new Map();
    this.rooms = new Map();
    this.userRooms = new Map();
    
    // Initialize queues
    this.queues.set('global-text', []);
    this.queues.set('global-video', []);
    // Country queues will be created dynamically
  }

  // Queue Management Methods
  getGlobalQueue(chatType) {
    const queueKey = `global-${chatType}`;
    if (!this.queues.has(queueKey)) {
      this.queues.set(queueKey, []);
    }
    return this.queues.get(queueKey) || [];
  }

  getCountryQueue(country, chatType) {
    const queueKey = `${country}-${chatType}`;
    if (!this.queues.has(queueKey)) {
      this.queues.set(queueKey, []);
    }
    return this.queues.get(queueKey) || [];
  }

  addToQueue(queue, userInfo, socket) {
    if (!this.queues.has(queue)) {
      this.queues.set(queue, []);
    }
    this.queues.get(queue)?.push({ userInfo, socket });
    console.log(`Added user ${userInfo.id} to ${queue} queue. Queue size: ${this.queues.get(queue)?.length}`);
  }

  removeFromQueue(queue, userId) {
    if (this.queues.has(queue)) {
      const queueArr = this.queues.get(queue);
      if (queueArr) {
        const index = queueArr.findIndex(item => item.userInfo.id === userId);
        if (index !== -1) {
          queueArr.splice(index, 1);
          console.log(`Removed user ${userId} from ${queue} queue. Queue size: ${queueArr.length}`);
        }
      }
    }
  }

  clearQueue(queue) {
    this.queues.set(queue, []);
    console.log(`Cleared ${queue} queue`);
  }

  // Room Management Methods
  createRoom(roomId, user1Id, user2Id) {
    this.rooms.set(roomId, { user1: user1Id, user2: user2Id });
    this.userRooms.set(user1Id, roomId);
    this.userRooms.set(user2Id, roomId);
    console.log(`Created room ${roomId} with users ${user1Id} and ${user2Id}`);
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  getUserRoom(userId) {
    return this.userRooms.get(userId);
  }

  removeRoom(roomId) {
    const room = this.rooms.get(roomId);
    if (room) {
      this.userRooms.delete(room.user1);
      this.userRooms.delete(room.user2);
      this.rooms.delete(roomId);
      console.log(`Removed room ${roomId}`);
    }
  }
}

export const storage = new MemStorage();