import { io } from 'socket.io-client';

// ----------------------------
// Backend URLs Configuration
// ----------------------------
const URLS = {
    production: 'https://myqb-245fdbd30c9b.herokuapp.com',
    test: 'https://qb-backend-one.vercel.app',
    local: 'http://localhost:5000'
};

// ----------------------------
// Platform Detection
// ----------------------------
const getSocketUrl = () => {
    // Priority 1: Explicit environment variable
    const envUrl = import.meta.env.VITE_BACKEND_URL;
    if (envUrl) return envUrl;

    // Priority 2: Vite mode
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

const isVercelBackend = (url) => {
    return url.includes('vercel.app');
};

const serverUrl = getSocketUrl();
const mode = import.meta.env.MODE;

// ----------------------------
// Socket.IO Enable/Disable Logic
// ----------------------------
const shouldEnableSocket = () => {
    // Check 1: Explicit disable flag
    const explicitDisable = import.meta.env.VITE_DISABLE_SOCKET === 'true';
    if (explicitDisable) {
        console.log('🔌 Socket.IO explicitly disabled via VITE_DISABLE_SOCKET');
        return false;
    }

    // Check 2: Vercel backend (serverless doesn't support websockets)
    if (isVercelBackend(serverUrl) && mode === 'test') {
        console.log('🔌 Socket.IO disabled: Test mode');
        return false;
    }

    return true;
};

// ----------------------------
// Socket.IO Instance
// ----------------------------
let socket = null;
const socketEnabled = shouldEnableSocket();

if (socketEnabled) {
    console.log(`🔌 Socket connecting to: ${serverUrl}`);

    socket = io(serverUrl, {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
        autoConnect: true,
    });

    // Connection event handlers
    socket.on('connect', () => {
        console.log('✅ Socket connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
        console.log('⚠️  Socket disconnected:', reason);

        // Auto-reconnect for client-side disconnections
        if (reason === 'io client disconnect') {
            socket.connect();
        }
    });

    socket.on('connect_error', (err) => {
        console.error('❌ Socket connection error:', err.message);
    });

    socket.on('reconnect', (attemptNumber) => {
        console.log(`🔄 Socket reconnected after ${attemptNumber} attempt(s)`);
    });

    socket.on('reconnect_attempt', (attemptNumber) => {
        console.log(`🔄 Socket reconnection attempt ${attemptNumber}...`);
    });

    socket.on('reconnect_failed', () => {
        console.error('❌ Socket reconnection failed after all attempts');
    });
}

// ----------------------------
// Safe Socket Methods
// ----------------------------
export const socketEmit = (event, ...args) => {
    if (socket && socket.connected) {
        socket.emit(event, ...args);
        return true;
    }
    console.warn(`⚠️  Socket not available. Cannot emit event: ${event}`);
    return false;
};

export const socketOn = (event, callback) => {
    if (socket) {
        socket.on(event, callback);
        return true;
    }
    console.warn(`⚠️  Socket not available. Cannot listen to event: ${event}`);
    return false;
};

export const socketOff = (event, callback) => {
    if (socket) {
        socket.off(event, callback);
        return true;
    }
    return false;
};

export const isSocketConnected = () => {
    return socket ? socket.connected : false;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        console.log('🔌 Socket manually disconnected');
    }
};

export const connectSocket = () => {
    if (socket && !socket.connected) {
        socket.connect();
        console.log('🔌 Socket manually connected');
    }
};

// ----------------------------
// Exports
// ----------------------------
export {
    socket,
    serverUrl,
    socketEnabled,
    mode as buildMode,
    URLS
};

// ----------------------------
// Debug Info (development only)
// ----------------------------
if (import.meta.env.DEV) {
    console.log('🔍 Socket Configuration:', {
        serverUrl,
        mode,
        socketEnabled,
        isVercel: isVercelBackend(serverUrl),
        socketId: socket?.id || 'N/A'
    });
}