// Enhanced React Socket Hook
// Provides easy integration of socket functionality into React components

import { useState, useEffect, useRef, useCallback } from 'react';
import socketManager from '@/utils/enhanced-socket';

export const useSocket = (options = {}) => {

    const [isConnected, setIsConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [serverStats, setServerStats] = useState(null);
    const [latency, setLatency] = useState(null);
    const [error, setError] = useState(null);

    const reconnectTimeoutRef = useRef(null);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;

        // Connect socket if not already connected
        if (!socketManager.socket || !socketManager.isConnected) {
            socketManager.connect(options);
        }

        // Set up connection status listeners
        const handleConnect = () => {
            if (!mountedRef.current) return;
            setIsConnected(true);
            setConnectionStatus('connected');
            setError(null);
        };

        const handleDisconnect = (reason) => {
            if (!mountedRef.current) return;
            setIsConnected(false);
            setConnectionStatus('disconnected');
            setError(`Disconnected: ${reason}`);
        };

        const handleReconnect = () => {
            if (!mountedRef.current) return;
            setConnectionStatus('connected');
            setError(null);
        };

        const handleError = (error) => {
            if (!mountedRef.current) return;
            setError(error.message);
            setConnectionStatus('error');
        };

        const handleOnlineUsers = (data) => {
            if (!mountedRef.current) return;
            setOnlineUsers(data.users || []);
        };

        const handleServerStats = (stats) => {
            if (!mountedRef.current) return;
            setServerStats(stats);
        };

        const handleLatencyUpdate = (data) => {
            if (!mountedRef.current) return;
            setLatency(data);
        };

        const handleConnectionError = (error) => {
            if (!mountedRef.current) return;
            setError(error.message);
            setConnectionStatus('error');
        };

        // Register event listeners
        socketManager.onConnect(handleConnect);
        socketManager.onDisconnect(handleDisconnect);
        socketManager.onReconnect(handleReconnect);
        socketManager.onError(handleError);

        socketManager.on('onlineUsers', handleOnlineUsers);
        socketManager.on('serverStats', handleServerStats);
        socketManager.on('latencyUpdate', handleLatencyUpdate);
        socketManager.on('connectionError', handleConnectionError);

        // Initial state check
        const status = socketManager.getConnectionStatus();
        setIsConnected(status.connected);
        setConnectionStatus(status.connected ? 'connected' : 'disconnected');

        return () => {
            mountedRef.current = false;
            // Clean up listeners
            socketManager.off('onlineUsers', handleOnlineUsers);
            socketManager.off('serverStats', handleServerStats);
            socketManager.off('latencyUpdate', handleLatencyUpdate);
            socketManager.off('connectionError', handleConnectionError);

            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, []);

    const emit = useCallback((event, data, callback) => {
        return socketManager.emit(event, data, callback);
    }, []);

    const on = useCallback((event, callback) => {
        socketManager.on(event, callback);

        // Return cleanup function
        return () => socketManager.off(event, callback);
    }, []);

    const off = useCallback((event, callback) => {
        socketManager.off(event, callback);
    }, []);

    const reconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }

        setConnectionStatus('connecting');
        reconnectTimeoutRef.current = setTimeout(() => {
            socketManager.connect(options);
        }, 1000);
    }, [options]);

    const disconnect = useCallback(() => {
        socketManager.disconnect();
    }, []);

    const healthCheck = useCallback(async () => {
        return await socketManager.healthCheck();
    }, []);

    return {
        // Connection state
        isConnected,
        connectionStatus,
        error,

        // Data
        onlineUsers,
        serverStats,
        latency,

        // Methods
        emit,
        on,
        off,
        reconnect,
        disconnect,
        healthCheck,

        // Socket instance (for advanced usage)
        socket: socketManager.socket,
        socketManager
    };
};

