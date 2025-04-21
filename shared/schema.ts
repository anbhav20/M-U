import { z } from "zod";

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
