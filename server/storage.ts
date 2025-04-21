import { UserInfo } from "@shared/schema";
import { Socket } from "socket.io";

// Storage interface for managing queues and rooms
export interface IStorage {
  // Queue related methods
  getGlobalQueue(chatType: string): Array<{ userInfo: UserInfo, socket: Socket }>;
  getCountryQueue(country: string, chatType: string): Array<{ userInfo: UserInfo, socket: Socket }>;
  addToQueue(queue: string, userInfo: UserInfo, socket: Socket): void;
  removeFromQueue(queue: string, userId: string): void;
  clearQueue(queue: string): void;
  
  // Room management
  createRoom(roomId: string, user1Id: string, user2Id: string): void;
  getRoom(roomId: string): { user1: string, user2: string } | undefined;
  getUserRoom(userId: string): string | undefined;
  removeRoom(roomId: string): void;
}

export class MemStorage implements IStorage {
  queues: Map<string, Array<{ userInfo: UserInfo, socket: Socket }>>;
  private rooms: Map<string, { user1: string, user2: string }>;
  private userRooms: Map<string, string>; // userId -> roomId

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
  getGlobalQueue(chatType: string): Array<{ userInfo: UserInfo, socket: Socket }> {
    const queueKey = `global-${chatType}`;
    if (!this.queues.has(queueKey)) {
      this.queues.set(queueKey, []);
    }
    return this.queues.get(queueKey) || [];
  }

  getCountryQueue(country: string, chatType: string): Array<{ userInfo: UserInfo, socket: Socket }> {
    const queueKey = `${country}-${chatType}`;
    if (!this.queues.has(queueKey)) {
      this.queues.set(queueKey, []);
    }
    return this.queues.get(queueKey) || [];
  }

  addToQueue(queue: string, userInfo: UserInfo, socket: Socket): void {
    if (!this.queues.has(queue)) {
      this.queues.set(queue, []);
    }
    this.queues.get(queue)?.push({ userInfo, socket });
    console.log(`Added user ${userInfo.id} to ${queue} queue. Queue size: ${this.queues.get(queue)?.length}`);
  }

  removeFromQueue(queue: string, userId: string): void {
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

  clearQueue(queue: string): void {
    this.queues.set(queue, []);
    console.log(`Cleared ${queue} queue`);
  }

  // Room Management Methods
  createRoom(roomId: string, user1Id: string, user2Id: string): void {
    this.rooms.set(roomId, { user1: user1Id, user2: user2Id });
    this.userRooms.set(user1Id, roomId);
    this.userRooms.set(user2Id, roomId);
    console.log(`Created room ${roomId} with users ${user1Id} and ${user2Id}`);
  }

  getRoom(roomId: string): { user1: string, user2: string } | undefined {
    return this.rooms.get(roomId);
  }

  getUserRoom(userId: string): string | undefined {
    return this.userRooms.get(userId);
  }

  removeRoom(roomId: string): void {
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
