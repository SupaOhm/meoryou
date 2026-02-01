import { io } from 'socket.io-client';

// Connect to backend
// Use window.location.hostname to support access via IP (mobile)
const URL = import.meta.env.PROD
    ? undefined
    : `http://${window.location.hostname}:3000`;

export const socket = io(URL, {
    autoConnect: false
});