// Specialized hooks for different features
export const usePrivateMessaging = () => {
    const [messages, setMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { on, emit, isConnected } = useSocket();

    useEffect(() => {
        const handlePrivateMessage = (message) => {
            setMessages(prev => [...prev, { ...message, type: 'received' }]);
            setUnreadCount(prev => prev + 1);
        };

        const handleMessageDelivered = (data) => {
            setMessages(prev => prev.map(msg =>
                msg.recipientId === data.recipientId && msg.timestamp === data.timestamp
                    ? { ...msg, delivered: true }
                    : msg
            ));
        };

        const handleMessageError = (error) => {
            console.error('Message error:', error);
        };

        const cleanupPrivateMessage = on('privateMessage', handlePrivateMessage);
        const cleanupDelivered = on('messageDelivered', handleMessageDelivered);
        const cleanupError = on('messageError', handleMessageError);

        return () => {
            cleanupPrivateMessage();
            cleanupDelivered();
            cleanupError();
        };
    }, [on]);

    const sendMessage = useCallback((recipientId, message, type = 'text') => {
        if (!isConnected) return false;

        const messageData = {
            recipientId,
            message,
            type,
            timestamp: new Date(),
            delivered: false
        };

        setMessages(prev => [...prev, { ...messageData, type: 'sent' }]);
        return emit('privateMessage', { recipientId, message, type });
    }, [emit, isConnected]);

    const markAsRead = useCallback(() => {
        setUnreadCount(0);
    }, []);

    const clearMessages = useCallback(() => {
        setMessages([]);
        setUnreadCount(0);
    }, []);

    return {
        messages,
        unreadCount,
        sendMessage,
        markAsRead,
        clearMessages,
        isConnected
    };
};

export const useRoomChat = (roomId) => {
    const [messages, setMessages] = useState([]);
    const [members, setMembers] = useState([]);
    const [typingUsers, setTypingUsers] = useState([]);
    const [isJoined, setIsJoined] = useState(false);
    const { on, emit, isConnected } = useSocket();

    const typingTimeoutRef = useRef({});

    useEffect(() => {
        if (!roomId) return;

        const handleRoomMessage = (message) => {
            setMessages(prev => [...prev, message]);
        };

        const handleUserJoinedRoom = (user) => {
            setMembers(prev => [...prev.filter(m => m.userId !== user.userId), user]);
        };

        const handleUserLeftRoom = (user) => {
            setMembers(prev => prev.filter(m => m.userId !== user.userId));
        };

        const handleUserTyping = (data) => {
            const { userId, userName, isTyping } = data;

            if (typingTimeoutRef.current[userId]) {
                clearTimeout(typingTimeoutRef.current[userId]);
            }

            if (isTyping) {
                setTypingUsers(prev => {
                    if (!prev.find(u => u.userId === userId)) {
                        return [...prev, { userId, userName }];
                    }
                    return prev;
                });

                // Auto-remove typing indicator after 3 seconds
                typingTimeoutRef.current[userId] = setTimeout(() => {
                    setTypingUsers(prev => prev.filter(u => u.userId !== userId));
                    delete typingTimeoutRef.current[userId];
                }, 3000);
            } else {
                setTypingUsers(prev => prev.filter(u => u.userId !== userId));
                delete typingTimeoutRef.current[userId];
            }
        };

        const handleRoomJoined = () => {
            setIsJoined(true);
        };

        const cleanupMessage = on('roomMessage', handleRoomMessage);
        const cleanupJoined = on('userJoinedRoom', handleUserJoinedRoom);
        const cleanupLeft = on('userLeftRoom', handleUserLeftRoom);
        const cleanupTyping = on('userTyping', handleUserTyping);
        const cleanupRoomJoined = on('roomJoined', handleRoomJoined);

        return () => {
            cleanupMessage();
            cleanupJoined();
            cleanupLeft();
            cleanupTyping();
            cleanupRoomJoined();

            // Clean up typing timeouts
            Object.values(typingTimeoutRef.current).forEach(clearTimeout);
            typingTimeoutRef.current = {};
        };
    }, [roomId, on]);

    const joinRoom = useCallback((roomType = 'chat') => {
        if (!roomId || !isConnected) return false;
        return emit('joinRoom', { roomId, roomType });
    }, [roomId, emit, isConnected]);

    const leaveRoom = useCallback(() => {
        if (!roomId || !isConnected) return false;
        setIsJoined(false);
        return emit('leaveRoom', roomId);
    }, [roomId, emit, isConnected]);

    const sendMessage = useCallback((message, type = 'text') => {
        if (!roomId || !isConnected || !isJoined) return false;
        return emit('roomMessage', { roomId, message, type });
    }, [roomId, emit, isConnected, isJoined]);

    const setTyping = useCallback((isTyping = true) => {
        if (!roomId || !isConnected || !isJoined) return false;
        return emit('typing', { roomId, isTyping });
    }, [roomId, emit, isConnected, isJoined]);

    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    return {
        messages,
        members,
        typingUsers,
        isJoined,
        joinRoom,
        leaveRoom,
        sendMessage,
        setTyping,
        clearMessages,
        isConnected
    };
};

export const useQuizSession = (quizId) => {
    const [participants, setParticipants] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [isJoined, setIsJoined] = useState(false);
    const [quizStatus, setQuizStatus] = useState('waiting');
    const { on, emit, isConnected } = useSocket();

    useEffect(() => {
        if (!quizId) return;

        const handleParticipantJoined = (data) => {
            setParticipants(prev => [...prev.filter(p => p.userId !== data.userId), data]);
        };

        const handleParticipantLeft = (data) => {
            setParticipants(prev => prev.filter(p => p.userId !== data.userId));
        };

        const handleParticipantProgress = (data) => {
            setParticipants(prev => prev.map(p =>
                p.userId === data.userId ? { ...p, ...data } : p
            ));
        };

        const handleQuizJoined = (data) => {
            setIsJoined(true);
            setQuizStatus(data.status);
        };

        const handleLeaderboardUpdate = (data) => {
            setLeaderboard(data.leaderboard);
        };

        const cleanupJoined = on('participantJoined', handleParticipantJoined);
        const cleanupLeft = on('participantLeft', handleParticipantLeft);
        const cleanupProgress = on('participantProgress', handleParticipantProgress);
        const cleanupQuizJoined = on('quizJoined', handleQuizJoined);
        const cleanupLeaderboard = on('leaderboardUpdate', handleLeaderboardUpdate);

        return () => {
            cleanupJoined();
            cleanupLeft();
            cleanupProgress();
            cleanupQuizJoined();
            cleanupLeaderboard();
        };
    }, [quizId, on]);

    const joinQuiz = useCallback(() => {
        if (!quizId || !isConnected) return false;
        return emit('joinQuiz', { quizId });
    }, [quizId, emit, isConnected]);

    const submitAnswer = useCallback((questionId, answer, timeSpent) => {
        if (!quizId || !isConnected || !isJoined) return false;
        return emit('submitAnswer', { quizId, questionId, answer, timeSpent });
    }, [quizId, emit, isConnected, isJoined]);

    const requestLeaderboard = useCallback(() => {
        if (!quizId || !isConnected) return false;
        return emit('requestLeaderboard', quizId);
    }, [quizId, emit, isConnected]);

    return {
        participants,
        leaderboard,
        isJoined,
        quizStatus,
        joinQuiz,
        submitAnswer,
        requestLeaderboard,
        isConnected
    };
};

export const usePresence = () => {
    const [presence, setPresence] = useState('online');
    const { emit, isConnected } = useSocket();

    const updatePresence = useCallback((status) => {
        if (!isConnected) return false;
        setPresence(status);
        return emit('updatePresence', status);
    }, [emit, isConnected]);

    return {
        presence,
        updatePresence,
        isConnected
    };
};
