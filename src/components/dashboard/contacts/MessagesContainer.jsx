import { useMemo, memo, useRef, useEffect } from 'react';
import { formatDateTime } from '@/utils/dateFormat';
import { useSelector } from 'react-redux';

// Parse Draft.js or return plain text
const parseMessage = (message) => {
    if (!message) return '';

    try {
        // Try parsing as Draft.js JSON
        const parsed = JSON.parse(message);
        if (parsed.blocks && Array.isArray(parsed.blocks)) {
            // Extract text from all blocks
            return parsed.blocks
                .map(block => block.text || '')
                .filter(Boolean)
                .join('\n');
        }
        return message;
    } catch {
        // Return as-is if not JSON
        return message;
    }
};

// Message bubble component for better performance
const MessageBubble = memo(({ message, isMe, formattedDate, isArchive }) => {

    const bubbleStyle = useMemo(() => ({
        backgroundColor: isMe ? '#f1f0f0' : '#6a89cc',
        color: isMe ? '#333' : '#fff',
        borderRadius: '10px',
        maxWidth: '80%',
        wordWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        fontSize: '0.875rem',
        fontWeight: '500',
        lineHeight: '1.4',
        wordBreak: 'break-word',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    }), [isMe]);

    const containerClass = useMemo(
        () => `d-flex flex-column ${isMe ? 'align-items-end' : 'align-items-start'} mb-3`,
        [isMe]
    );

    // IF CONTACT REPLIES, PARSE THEM
    const messageText = useMemo(
        () => isArchive ? parseMessage(message) : message,
        [message]
    );

    return (
        <div className={containerClass}>
            <div className="bubble p-2 px-3" style={bubbleStyle}>
                {messageText}
            </div>
            {formattedDate && (
                <small className="text-muted mt-1" style={{ fontSize: '0.7rem' }}>
                    <time dateTime={message.createdAt}>
                        {formattedDate}
                    </time>
                </small>
            )}
        </div>
    );
});

MessageBubble.displayName = 'MessageBubble';

const MessagesContainer = ({ isArchive, messages, typingUsers }) => {

    const user = useSelector(state => state.users.user);
    const lastMessageRef = useRef(null);

    /* ------------------ AUTO SCROLL ------------------ */
    useEffect(() => {
        if (lastMessageRef.current instanceof HTMLElement) {
            lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages?.length, typingUsers?.length]);
    
    return (
        <div className="flex-grow-1 overflow-auto px-2 mb-3">
            {messages?.length > 0 ? (
                <>
                    {messages.map((msg, idx) => {
                        const formattedDate = msg.createdAt ? formatDateTime(msg.createdAt) : '';
                        const isMe = isArchive ? msg?.email === user?.email : msg?.sender === user?._id;

                        return (
                            <MessageBubble
                                key={`${msg._id || idx}-${msg.createdAt}`}
                                message={isArchive ? msg.message : msg.content}
                                isMe={isMe}
                                formattedDate={formattedDate}
                                isArchive={isArchive}
                            />
                        );
                    })}
                </>
            ) : (
                <div className="text-center text-muted py-5">
                    <svg
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="mb-3 opacity-50"
                    >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <p className="mb-0">Start a new conversation!</p>
                </div>
            )}

            {/* Typing Indicator */}
            {typingUsers?.length > 0 && (
                <div className="mb-2 ps-2">
                    <small style={{ fontSize: '0.75rem', color: '#e056fd' }}>
                        <i>
                            {typingUsers.map(u => u.name).join(', ')}{' '}
                            {typingUsers.length === 1 ? 'is' : 'are'} typing...
                        </i>
                    </small>
                </div>
            )}

            <div ref={lastMessageRef} />
        </div>)
};
export default MessagesContainer;
