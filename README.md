# MeORYou - Real-time Multiplayer Memory Game

A real-time multiplayer memory game built with React, Express, and Socket.io. Play against other players in live gaming sessions.

## Features

- 🎮 Real-time multiplayer gameplay using WebSockets
- ⚡ Built with modern stack: React 19, Vite, Express
- 🎨 Smooth animations with Framer Motion
- 📱 Responsive design
- 👥 Real-time player synchronization
- 🚀 Production-ready deployment setup

## Tech Stack

### Client
- **React 19** - UI library
- **Vite** - Fast build tool and dev server
- **Socket.io Client** - Real-time communication
- **Framer Motion** - Animations
- **ESLint** - Code linting

### Server
- **Express.js** - Web framework
- **Socket.io** - Real-time bidirectional communication
- **CORS** - Cross-origin resource sharing
- **Node.js** - Runtime

## Installation

### Prerequisites
- Node.js 16+ and npm

### Local Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/meoryou.git
cd meoryou
```

2. Install dependencies for both client and server
```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

3. Start the development servers
```bash
# From the root directory, use the provided start script
./start.sh
```

This will start:
- **Server**: http://localhost:3000
- **Client**: http://localhost:5173

## Development

### Server Development
```bash
cd server
npm run dev  # Uses nodemon for auto-reload
```

### Client Development
```bash
cd client
npm run dev  # Starts Vite dev server
```

### Build for Production
```bash
# Build client
cd client
npm run build

# Server runs directly from source or can be packaged
```

## Project Structure

```
meoryou/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.jsx        # Main app component
│   │   ├── socket.js      # Socket.io client setup
│   │   └── ...
│   ├── vite.config.js
│   └── package.json
├── server/                 # Express backend
│   ├── index.js           # Server entry point
│   ├── gameManager.js     # Game logic
│   └── package.json
├── start.sh              # Development startup script
└── README.md
```

## Deployment

### Vercel (Frontend)
The React client can be easily deployed to Vercel:

1. Push your code to GitHub
2. Import the project in Vercel dashboard
3. Configure build settings:
   - **Build Command**: `npm run build` (in client directory)
   - **Output Directory**: `dist`
   - **Root Directory**: `client`
4. Set environment variables if needed:
   - `VITE_SERVER_URL`: Your backend server URL
5. Deploy!

### Backend Deployment Options
- **Render**: Free Node.js hosting
- **Railway**: Node.js deployment
- **Heroku** (paid): Node.js apps
- **AWS/GCP/Azure**: Full control and scalability

## Environment Variables

### Client (`.env` in client/)
```
VITE_SERVER_URL=http://localhost:3000  # Dev
VITE_SERVER_URL=https://your-api.com  # Production
```

### Server (`.env` in server/)
```
NODE_ENV=development
PORT=3000
```

## Scripts

### Client Scripts
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Server Scripts
- `npm start` - Start production server
- `npm run dev` - Start dev server with auto-reload

## API Events

### Socket.io Events

**Client → Server:**
- `join_game` - Player joins a game session
- `move_player` - Player makes a move
- `confirm_answer` - Player confirms their answer
- `disconnect` - Player disconnects

**Server → Client:**
- `state_update` - Game state changes
- (Additional events managed by GameManager)

## License

ISC

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

---

**Made with ❤️**
