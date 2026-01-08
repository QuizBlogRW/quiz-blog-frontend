import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Button, Col } from 'reactstrap';
import { formatDateTime } from '@/utils/dateFormat';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import MessagesContainer from '../MessagesContainer';
import SelectChat from "@/components/dashboard/utils/SelectChat";


// Utility function - moved outside component for better performance
const sortRepliesByDate = (replies) => {
    if (!Array.isArray(replies)) return [];
    return [...replies].sort(
        (a, b) => new Date(a.reply_date) - new Date(b.reply_date)
    );
};

const ConversationMessages = ({ onClose, isConversationOpen }) => {
    const oneContact = useSelector(state => state.contacts.oneContact);
    const isLoading = useSelector(state => state.contacts.isLoading);
    const messagesEndRef = useRef(null);
    const prevContactIdRef = useRef(null);
    const [replies, setReplies] = useState([]);

    const formattedDate = oneContact?.contact_date ? formatDateTime(oneContact?.contact_date) : '';

    // Simplified reply management
    useEffect(() => {
        if (!oneContact?._id) return;

        const contactChanged = prevContactIdRef.current !== oneContact._id;

        if (contactChanged) {
            // New contact - replace all replies
            prevContactIdRef.current = oneContact._id;
            setReplies(sortRepliesByDate(oneContact.replies));
        } else {
            // Same contact - update if new replies exist
            const newReplies = oneContact.replies || [];
            if (newReplies.length !== replies.length) {
                setReplies(sortRepliesByDate(newReplies));
            }
        }
    }, [oneContact]);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [replies.length]);

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center h-100">
                <QBLoadingSM title='Loading messages' />
            </div>
        );
    }

    if (!oneContact) {
        return (
            <div className="text-center text-muted mt-5">
                No conversation selected
            </div>
        );
    }

    const { contact_name, email, message } = oneContact;

    return (
        <Col
            xs="12"
            sm="8"
            className="d-flex flex-column overflow-auto bg-white rounded p-2"
            style={{ maxHeight: '100vh' }}
        >

            {isConversationOpen ?
                <div className='d-flex flex-column h-100'>
                    {/* Header */}
                    <div className="border-bottom pb-2 mb-3 d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                            <h6 className="mb-1">{contact_name}</h6>
                            <small className="text-muted">{email}</small>
                            {formattedDate && (
                                <small className="d-block text-info mt-1" style={{ fontSize: '.7rem' }}>
                                    <i>{formattedDate}</i>
                                </small>
                            )}
                        </div>
                        {onClose && (
                            <Button
                                close
                                onClick={onClose}
                                aria-label="Close conversation"
                            />
                        )}
                    </div>

                    {/* Original Message */}
                    <div className="mb-3 p-2 bg-light rounded">
                        <strong className="d-block mb-1">Original Message:</strong>
                        <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                            {message}
                        </p>
                    </div>

                    {/* Replies */}
                    <div className="flex-grow-1 overflow-auto">
                        {replies?.length > 0 &&
                            <>
                                <h6 className="text-muted mb-2">
                                    Replies ({replies.length})
                                </h6>
                                <MessagesContainer
                                    isArchive={true}
                                    messages={replies}
                                />
                            </>}
                        <div ref={messagesEndRef} />
                    </div>
                </div> :
                <SelectChat />
            }
        </Col>
    );
};

export default ConversationMessages;
