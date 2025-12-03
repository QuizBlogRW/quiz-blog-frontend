import { useState, useEffect, useRef } from 'react';
import { Form, Button } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import moment from 'moment';
import { replyContact } from '@/redux/slices/contactsSlice';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import { notify } from '@/utils/notifyToast';
import { socket } from '@/utils/socket';
import SingleReply from './SingleReply';

const ChatMessages = ({ onlineList }) => {

    const { oneContact, isLoading } = useSelector(state => state.contacts);
    const { user } = useSelector(state => state.users);

    const { replies, message, contact_name, _id, email, contact_date } = oneContact;
    const formattedDate = moment(new Date(contact_date)).format('DD MMM YYYY, HH:mm');

    const dispatch = useDispatch();

    const lastMessageRef = useRef(null);
    const [replState, setReplState] = useState(oneContact ? replies : []);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const toMail = user.role === 'Visitor' ? 'quizblog.rw@gmail.com' : email;
    const whoWith = user.role === 'Visitor' ? { username: 'Quiz-Blog Rwanda', email: 'quizblog.rw@gmail.com' } : { username: contact_name, email: email };
    const onlineStatus = onlineList.some(user => user.email === toMail) ? '🟢' : '🔴';

    useEffect(() => {
        if (message) {
            try {
                const content = convertFromRaw(JSON.parse(message));
                setEditorState(EditorState.createWithContent(content));
            } catch (error) {
                console.log(error);
            }
        }
    }, [oneContact]);

    useEffect(() => {
        if (oneContact) {
            setReplState(replies || []);
        }
    }, [oneContact]);

    const sendMessage = e => {
        e.preventDefault();
        const raw = convertToRaw(editorState.getCurrentContent());
        const string = JSON.stringify(raw);

        const newReply = {
            reply_name: user.name,
            email: user.email,
            to_contact: toMail,
            to_contact_name: contact_name,
            contact_question: message,
            message: string
        };

        dispatch(replyContact({ idToUpdate: _id, reply: newReply }));
        setEditorState(EditorState.createEmpty());
    };

    useEffect(() => {
        if (!socket) return;

        const handleReplyReceived = replyReceived => {
            setReplState(prevReplies => [...prevReplies, replyReceived]);
            if (replyReceived.email !== user.email) {
                notify(`${replyReceived.reply_name} replied to your message`);
            }
        };

        socket.on('replyReceived', handleReplyReceived);
        return () => socket.off('replyReceived', handleReplyReceived);
    }, [user.email]);

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [replState]);

    return (
        isLoading ? <QBLoadingSM title='chat messages' /> :
            <div className='h-100'>
                <h4 className='text-center py-2 py-lg-4 mt-5 mt-lg-3 fw-bolder border rounded' style={{ backgroundColor: 'burlywood' }}>
                    {whoWith.username}&nbsp;
                    <small style={{ fontSize: '.5rem', verticalAlign: 'middle' }}>{onlineStatus}</small>
                </h4>
                <strong>{message}</strong>
                <small className="text-info mb-2">
                    <i className='text-start d-block mt-2' style={{ fontSize: '.7rem', color: '#6a89cc' }}>
                        {formattedDate === 'Invalid date' ? '' : formattedDate}
                    </i>
                </small>
                <hr />
                {replState.map((reply, index) => <SingleReply key={index} reply={reply} />)}
                <hr />
                <Form className='w-100 m-1 pb-3 mb-lg-5 d-flex flex-column align-center justify-center' onSubmit={sendMessage}>
                    <Editor
                        editorState={editorState}
                        onEditorStateChange={setEditorState}
                        wrapperClassName="wrapper-class"
                        editorClassName="editor-class"
                        toolbarClassName="toolbar-class"
                        spellCheck={true}
                        placeholder="Type your message here..."
                        toolbar={{
                            fontFamily: { options: ['Tw Cen MT', 'Amiri', 'Helvetica', 'Trebuchet MS', 'sans-serif'] },
                        }}
                        editorStyle={{ height: '200px' }}
                    />
                    <Button className='mx-auto text-white mt-4' style={{ height: 'max-content', backgroundColor: 'var(--brand)' }}>
                        Send
                    </Button>
                    <div ref={lastMessageRef} />
                </Form>
            </div>
    );
};

export default ChatMessages;
