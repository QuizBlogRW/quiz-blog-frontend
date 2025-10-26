import { io } from 'socket.io-client';

// Legacy URLs for fallback
export const qbURL = 'https://myqb-245fdbd30c9b.herokuapp.com/';
export const qbTestURL = 'https://qb-test-c6396eeaa356.herokuapp.com/';
export const qbContactsAPI = 'https://qb-contacts-service-156b2230ac4f.herokuapp.com/';
export const apiURL = 'https://quiz-blog-rw-server.onrender.com/';
export const devApiURL = 'http://localhost:5008/';

// Environment-based socket URL
const getSocketUrl = () => {
    if (import.meta.env.VITE_SOCKET_URL) {
        return import.meta.env.VITE_SOCKET_URL;
    }
    return import.meta.env.MODE === 'development' ? devApiURL : (qbContactsAPI || qbURL || apiURL);
};

const serverUrl = getSocketUrl();
console.log('🔌 Socket connecting to:', serverUrl);

export const socket = io(serverUrl, {
    transports: ['websocket', 'polling'],
    timeout: 10000,
    retries: 3,
});
