// Enhanced Client-Side Socket.IO Manager
// Provides robust connection management and real-time features

import { io } from 'socket.io-client';

class SocketManager {
    constructor() {
        this.socket = null;
        this.connectionAttempts = 0;
        this.maxReconnectionAttempts = 10;
        this.reconnectionDelay = 1000;
        this.isConnected = false;
        this.isReconnecting = false;
        this.eventListeners = new Map();
        this.connectionCallbacks = {
            onConnect: [],
            onDisconnect: [],
            onReconnect: [],
            onError: []
        };
        
        // Connection statistics
        this.stats = {
            connectTime: null,
            disconnectTime: null,
            totalConnections: 0,
            reconnectionAttempts: 0,
            lastPingTime: null,
            avgLatency: null,
            latencyHistory: []
        };

        // Auto-ping setup
        this.pingInterval = null;
        this.pingStartTime = null;
    }

    connect(options = {}) {
        const defaultOptions = {
            urls: [
                process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001',
                process.env.REACT_APP_API_URL || 'http://localhost:3001',
                'http://localhost:3001',
                'http://localhost:8080'
            ],
            transports: ['websocket', 'polling'],
            timeout: 20000,
            forceNew: true,
            reconnection: true,
            reconnectionAttempts: this.maxReconnectionAttempts,
            reconnectionDelay: this.reconnectionDelay,
            reconnectionDelayMax: 5000,
            randomizationFactor: 0.5,
            autoConnect: true,
            upgrade: true,
            rememberUpgrade: true
        };

        const config = { ...defaultOptions, ...options };

        // Try multiple URLs
        let currentUrlIndex = 0;
        const tryConnection = () => {
            if (currentUrlIndex >= config.urls.length) {
                console.error('❌ Failed to connect to any socket server');
                this.handleConnectionError(new Error('All connection URLs failed'));
                return;
            }

            const url = config.urls[currentUrlIndex];
            console.log(`🔌 Attempting to connect to: ${url}`);

            try {
                this.socket = io(url, {
                    ...config,
                    auth: {
                        token: this.getAuthToken()
                    }
                });

                this.setupEventHandlers();
                this.setupConnectionHandlers(tryConnection, currentUrlIndex, config.urls);

                currentUrlIndex++;
            } catch (error) {
                console.error('Socket creation error:', error);
                currentUrlIndex++;
                setTimeout(tryConnection, 1000);
            }
        };

        tryConnection();
    }

