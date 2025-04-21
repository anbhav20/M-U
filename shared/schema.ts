import { z } from "zod";

// Define connection preferences and status types
export const ConnectionPreference = {
  SameCountry: "same-country",
  AnyCountry: "any-country",
} as const;

export type ConnectionPreferenceType = typeof ConnectionPreference[keyof typeof ConnectionPreference];

// Define gender types
export const Gender = {
  Male: "male",
  Female: "female",
  NonBinary: "non-binary",
  PreferNotToSay: "prefer-not-to-say",
} as const;

export type GenderType = typeof Gender[keyof typeof Gender];

// Define gender preference types
export const GenderPreference = {
  Male: "male",
  Female: "female",
  Both: "both",
  Any: "any",
} as const;

export type GenderPreferenceType = typeof GenderPreference[keyof typeof GenderPreference];

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
  gender?: GenderType;
  genderPreference?: GenderPreferenceType;
}

export interface WebRTCSignal {
  type: string;
  sdp?: string;
  candidate?: RTCIceCandidate;
}
