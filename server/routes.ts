import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import axios from "axios";
import { storage } from "./storage";
import { matchLogic } from "./matchLogic";
import { getCountryFromIP } from "./geoService";
import {
  ConnectionPreference,
  ConnectionPreferenceType,
  ChatType,
  ChatTypeType,
  UserInfo,
  WebRTCSignal,
  ChatMessage
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Create Socket.IO server
  const io = new SocketIOServer(httpServer, {
    path: "/api/socket.io",
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Setup namespaces for different chat types
  const textChatNamespace = io.of("/chat");
  const videoChatNamespace = io.of("/video");

  // Handle text chat connections
  textChatNamespace.on("connection", (socket) => {
    console.log(`New text chat connection: ${socket.id}`);
    
    // Get user preferences from query parameters
    const preference = socket.handshake.query.preference as ConnectionPreferenceType || ConnectionPreference.AnyCountry;
    const chatType = ChatType.Text;
    
    // Get user's country from IP
    getCountryFromIP(socket.handshake.address)
      .then(countryData => {
        // Create user info object
        const userInfo: UserInfo = {
          id: socket.id,
          country: countryData.countryCode,
          preference,
          chatType
        };
        
        // Add user to appropriate queue
        matchLogic.addToQueue(userInfo, socket);
        
        // Handle client disconnect
        socket.on("disconnect", () => {
          console.log(`Text chat disconnected: ${socket.id}`);
          matchLogic.removeFromQueue(socket.id);
          matchLogic.leaveRoom(socket.id, textChatNamespace);
        });
        
        // Handle "next" request (find new match)
        socket.on("next", () => {
          matchLogic.leaveRoom(socket.id, textChatNamespace);
          matchLogic.addToQueue(userInfo, socket);
        });
        
        // Handle chat messages
        socket.on("message", (message: ChatMessage) => {
          const roomId = matchLogic.getUserRoom(socket.id);
          if (roomId) {
            // Forward message to the stranger
            socket.to(roomId).emit("message", {
              content: message.content,
              sender: "stranger",
              timestamp: Date.now()
            });
          }
        });
        
        // Handle typing indicator
        socket.on("typing", () => {
          const roomId = matchLogic.getUserRoom(socket.id);
          if (roomId) {
            socket.to(roomId).emit("typing");
          }
        });
      })
      .catch(error => {
        console.error("Error processing geo data:", error);
        socket.emit("error", "Failed to process your location data");
        socket.disconnect();
      });
  });

  // Handle video chat connections
  videoChatNamespace.on("connection", (socket) => {
    console.log(`New video chat connection: ${socket.id}`);
    
    // Get user preferences from query parameters
    const preference = socket.handshake.query.preference as ConnectionPreferenceType || ConnectionPreference.AnyCountry;
    const chatType = ChatType.Video;
    
    // Get user's country from IP
    getCountryFromIP(socket.handshake.address)
      .then(countryData => {
        // Create user info object
        const userInfo: UserInfo = {
          id: socket.id,
          country: countryData.countryCode,
          preference,
          chatType
        };
        
        // Add user to appropriate queue
        matchLogic.addToQueue(userInfo, socket);
        
        // Handle client disconnect
        socket.on("disconnect", () => {
          console.log(`Video chat disconnected: ${socket.id}`);
          matchLogic.removeFromQueue(socket.id);
          matchLogic.leaveRoom(socket.id, videoChatNamespace);
        });
        
        // Handle "next" request (find new match)
        socket.on("next", () => {
          matchLogic.leaveRoom(socket.id, videoChatNamespace);
          matchLogic.addToQueue(userInfo, socket);
        });
        
        // Handle WebRTC signaling
        socket.on("signal", (signal: WebRTCSignal) => {
          const roomId = matchLogic.getUserRoom(socket.id);
          if (roomId) {
            socket.to(roomId).emit("signal", signal);
          }
        });
      })
      .catch(error => {
        console.error("Error processing geo data:", error);
        socket.emit("error", "Failed to process your location data");
        socket.disconnect();
      });
  });

  // API endpoint to get user's geo location
  app.get("/api/geo", async (req, res) => {
    try {
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const geoData = await getCountryFromIP(ip as string);
      res.json(geoData);
    } catch (error) {
      console.error("Error fetching geo data:", error);
      res.status(500).json({ error: "Failed to determine location" });
    }
  });

  return httpServer;
}
