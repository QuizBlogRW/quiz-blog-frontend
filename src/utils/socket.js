import { io } from 'socket.io-client';

// ----------------------------
// Default URLs for fallback
// ----------------------------
export const URLS = {
    production: 'https://myqb-245fdbd30c9b.herokuapp.com/',
    test: 'https://qb-backend-one.vercel.app/',
    local: 'http://localhost:5000/'
};

// ----------------------------
// Determine active backend URL
// ----------------------------
const getSocketUrl = () => {
    const envUrl = import.meta.env.VITE_BACKEND_URL;
    if (envUrl) return envUrl;

    const mode = import.meta.env.MODE;
    switch (mode) {
        case 'development':
            return URLS.local;
        case 'test':
            return URLS.test;
        case 'production':
        default:
            return URLS.production;
    }
};

const serverUrl = getSocketUrl();
const isTestMode = import.meta.env.MODE === 'test';
const isTestUrl = serverUrl === URLS.test;

// ----------------------------
// Socket.IO instance
// ----------------------------
let socket = null;

if (!isTestMode && !isTestUrl) {
    console.log(`🔌 Socket connecting to: ${serverUrl}`);

    socket = io(serverUrl, {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnectionAttempts: 3,
        autoConnect: true,
    });

    // Optional: log connection events for debugging
    socket.on('connect', () => console.log('✅ Connected to socket:', socket.id));
    socket.on('disconnect', (reason) => console.log('⚠️ Disconnected:', reason));
    socket.on('connect_error', (err) => console.error('❌ Socket connection error:', err.message));
} else {
    console.log('⚠️ Socket.IO disabled in test mode or when using test URL');
}

export { socket, serverUrl, isTestMode };
