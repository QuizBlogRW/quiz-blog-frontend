import React, { useState, useEffect, useContext, useMemo } from 'react'
import { currentUserContext } from '@/appContexts'
import { Editor, EditorState, convertFromRaw } from 'draft-js'
import moment from 'moment'

const SingleReply = ({ reply }) => {
    const currentUser = useContext(currentUserContext)
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty())

    useEffect(() => {
        if (reply?.message) {
            try {
                const content = convertFromRaw(JSON.parse(reply.message))
                setEditorState(EditorState.createWithContent(content))
            } catch {
                const content = convertFromRaw({
                    entityMap: {},
                    blocks: [{ text: reply.message, type: 'unstyled' }]
                })
                setEditorState(EditorState.createWithContent(content))
            }
        }
    }, [reply])

    const isCurrentUser = reply.email === currentUser.email

    const bubbleStyle = useMemo(() => ({
        backgroundColor: isCurrentUser ? '#f1f0f0' : '#6a89cc',
        color: isCurrentUser ? '' : 'white',
        borderRadius: '10px',
        maxWidth: '80%',
        wordWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        fontSize: '.8rem',
        fontWeight: '500',
        lineHeight: '1.2',
        verticalAlign: 'baseline',
        wordBreak: 'break-word'
    }), [isCurrentUser])

    return (
        <div className={`mt-2 mt-lg-3 ${isCurrentUser ? 'text-end' : 'text-start'}`}>
            <div className={`bubble d-inline-block p-2 ${isCurrentUser ? 'ms-auto' : 'me-auto'}`} style={bubbleStyle}>
                <Editor editorState={editorState} readOnly={true} />
            </div>
            <small className="text-info">
                <i className={`d-block mt-2 ${isCurrentUser ? 'text-end' : 'text-start'}`} style={{ fontSize: ".7rem", color: "#999" }}>
                    {moment(reply.reply_date).format('YYYY-MM-DD, HH:mm')}
                </i>
            </small>
        </div>
    )
}

export default SingleReply