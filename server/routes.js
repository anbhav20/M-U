import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import axios from "axios";
import { storage } from "./storage.js";
import { matchLogic } from "./matchLogic.js";
import { getCountryFromIP } from "./geoService.js";
import {
  ConnectionPreference,
  ChatType
} from "../shared/schema.js";

export async function registerRoutes(app) {
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
  const statsNamespace = io.of("/stats");
  
  // Track total online users
  let onlineUsers = 0;
  
  // Function to broadcast online users count
  const broadcastOnlineUsers = () => {
    statsNamespace.emit('onlineUsers', onlineUsers);
    console.log(`Broadcasting online users count: ${onlineUsers}`);
  };

  // Handle text chat connections
  textChatNamespace.on("connection", (socket) => {
    console.log(`New text chat connection: ${socket.id}`);
    
    // Increment online users count
    onlineUsers++;
    broadcastOnlineUsers();
    
    // Get user preferences from query parameters
    const preference = socket.handshake.query.preference || ConnectionPreference.AnyCountry;
    const gender = socket.handshake.query.gender;
    const genderPreference = socket.handshake.query.genderPreference;
    const chatType = ChatType.Text;
    
    // Get user's country from IP
    getCountryFromIP(socket.handshake.address)
      .then(countryData => {
        // Create user info object
        const userInfo = {
          id: socket.id,
          country: countryData.countryCode,
          preference,
          chatType,
          gender,
          genderPreference
        };
        
        // Add user to appropriate queue
        matchLogic.addToQueue(userInfo, socket);
        
        // Handle client disconnect
        socket.on("disconnect", () => {
          console.log(`Text chat disconnected: ${socket.id}`);
          matchLogic.removeFromQueue(socket.id);
          matchLogic.leaveRoom(socket.id, textChatNamespace);
          
          // Decrement online users count
          onlineUsers = Math.max(0, onlineUsers - 1);
          broadcastOnlineUsers();
        });
        
        // Handle "next" request (find new match)
        socket.on("next", () => {
          matchLogic.leaveRoom(socket.id, textChatNamespace);
          matchLogic.addToQueue(userInfo, socket);
        });
        
        // Handle chat messages
        socket.on("message", (message) => {
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
    
    // Increment online users count
    onlineUsers++;
    broadcastOnlineUsers();
    
    // Get user preferences from query parameters
    const preference = socket.handshake.query.preference || ConnectionPreference.AnyCountry;
    const gender = socket.handshake.query.gender;
    const genderPreference = socket.handshake.query.genderPreference;
    const chatType = ChatType.Video;
    
    // Get user's country from IP
    getCountryFromIP(socket.handshake.address)
      .then(countryData => {
        // Create user info object
        const userInfo = {
          id: socket.id,
          country: countryData.countryCode,
          preference,
          chatType,
          gender,
          genderPreference
        };
        
        // Add user to appropriate queue
        matchLogic.addToQueue(userInfo, socket);
        
        // Handle client disconnect
        socket.on("disconnect", () => {
          console.log(`Video chat disconnected: ${socket.id}`);
          matchLogic.removeFromQueue(socket.id);
          matchLogic.leaveRoom(socket.id, videoChatNamespace);
          
          // Decrement online users count
          onlineUsers = Math.max(0, onlineUsers - 1);
          broadcastOnlineUsers();
        });
        
        // Handle "next" request (find new match)
        socket.on("next", () => {
          matchLogic.leaveRoom(socket.id, videoChatNamespace);
          matchLogic.addToQueue(userInfo, socket);
        });
        
        // Handle WebRTC signaling
        socket.on("signal", (signal) => {
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

  // Handle stats connections
  statsNamespace.on("connection", (socket) => {
    console.log(`New stats connection: ${socket.id}`);
    
    // Send current online users count to the newly connected client
    socket.emit('onlineUsers', onlineUsers);
    
    socket.on("disconnect", () => {
      console.log(`Stats disconnected: ${socket.id}`);
    });
  });

  // API endpoint to get user's geo location
  app.get("/api/geo", async (req, res) => {
    try {
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const geoData = await getCountryFromIP(ip);
      res.json(geoData);
    } catch (error) {
      console.error("Error fetching geo data:", error);
      res.status(500).json({ error: "Failed to determine location" });
    }
  });

  return httpServer;
}