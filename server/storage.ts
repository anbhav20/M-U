import { users, type User, type InsertUser, UserInfo } from "@shared/schema";
import { Socket } from "socket.io";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
  private users: Map<number, User>;
  private queues: Map<string, Array<{ userInfo: UserInfo, socket: Socket }>>;
  private rooms: Map<string, { user1: string, user2: string }>;
  private userRooms: Map<string, string>; // userId -> roomId
  currentId: number;

  constructor() {
    this.users = new Map();
    this.queues = new Map();
    this.rooms = new Map();
    this.userRooms = new Map();
    this.currentId = 1;
    
    // Initialize queues
    this.queues.set('global-text', []);
    this.queues.set('global-video', []);
    // Country queues will be created dynamically
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
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
  }

  removeFromQueue(queue: string, userId: string): void {
    if (this.queues.has(queue)) {
      const queueArr = this.queues.get(queue);
      if (queueArr) {
        const index = queueArr.findIndex(item => item.userInfo.id === userId);
        if (index !== -1) {
          queueArr.splice(index, 1);
        }
      }
    }
  }

  clearQueue(queue: string): void {
    this.queues.set(queue, []);
  }

  // Room Management Methods
  createRoom(roomId: string, user1Id: string, user2Id: string): void {
    this.rooms.set(roomId, { user1: user1Id, user2: user2Id });
    this.userRooms.set(user1Id, roomId);
    this.userRooms.set(user2Id, roomId);
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
    }
  }
}

export const storage = new MemStorage();