    setupEventHandlers() {
        if (!this.socket) return;

        // Connection events
        this.socket.on('connect', () => {
            this.isConnected = true;
            this.isReconnecting = false;
            this.connectionAttempts = 0;
            this.stats.connectTime = new Date();
            this.stats.totalConnections++;

            console.log('✅ Socket connected:', this.socket.id);
            
            // Start ping monitoring
            this.startPingMonitoring();
            
            // Join user room if authenticated
            this.joinUserRoom();
            
            // Trigger connect callbacks
            this.connectionCallbacks.onConnect.forEach(callback => callback(this.socket));
        });

        this.socket.on('disconnect', (reason) => {
            this.isConnected = false;
            this.stats.disconnectTime = new Date();
            
            console.log('🔌 Socket disconnected:', reason);
            
            // Stop ping monitoring
            this.stopPingMonitoring();
            
            // Trigger disconnect callbacks
            this.connectionCallbacks.onDisconnect.forEach(callback => callback(reason));

            // Handle reconnection based on reason
            if (reason === 'io server disconnect') {
                // Server initiated disconnect - don't auto reconnect
                console.log('Server closed connection - not attempting reconnection');
            } else {
                // Client or network issue - attempt reconnection
                this.handleReconnection();
            }
        });

        this.socket.on('connect_error', (error) => {
            this.connectionAttempts++;
            console.error('❌ Connection error:', error.message);
            
            this.connectionCallbacks.onError.forEach(callback => callback(error));
            
            if (this.connectionAttempts >= this.maxReconnectionAttempts) {
                console.error('Max reconnection attempts reached');
                this.handleConnectionError(error);
            }
        });

        this.socket.on('reconnect', (attemptNumber) => {
            this.isReconnecting = false;
            this.stats.reconnectionAttempts = attemptNumber;
            
            console.log(`🔄 Reconnected after ${attemptNumber} attempts`);
            
            this.connectionCallbacks.onReconnect.forEach(callback => callback(attemptNumber));
        });

        this.socket.on('reconnect_attempt', (attemptNumber) => {
            console.log(`🔄 Reconnection attempt ${attemptNumber}`);
        });

        this.socket.on('reconnect_error', (error) => {
            console.error('Reconnection error:', error.message);
        });

        this.socket.on('reconnect_failed', () => {
            console.error('❌ Reconnection failed after max attempts');
            this.handleConnectionError(new Error('Reconnection failed'));
        });

        // Ping-pong for latency monitoring
        this.socket.on('pong', (_data) => {
            if (this.pingStartTime) {
                const latency = Date.now() - this.pingStartTime;
                this.updateLatencyStats(latency);
                this.stats.lastPingTime = new Date();
            }
        });

        // Server stats
        this.socket.on('serverStats', (stats) => {
            this.emit('serverStats', stats);
        });

        // User presence events
        this.socket.on('onlineUsers', (data) => {
            this.emit('onlineUsers', data);
        });

        this.socket.on('userOnline', (user) => {
            this.emit('userOnline', user);
        });

        this.socket.on('userOffline', (user) => {
            this.emit('userOffline', user);
        });
    }

    setupConnectionHandlers(tryNext, urlIndex, urls) {
        const connectionTimeout = setTimeout(() => {
            if (!this.isConnected) {
                console.log(`⏱️ Connection timeout for URL ${urlIndex + 1}/${urls.length}`);
                this.socket?.disconnect();
                tryNext();
            }
        }, 5000);

        this.socket.once('connect', () => {
            clearTimeout(connectionTimeout);
        });

        this.socket.once('connect_error', () => {
            clearTimeout(connectionTimeout);
            setTimeout(tryNext, 500);
        });
    }

    handleReconnection() {
        if (this.isReconnecting) return;
        
        this.isReconnecting = true;
        console.log('🔄 Starting reconnection process...');
        
        // Exponential backoff for reconnection
        const delay = Math.min(this.reconnectionDelay * Math.pow(2, this.connectionAttempts), 30000);
        
        setTimeout(() => {
            if (!this.isConnected && this.connectionAttempts < this.maxReconnectionAttempts) {
                this.connect();
            }
        }, delay);
    }

    handleConnectionError(error) {
        console.error('❌ Socket connection failed:', error);
        this.emit('connectionError', error);
    }

    startPingMonitoring() {
        this.pingInterval = setInterval(() => {
            if (this.isConnected) {
                this.pingStartTime = Date.now();
                this.socket.emit('ping', { timestamp: this.pingStartTime });
            }
        }, 10000); // Ping every 10 seconds
    }

