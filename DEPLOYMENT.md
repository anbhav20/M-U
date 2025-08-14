# Talk2Stranger Deployment Guide

This guide provides instructions for deploying the Talk2Stranger application on Render.com.

## Pre-Deployment Changes

Before deploying the application, make these important changes:

1. **Environment Variables**:
   - Set up proper CORS settings in `server/routes.ts` to accept only your application domain instead of `*`
   - Add a rate limiter to prevent abuse of your API endpoints
   - Update the WebSocket connection path as needed

2. **Security Enhancements**:
   - Add input validation for all user inputs in chat/messages
   - Implement content moderation for text and potentially video chats
   - Add reporting functionality for inappropriate behavior
   - Ensure proper WebRTC security settings for video chats

3. **Performance Considerations**:
   - Update the geolocation service to use a more reliable API if needed
   - Consider adding a backup TURN server for WebRTC connections that can't establish direct connections

## Deployment Steps on Render

### 1. Create a Render Account

Sign up for a free account at [Render.com](https://render.com) if you don't already have one.

### 2. Create a New Web Service

1. In the Render dashboard, click "New" and select "Web Service"
2. Connect your GitHub repository (you'll need to push your code to GitHub first)
3. Configure your web service:

   - **Name**: `talk2stranger` or your preferred name
   - **Environment**: `Node`
   - **Region**: Choose the closest to your target audience
   - **Branch**: `main` (or your default branch)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Start with "Free" tier for testing, upgrade later as needed

### 3. Add Environment Variables

In your Render dashboard, set these environment variables:

- `NODE_ENV`: `production`
- `PORT`: `10000` (Render will automatically use their own PORT)

### 4. Create a Start Script

Add a production start script to your `package.json`:

```json
"scripts": {
  "start": "node dist/server/index.js",
  "build": "tsc && vite build",
  "dev": "NODE_ENV=development tsx server/index.ts"
}
```

### 5. Configure for Production

Create a new file `server/production.ts` with this content:

```typescript
import express from "express";
import { registerRoutes } from "./routes";
import path from "path";

const app = express();
app.use(express.json());

const clientDistPath = path.join(__dirname, "../client/dist");

// Serve static files
app.use(express.static(clientDistPath));

// Register API routes
registerRoutes(app).then((server) => {
  const PORT = process.env.PORT || 5000;
  server.listen({
    port: PORT,
    host: "0.0.0.0",
  }, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

// For any request that doesn't match an API route, serve the app
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});
```

### 6. Update TypeScript Config

Ensure your `tsconfig.json` includes proper outDir settings for production build:

```json
"compilerOptions": {
  "outDir": "dist",
  "rootDir": ".",
  // other options...
}
```

### 7. Deploy Your Application

1. Commit and push all changes to your GitHub repository
2. In the Render dashboard, click "Deploy"
3. Wait for the build process to complete
4. Once deployed, Render will provide a URL (e.g., `https://talk2stranger.onrender.com`)

## Other Considerations Before Public Release

1. **Legal Requirements**:
   - Add a Privacy Policy page detailing how user data is handled (IP addresses, etc.)
   - Add Terms of Service with clear guidelines on appropriate behavior
   - Consider age restrictions (13+ or 18+ depending on your target audience)

2. **Moderation**:
   - Implement automated text filtering for offensive content
   - Consider adding a reporting system for users to report inappropriate behavior
   - Plan for ongoing moderation of the platform

3. **Scaling**:
   - Consider how your application will handle increased load
   - Plan for upgrading to a paid tier on Render as usage grows
   - Set up monitoring to track performance and usage

4. **Backup TURN Server**:
   - For reliable WebRTC connections, consider setting up a TURN server with a service like Twilio
   - This helps users behind restrictive firewalls connect to each other

5. **Analytics and Monitoring**:
   - Add basic analytics to understand user behavior and usage patterns
   - Set up error monitoring with a tool like Sentry to catch issues in production

## Testing After Deployment

After deploying, test the following functionality:

1. Text chat connection between different users
2. Video chat connection between different users
3. "Next" functionality to connect to new strangers
4. Geographic matching functionality
5. Mobile responsiveness of the interface
6. WebSocket reconnection if connection is temporarily lost

## Maintenance

Regularly update dependencies to ensure security and performance improvements.

---

With these steps, your Talk2Stranger application should be ready for deployment on Render.com. The application is already designed as a serverless application without database dependencies, making it well-suited for deployment on platforms like Render.