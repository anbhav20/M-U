# M-U(talk2stranger)

A real-time anonymous chat platform that allows users to connect with strangers via text and video chat. This is a complete, database-free application built with modern technologies focused on real-time communication.

## Features

- Anonymous text chat with strangers
- Peer-to-peer video chat using WebRTC
- Country-based matching (connect with people in your country or anywhere)
- "Next" functionality to find new chat partners
- Real-time typing indicators
- Responsive design for desktop and mobile
- No database required - fully in-memory storage

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Socket.IO client
- **Backend**: Node.js, Express, Socket.IO
- **Real-time Communication**: Socket.IO for messaging, WebRTC for video
- **Styling**: TailwindCSS with ShadCN UI components
- **Routing**: Wouter for client-side routing
- **Storage**: In-memory data structures (no database needed)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/talk2stranger.git
   cd talk2stranger
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5000`

## Deployment

This application is designed to be deployed on Render.com. Please check the following guides for deployment instructions:

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Comprehensive deployment guide
- [RENDER_SETUP.md](./RENDER_SETUP.md) - Specific instructions for Render.com setup
- [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md) - Important security measures to implement before public release

## Project Structure

- `/client` - Frontend React application
  - `/src/components` - UI components
  - `/src/hooks` - Custom React hooks
  - `/src/pages` - Application pages
- `/server` - Backend Express server
  - `routes.ts` - API routes and Socket.IO setup
  - `matchLogic.ts` - Logic for matching users
  - `geoService.ts` - Geographic location services
  - `storage.ts` - In-memory data storage
- `/shared` - Shared code between client and server
  - `schema.ts` - TypeScript types and interfaces

## How It Works

1. **User Matching**:
   - Users select their matching preference (same country or any country)
   - When clicking "Start Chat" or "Start Video", they enter a queue
   - The server matches users from the same queue

2. **Text Chat**:
   - Messages are transmitted via Socket.IO
   - Typing indicators show when the other person is typing

3. **Video Chat**:
   - WebRTC is used for peer-to-peer connections
   - Signaling is handled through Socket.IO

4. **Country Detection**:
   - IP-based geolocation determines the user's country
   - This is used when "Same Country" matching is selected

## Security Considerations

Before making this application publicly available, please review and implement the security measures outlined in [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Omegle and other anonymous chat platforms
- Built with React, Express, and Socket.IO
- UI components from ShadCN UI library