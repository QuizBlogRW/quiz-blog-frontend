import { io } from 'socket.io-client';

// Legacy URLs for fallback
export const qbURL = 'https://myqb-245fdbd30c9b.herokuapp.com/';
export const testURL = 'https://qb-backend-one.vercel.app/';
export const devApiURL = 'http://localhost:5000/';

// Environment-based socket URL
const getSocketUrl = () => {
    if (import.meta.env.VITE_BACKEND_URL) {
        return import.meta.env.VITE_BACKEND_URL;
    }
    return import.meta.env.MODE === 'development' ? devApiURL : import.meta.env.MODE === 'test' ? testURL : qbURL;
};

const serverUrl = getSocketUrl();
console.log('🔌 Socket connecting to:', serverUrl);

export const socket = io(serverUrl, {
    transports: ['websocket', 'polling'],
    timeout: 10000,
    retries: 3,
});
