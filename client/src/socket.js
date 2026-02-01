import { io } from 'socket.io-client';

// Connect to backend
// Use VITE_SERVER_URL in production; fallback to local dev server
const URL = import.meta.env.PROD
    ? import.meta.env.VITE_SERVER_URL
    : `http://${window.location.hostname}:3000`;

export const socket = io(URL, {
    autoConnect: false
});