    stopPingMonitoring() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
    }

    updateLatencyStats(latency) {
        this.stats.latencyHistory.push(latency);
        
        // Keep only last 10 latency measurements
        if (this.stats.latencyHistory.length > 10) {
            this.stats.latencyHistory.shift();
        }
        
        // Calculate average latency
        const sum = this.stats.latencyHistory.reduce((a, b) => a + b, 0);
        this.stats.avgLatency = Math.round(sum / this.stats.latencyHistory.length);
        
        this.emit('latencyUpdate', {
            current: latency,
            average: this.stats.avgLatency,
            history: [...this.stats.latencyHistory]
        });
    }

    getAuthToken() {
        // Try multiple token sources
        return localStorage.getItem('token') || 
               localStorage.getItem('authToken') ||
               sessionStorage.getItem('token') ||
               null;
    }

    joinUserRoom() {
        const token = this.getAuthToken();
        if (token && this.isConnected) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                this.socket.emit('joinRoom', {
                    roomId: `user-${payload.id}`,
                    roomType: 'personal'
                });
            } catch (error) {
                console.error('Failed to parse token for room joining:', error);
            }
        }
    }

    // Public API methods
    emit(event, data, callback) {
        if (!this.socket) {
            console.warn('Socket not connected. Event not sent:', event);
            return false;
        }

        if (callback) {
            this.socket.emit(event, data, callback);
        } else {
            this.socket.emit(event, data);
        }
        return true;
    }

    on(event, callback) {
        if (!this.socket) {
            // Store listener for when socket connects
            if (!this.eventListeners.has(event)) {
                this.eventListeners.set(event, []);
            }
            this.eventListeners.get(event).push(callback);
            return;
        }

        this.socket.on(event, callback);
    }

    off(event, callback) {
        if (!this.socket) return;
        this.socket.off(event, callback);
    }

    once(event, callback) {
        if (!this.socket) return;
        this.socket.once(event, callback);
    }

    // Connection lifecycle callbacks
    onConnect(callback) {
        this.connectionCallbacks.onConnect.push(callback);
    }

    onDisconnect(callback) {
        this.connectionCallbacks.onDisconnect.push(callback);
    }

    onReconnect(callback) {
        this.connectionCallbacks.onReconnect.push(callback);
    }

    onError(callback) {
        this.connectionCallbacks.onError.push(callback);
    }

    // Room management
    joinRoom(roomId, roomType = 'chat') {
        return this.emit('joinRoom', { roomId, roomType });
    }

    leaveRoom(roomId) {
        return this.emit('leaveRoom', roomId);
    }

    sendRoomMessage(roomId, message, type = 'text') {
        return this.emit('roomMessage', { roomId, message, type });
    }

    // Private messaging
    sendPrivateMessage(recipientId, message, type = 'text') {
        return this.emit('privateMessage', { recipientId, message, type });
    }

    // Typing indicators
    setTyping(roomId, isTyping = true) {
        return this.emit('typing', { roomId, isTyping });
    }

    // Quiz features
    joinQuiz(quizId) {
        return this.emit('joinQuiz', { quizId, userId: this.getUserId() });
    }

    submitAnswer(quizId, questionId, answer, timeSpent) {
        return this.emit('submitAnswer', { quizId, questionId, answer, timeSpent });
    }

    requestLeaderboard(quizId) {
        return this.emit('requestLeaderboard', quizId);
    }

    // User presence
    updatePresence(status) {
        return this.emit('updatePresence', status);
    }

    // Utility methods
    getUserId() {
        const token = this.getAuthToken();
        if (!token) return null;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.id;
        } catch (error) {
            return null;
        }
    }

    disconnect() {
        if (this.socket) {
            this.stopPingMonitoring();
            this.socket.disconnect();
            this.socket = null;
        }
        this.isConnected = false;
        this.isReconnecting = false;
    }

    // Connection status
    getConnectionStatus() {
        return {
            connected: this.isConnected,
            reconnecting: this.isReconnecting,
            socketId: this.socket?.id,
            stats: this.stats
        };
    }

    // Health check
    async healthCheck() {
        return new Promise((resolve) => {
            if (!this.isConnected) {
                resolve({ healthy: false, reason: 'Not connected' });
                return;
            }

            const timeout = setTimeout(() => {
                resolve({ healthy: false, reason: 'Ping timeout' });
            }, 5000);

            this.once('pong', () => {
                clearTimeout(timeout);
                resolve({ 
                    healthy: true, 
                    latency: this.stats.avgLatency,
                    socketId: this.socket.id
                });
            });

            this.emit('ping', { timestamp: Date.now() });
        });
    }
}

// Create singleton instance
const socketManager = new SocketManager();

// Export both the instance and the class
export default socketManager;
export { SocketManager };
