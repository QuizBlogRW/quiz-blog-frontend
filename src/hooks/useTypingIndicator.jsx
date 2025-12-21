import { useState, useEffect, useRef } from 'react';
import { socketEmit, socketOn, socketOff } from '@/utils/socket';

/**
 * Hook to handle typing indicators
 * @param {string} roomID - Room ID
 * @param {object} user - { id, name }
 */
export const useTypingIndicator = (roomID, user) => {
    const [typingUsers, setTypingUsers] = useState([]);

    // Emit typing event
    const typingTimeout = useRef(null);

    const handleTyping = () => {
        socketEmit("typing", { roomID, user });

        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => {
            socketEmit("stopTyping", { roomID, user });
        }, 800);
    };

    // Listen for typing updates
    useEffect(() => {
        if (!roomID) return;

        const handleUserTyping = ({ user }) => {
            if (user.id !== user.id) {
                setTypingUsers(prev => {
                    if (!prev.find(u => u.id === user.id)) return [...prev, user];
                    return prev;
                });
            }
        };

        const handleUserStoppedTyping = ({ user }) => {
            setTypingUsers(prev => prev.filter(u => u.id !== user.id));
        };

        socketOn('userTyping', handleUserTyping);
        socketOn('userStoppedTyping', handleUserStoppedTyping);

        return () => {
            socketOff('userTyping', handleUserTyping);
            socketOff('userStoppedTyping', handleUserStoppedTyping);
        };
    }, [roomID, user.id]);

    return { typingUsers, handleTyping };
};

export const useContactTypingIndicator = (roomOrContactId, currentUser) => {
    const [typingUsers, setTypingUsers] = useState([]);

    // Emit typing event
    const typingTimeout = useRef(null);

    const handleTyping = () => {
        socketEmit("typing", { roomOrContactId, user: currentUser });

        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => {
            socketEmit("stopTyping", { roomOrContactId, user: currentUser });
        }, 800);
    };

    // Listen for typing updates
    useEffect(() => {
        if (!roomOrContactId) return;
        const handleUserTyping = ({ user }) => {
            if (user.id !== currentUser.id) {
                setTypingUsers(prev => {
                    if (!prev.find(u => u.id === user.id)) return [...prev, user];
                    return prev;
                });
            }
        };

        const handleUserStoppedTyping = ({ user }) => {
            setTypingUsers(prev => prev.filter(u => u.id !== user.id));
        };

        socketOn('userTyping', handleUserTyping);
        socketOn('userStoppedTyping', handleUserStoppedTyping);

        return () => {
            socketOff('userTyping', handleUserTyping);
            socketOff('userStoppedTyping', handleUserStoppedTyping);
        };
    }, [roomOrContactId, currentUser.id]);

    return { typingUsers, handleTyping };
};
