// Define connection preferences and status types
export const ConnectionPreference = {
  SameCountry: "same-country",
  AnyCountry: "any-country",
};

// Define gender types
export const Gender = {
  Male: "male",
  Female: "female",
  NonBinary: "non-binary",
  PreferNotToSay: "prefer-not-to-say",
};

// Define gender preference types
export const GenderPreference = {
  Male: "male",
  Female: "female",
  Both: "both",
  Any: "any",
};

export const ConnectionStatus = {
  Disconnected: "disconnected",
  Waiting: "waiting",
  Connected: "connected",
};

export const ChatType = {
  Text: "text",
  Video: "video",
};

// Note: In JavaScript, we don't need to export the type definitions
// but we'll keep comments to document the expected structure

/**
 * @typedef {Object} ChatMessage
 * @property {string} content
 * @property {string} sender - "you" or "stranger"
 * @property {number} timestamp
 */

/**
 * @typedef {Object} UserInfo
 * @property {string} id
 * @property {string} country
 * @property {string} preference
 * @property {string} chatType
 * @property {string} [gender]
 * @property {string} [genderPreference]
 */

/**
 * @typedef {Object} WebRTCSignal
 * @property {string} type
 * @property {string} [sdp]
 * @property {RTCIceCandidate} [candidate]
 */