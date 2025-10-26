import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Editor, EditorState, convertFromRaw } from 'draft-js';

const SingleReply = ({ reply }) => {

    const { user } = useSelector(state => state.auth);
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

    useEffect(() => {
        if (reply?.message) {
            try {
                const content = convertFromRaw(JSON.parse(reply.message));
                setEditorState(EditorState.createWithContent(content));
            } catch {
                const content = convertFromRaw({
                    entityMap: {},
                    blocks: [{ text: reply.message, type: 'unstyled' }]
                });
                setEditorState(EditorState.createWithContent(content));
            }
        }
    }, [reply]);

    const isUser = reply.email === user.email;

    const bubbleStyle = useMemo(() => ({
        backgroundColor: isUser ? '#f1f0f0' : '#6a89cc',
        color: isUser ? '' : 'white',
        borderRadius: '10px',
        maxWidth: '80%',
        wordWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        fontSize: '.8rem',
        fontWeight: '500',
        lineHeight: '1.2',
        verticalAlign: 'baseline',
        wordBreak: 'break-word'
    }), [isUser]);

    return (
        <div className={`mt-2 mt-lg-3 ${isUser ? 'text-end' : 'text-start'}`}>
            <div className={`bubble d-inline-block p-2 ${isUser ? 'ms-auto' : 'me-auto'}`} style={bubbleStyle}>
                <Editor editorState={editorState} readOnly={true} />
            </div>
            <small className="text-info">
                <i className={`d-block mt-2 ${isUser ? 'text-end' : 'text-start'}`} style={{ fontSize: '.7rem', color: '#999' }}>
                    {moment(reply.reply_date).format('YYYY-MM-DD, HH:mm')}
                </i>
            </small>
        </div>
    );
};

export default SingleReply;