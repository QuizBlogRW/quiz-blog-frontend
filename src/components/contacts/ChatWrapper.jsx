import React, { useState, useEffect, useContext } from 'react'
import { Row, Col, Button } from 'reactstrap'
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { authContext, currentUserContext, logRegContext } from '../../appContexts'
import { getContacts, getOneContact, getCreateRoom, getRoomMessages, getUserContacts } from '../../redux/slices/contactsSlice'
import Pagination from '../dashboard/Pagination'
import PageOf from '../dashboard/PageOf'
import ChatCard from './ChatCard'
import ChatMessages from './ChatMessages'
import QBLoadingSM from '../rLoading/QBLoadingSM'
import RoomMessages from './RoomMessages'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Socket.io
import { socket } from '../../utils/socket'

const ChatWrapper = () => {
    const notify = (message) => {
        toast.success(message, { position: "bottom-right" });
    };


    // Redux
    const dispatch = useDispatch()
    const contacts = useSelector(state => state.contacts)
    const { totalPages, isLoading, oneChatRoom } = contacts

    // Contexts
    const auth = useContext(authContext)
    const currentUser = useContext(currentUserContext)
    const { toggleL } = useContext(logRegContext)

    const uRole = currentUser && currentUser.role
    const userEmail = currentUser && currentUser.email
    const [pageNo, setPageNo] = useState(1)
    const [onlineList, setOnlineList] = useState([])

    // Lifecycle methods
    useEffect(() => {
        uRole !== 'Visitor' ? dispatch(getContacts(pageNo)) : dispatch(getUserContacts(userEmail))
        if (localStorage.getItem('user')) {
            socket.emit('newUserConnected', {
                _id: JSON.parse(localStorage.getItem('user'))._id,
                name: JSON.parse(localStorage.getItem('user')).name,
                email: JSON.parse(localStorage.getItem('user')).email
            });
        }

        // Get messages of the room
        if (oneChatRoom) {
            dispatch(getRoomMessages(oneChatRoom._id))
        }

        // Listen for 'newUserOnline' event
        socket.on('newUserOnline', ({ onlineUsers, new_user }) => {
            setOnlineList(onlineUsers)

            // Notify the user of the new user online
            if (new_user.name !== currentUser.name) {
                notify(`${new_user.name} is online`)
            }
        });
    }, [pageNo, oneChatRoom])

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isChatRoomOpen, setIsChatRoomOpen] = useState(false);
    const [oON1room, setOpenRoom] = useState();

    const openChat = (chat_id) => {
        setIsChatRoomOpen(false);
        setIsChatOpen(true);
        dispatch(getOneContact(chat_id))
    }

    // When joining the room
    const openChat1on1Room = ({ roomName, senderID, receiverID, receiverName, username }) => {
        setIsChatOpen(false);
        setIsChatRoomOpen(true);
        setOpenRoom({ roomName, senderID, receiverID, receiverName })
        dispatch(getCreateRoom({ roomName, users: [senderID, receiverID] }))

        // Join the room
        if (roomName !== '' && username !== '') {
            console.log('Joining room: ', roomName);
            socket.emit('join_room', { username, roomName });
        }
    }

    return (
        <>
            {
                auth.isAuthenticated ?
                    <>
                        {isLoading ?
                            <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
                                <QBLoadingSM title='contacts' />
                            </div> :

                            <Row className='chat-view vh-100'>
                                <Col sm="3" style={{ height: "95%" }} className="my-2 overflow-auto">
                                    {(uRole === 'Admin' || uRole === 'SuperAdmin') ? <PageOf pageNo={pageNo} numberOfPages={totalPages} /> : null}
                                    <ChatCard openChat={openChat} />
                                    {uRole !== 'Visitor' ? <><Pagination pageNo={pageNo} setPageNo={setPageNo} numberOfPages={totalPages} /></> : null}
                                </Col>

                                <Col sm="6" style={{ height: "95%" }} className="my-2 bg-white overflow-auto">
                                    {isChatOpen ? <ChatMessages onlineList={onlineList} /> :
                                        isChatRoomOpen ? <RoomMessages oON1room={oON1room} onlineList={onlineList} /> : null}
                                </Col>

                                <Col sm="3" style={{ height: "95%" }} className="overflow-auto">
                                    <div>
                                        <h5 className='text-center my-4 fw-bolder'>
                                            CHAT WITH ({onlineList.length})
                                        </h5>
                                        <ul style={{ listStyle: "none" }}>

                                            <li style={{ fontSize: ".8rem", margin: "4px" }}>
                                                <Link to={'#'}>
                                                    {currentUser.name.charAt(0).toUpperCase() + currentUser.name.slice(1)}(You)
                                                </Link>
                                            </li>
                                            {onlineList.filter(onlineUser => onlineUser.email !== currentUser.email).map(onlineUser => {
                                                const sortedRmArr = [currentUser.email, onlineUser.email].sort((a, b) => a.localeCompare(b));
                                                return (<li key={onlineUser.socketID} style={{ fontSize: ".8rem", margin: "4px" }}>
                                                    <Link to={'#'}
                                                        onClick={() => currentUser.email !== onlineUser.email && openChat1on1Room({
                                                            roomName: sortedRmArr[0] + "_" + sortedRmArr[1],
                                                            senderID: currentUser._id,
                                                            receiverID: onlineUser._id,
                                                            receiverName: onlineUser.name,
                                                            username: currentUser.name
                                                        })}>
                                                        {onlineUser.name.charAt(0).toUpperCase() + onlineUser.name.slice(1)}&nbsp;
                                                        <small style={{ fontSize: ".5rem", verticalAlign: "middle" }}>
                                                            🟢
                                                        </small>
                                                    </Link>
                                                </li>)
                                            })}
                                        </ul>
                                    </div>
                                </Col>
                                <ToastContainer />
                            </Row>
                        }
                    </> :
                    <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
                        {
                            auth.isLoading ?
                                <QBLoadingSM /> :
                                <Button color="link" className="fw-bolder my-5 border rounded" onClick={toggleL} style={{ backgroundColor: "#ffc107", color: "#157A6E", fontSize: "1.5vw", boxShadow: "-2px 2px 1px 2px #157A6E", border: "2px solid #157A6E" }}>
                                    Login first
                                </Button>
                        }
                    </div>
            }
        </>
    )
}

export default ChatWrapper