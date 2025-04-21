import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Define connection preferences and status types
export const ConnectionPreference = {
  SameCountry: "same-country",
  AnyCountry: "any-country",
} as const;

export type ConnectionPreferenceType = typeof ConnectionPreference[keyof typeof ConnectionPreference];

export const ConnectionStatus = {
  Disconnected: "disconnected",
  Waiting: "waiting",
  Connected: "connected",
} as const;

export type ConnectionStatusType = typeof ConnectionStatus[keyof typeof ConnectionStatus];

export const ChatType = {
  Text: "text",
  Video: "video",
} as const;

export type ChatTypeType = typeof ChatType[keyof typeof ChatType];

// Socket.IO and WebRTC message types
export interface ChatMessage {
  content: string;
  sender: string; // "you" or "stranger"
  timestamp: number;
}

export interface UserInfo {
  id: string;
  country: string;
  preference: ConnectionPreferenceType;
  chatType: ChatTypeType;
}

export interface WebRTCSignal {
  type: string;
  sdp?: string;
  candidate?: RTCIceCandidate;
}
