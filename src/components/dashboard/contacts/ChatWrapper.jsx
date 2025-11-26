import { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getContacts, getOneContact, getCreateRoom, getRoomMessages, getUserContacts } from '@/redux/slices/contactsSlice';
import Pagination from '../utils/Pagination';
import PageOf from '@/components/dashboard/utils/PageOf';
import ChatCard from './ChatCard';
import ChatMessages from './ChatMessages';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import RoomMessages from './RoomMessages';
import NotAuthenticated from '@/components/auth/NotAuthenticated';

import { notify } from '@/utils/notifyToast';

// Socket.io
import { socket } from '@/utils/socket';

const ChatWrapper = () => {

    // Redux
    const dispatch = useDispatch();
    const contacts = useSelector(state => state.contacts);
    const { totalPages, isLoading, oneChatRoom } = contacts;
    const [pageNo, setPageNo] = useState(1);
    const [onlineList, setOnlineList] = useState([]);
    const { user, isAuthenticated } = useSelector(state => state.auth);

    const setupSocketListeners = () => {
        if (!socket) return;

        // Listen for 'newUserOnline' event
        socket.on('newUserOnline', ({ onlineUsers, new_user }) => {
            setOnlineList(onlineUsers);

            // Notify the user of the new user online
            if (new_user && new_user.name && user && new_user.name !== user.name) {
                notify(`${new_user.name} is online`);
            }
        });
    };

    // Lifecycle methods
    useEffect(() => {
        if (user?.role !== 'Visitor') {
            dispatch(getContacts(pageNo));
        } else {
            dispatch(getUserContacts(user?.email));
        }

        if (localStorage.getItem('user')) {
            const user = JSON.parse(localStorage.getItem('user'));

            if (user && user.name) {
                document.title = `${user.name.charAt(0).toUpperCase() + user.name.slice(1)} - Contacts`;
                if (socket) {
                    socket.emit('newUserConnected', {
                        _id: user._id,
                        name: user.name,
                        email: user.email
                    });
                }
            }
        }

        // Get messages of the room
        if (oneChatRoom) {
            dispatch(getRoomMessages(oneChatRoom._id));
        }
    }, [pageNo, oneChatRoom, user, dispatch]);

    useEffect(() => {
        setupSocketListeners();

        // Cleanup socket listeners on component unmount
        return () => {
            socket.off('newUserOnline');
        };
    }, []);

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isChatRoomOpen, setIsChatRoomOpen] = useState(false);
    const [oON1room, setOpenRoom] = useState();

    const openChat = (chat_id) => {
        setIsChatRoomOpen(false);
        setIsChatOpen(true);
        dispatch(getOneContact(chat_id));
    };

    // When joining the room
    const openChat1on1Room = ({ roomName, senderID, receiverID, receiverName, username }) => {
        setIsChatOpen(false);
        setIsChatRoomOpen(true);
        setOpenRoom({ roomName, senderID, receiverID, receiverName });
        dispatch(getCreateRoom({ roomName, users: [senderID, receiverID] }));

        // Join the room
        if (roomName !== '' && username !== '' && socket) {
            socket.emit('join_room', { username, roomName });
        }
    };

    if (!isAuthenticated) return <NotAuthenticated />;
    if (isLoading) return <QBLoadingSM />;

    return (<Row className='chat-view vh-100'>
        <Col sm="3" style={{ height: '99%' }} className="my-2 overflow-auto">
            {user?.role?.includes('Admin') ? <PageOf pageNo={pageNo} numberOfPages={totalPages} /> : null}
            <ChatCard openChat={openChat} />
            {user?.role !== 'Visitor' ? <><Pagination pageNo={pageNo} setPageNo={setPageNo} numberOfPages={totalPages} /></> : null}
        </Col>

        <Col sm="6" style={{ height: '99%' }} className="my-2 bg-white overflow-auto">
            {isChatOpen ? <ChatMessages onlineList={onlineList} /> :
                isChatRoomOpen ? <RoomMessages oON1room={oON1room} onlineList={onlineList} /> : null}
        </Col>

        <Col sm="3" style={{ height: '99%' }} className="overflow-auto">
            <div>
                <h5 className='text-center my-4 fw-bolder'>
                    CHAT WITH ({onlineList.length})
                </h5>
                <ul style={{ listStyle: 'none' }}>

                    <li style={{ fontSize: '.8rem', margin: '4px' }}>
                        <Link to={'#'}>
                            {user.name.charAt(0).toUpperCase() + user.name.slice(1)}(You)
                        </Link>
                    </li>
                    {onlineList.filter(onlineUser => onlineUser.email !== user.email).map(onlineUser => {
                        const sortedRmArr = [user.email, onlineUser.email].sort((a, b) => a.localeCompare(b));
                        return (<li key={onlineUser.socketID} style={{ fontSize: '.8rem', margin: '4px' }}>
                            <Link to={'#'}
                                onClick={() => user.email !== onlineUser.email && openChat1on1Room({
                                    roomName: sortedRmArr[0] + '_' + sortedRmArr[1],
                                    senderID: user._id,
                                    receiverID: onlineUser._id,
                                    receiverName: onlineUser.name,
                                    username: user.name
                                })}>
                                {onlineUser.name.charAt(0).toUpperCase() + onlineUser.name.slice(1)}
                                <small style={{ fontSize: '.5rem', verticalAlign: 'middle' }}> 🟢</small>
                            </Link>
                        </li>);
                    })}
                </ul>
            </div>
        </Col>
    </Row>
    );
};

export default ChatWrapper;
