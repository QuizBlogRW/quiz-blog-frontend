// src/utils/socket.js
import { io } from "socket.io-client";

/* ------------------------------------------------------------------
   URL CONFIG
------------------------------------------------------------------- */
const URLS = {
    production: "https://myqb-245fdbd30c9b.herokuapp.com",
    test: "https://qb-backend-one.vercel.app",
    local: "http://localhost:5000"
};

function resolveBackendURL() {
    const envUrl = import.meta.env.VITE_BACKEND_URL;
    if (envUrl) return envUrl;

    switch (import.meta.env.MODE) {
        case "development":
            return URLS.local;
        case "test":
            return URLS.test;
        case "production":
        default:
            return URLS.production;
    }
}

/* ------------------------------------------------------------------
   SOCKET STATE
------------------------------------------------------------------- */
let socket = null;
let isInitialized = false;

/* ------------------------------------------------------------------
   UTILS
------------------------------------------------------------------- */
const LOGGING = import.meta.env.DEV;
const log = (...args) => LOGGING && console.log("[SOCKET]", ...args);

const isVercelBackend = (url) => url.includes("vercel.app");

function shouldEnableSocket(url) {
    if (import.meta.env.VITE_DISABLE_SOCKET === "true") {
        log("Socket disabled via VITE_DISABLE_SOCKET");
        return false;
    }

    if (isVercelBackend(url) && import.meta.env.MODE === "test") {
        log("Sockets disabled due to serverless test backend");
        return false;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
        log("No auth token found, skipping socket connection");
        return false;
    }

    return true;
}

/* ------------------------------------------------------------------
   INITIALIZER (Call once from App.jsx)
------------------------------------------------------------------- */
export function initSocket() {
    if (isInitialized) return socket;

    const serverUrl = resolveBackendURL();
    const enabled = shouldEnableSocket(serverUrl);

    log("Resolved backend:", serverUrl);

    if (!enabled) {
        log("Socket.IO disabled.");
        isInitialized = true;
        return null;
    }

    const token = localStorage.getItem("token");

    socket = io(serverUrl, {
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 800,
        autoConnect: true,
        timeout: 10000,
        auth: { token }
    });

    /* ------------------ CONNECTION EVENTS ------------------ */
    socket.on("connect", () => log("Connected:", socket.id));
    socket.on("disconnect", (reason) => log("Disconnected:", reason));
    socket.on("connect_error", (e) => log("Connect error:", e.message));

    socket.on("reconnect_attempt", (n) => log("Reconnect attempt:", n));
    socket.on("reconnect", (n) => log("Reconnected after:", n));
    socket.on("reconnect_failed", () => log("Reconnection failed"));

    isInitialized = true;
    return socket;
}

/* ------------------------------------------------------------------
   SAFE HELPERS
------------------------------------------------------------------- */
export function socketEmit(event, payload) {
    if (!socket || !socket.connected) {
        log(`Emit blocked (socket unavailable):`, event);
        return false;
    }
    socket.emit(event, payload);
    return true;
}

export function socketOn(event, cb) {
    if (!socket) return false;
    socket.on(event, cb);
    return true;
}

export function socketOff(event, cb) {
    if (!socket) return false;
    socket.off(event, cb);
    return true;
}

export const emitTyping = (roomName, user) => socketEmit('typing', { roomName, user });
export const emitStopTyping = (roomName, user) => socketEmit('stopTyping', { roomName, user });
export const onUserTyping = (cb) => socketOn('userTyping', cb);
export const onUserStoppedTyping = (cb) => socketOn('userStoppedTyping', cb);

export function connectSocket() {
    if (socket && !socket.connected) socket.connect();
}
export function disconnectSocket() {
    if (socket) socket.disconnect();
}

export const isSocketConnected = () => socket?.connected ?? false;

/* ------------------------------------------------------------------
   EXPORTED FOR DEBUGGING
------------------------------------------------------------------- */
export const socketInstance = () => socket;
export const backendUrl = resolveBackendURL();
export const socketEnabled = shouldEnableSocket(backendUrl);

/* DEV DEBUG */
if (LOGGING) {
    console.log("🔍 Socket Config:", {
        backendUrl,
        mode: import.meta.env.MODE,
        socketEnabled,
        isVercel: isVercelBackend(backendUrl)
    });
}
