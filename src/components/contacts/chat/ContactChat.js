import React, { useState, useEffect, useContext } from 'react'
import { Row, Col } from 'reactstrap'
import { connect } from 'react-redux'
import { Link } from "react-router-dom"
import { getContacts, getUserContacts, deleteContact, } from '../../../redux/contacts/contacts.actions'
import Pagination from '../../webmaster/Pagination'
import LoginModal from '../../auth/LoginModal'
import PageOf from '../../webmaster/PageOf'
import ContactChatCard from './ContactChatCard'
import ChatComponent from './ChatComponent'
import SpinningBubbles from '../../rLoading/SpinningBubbles'
import RoomChatComponent from './RoomChatComponent'
import { authContext, currentUserContext, socketContext, onlineListContext } from '../../../appContexts'
import { useToasts } from 'react-toast-notifications'
import { apiURL } from '../../../redux/config'

// Socket Settings
import io from 'socket.io-client'

const ContactChat = ({ contacts, getContacts, getUserContacts, deleteContact }) => {

    // Contexts
    const auth = useContext(authContext)
    const currentUser = useContext(currentUserContext)

    const userEmail = currentUser && currentUser.email
    const uRole = currentUser && currentUser.role
    const totPages = contacts && contacts.totalPages
    const contactsToUse = contacts && ((uRole === 'Admin' || uRole === 'SuperAdmin') || uRole === 'Creator') ? contacts.allContacts : contacts.userContacts
    const [pageNo, setPageNo] = useState(1)
    const [numberOfPages, setNumberOfPages] = useState(0)

    // Notifications
    const { addToast } = useToasts();
    const socket = React.useMemo(() => io.connect(apiURL), [])

    // Socket join on user load
    const [onlineList, setOnlineList] = useState([])

    useEffect(() => {
        if (currentUser && currentUser.email) {

            // Telling the server that a user has joined
            socket.emit('frontJoinedUser', { user_id: currentUser._id, username: currentUser && currentUser.name, email: currentUser && currentUser.email, role: currentUser && currentUser.role });

            socket.on('onlineUsersList', onlineUsers => {
                setOnlineList(onlineUsers)
            });
        }
    }, [currentUser, socket])

    // Lifecycle methods
    useEffect(() => {
        if (uRole !== 'Visitor') {
            getContacts(pageNo)
            setNumberOfPages(totPages)
        }
        else {
            getUserContacts(userEmail)
        }
    }, [getContacts, getUserContacts, pageNo, userEmail, totPages, uRole])


    // Notifications for joined user
    useEffect(() => {
        if (currentUser && currentUser.role !== 'Visitor') {
            // Receiving the last joined user
            socket.on('backJoinedUser', joinedUser => {
                addToast(`${joinedUser.username} is online!`, {
                    appearance: 'info',
                    autoDismiss: true,
                })
            })
        }
    }, [currentUser, socket, addToast])

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isRoomChatOpen, setIsRoomChatOpen] = useState(false);
    const [chatId, setChatId] = useState('');
    const [room1ON1ToGet, setRoom_1ON1ToGet] = useState();

    const openChat = (chat_id) => {
        setIsRoomChatOpen(false);
        setIsChatOpen(true);
        setChatId(chat_id);
    }

    // When joining the room
    const openChat1on1Room = ({ roomName, sender, receiver, whoToChat, username }) => {
        // Join the room
        if (roomName !== '' && username !== '') {
            socket.emit('join_room', { username, roomName });
        }

        setIsChatOpen(false);
        setIsRoomChatOpen(true);
        setRoom_1ON1ToGet({ roomName, sender, receiver, whoToChat })
    }

    return (
        <socketContext.Provider value={socket}>
            <onlineListContext.Provider value={onlineList}>
                <>
                    {
                        auth.isAuthenticated ?
                            <>
                                {contacts.isLoading ?
                                    <SpinningBubbles title='contacts' /> :

                                    <Row className='chat-view vh-100'>
                                        <Col sm="3" style={{ height: "95%" }} className="my-2 overflow-auto">

                                            {(uRole === 'Admin' || uRole === 'SuperAdmin') ?
                                                <PageOf pageNo={pageNo} numberOfPages={numberOfPages} /> : null}

                                            <ContactChatCard
                                                contactsToUse={contactsToUse}
                                                deleteContact={deleteContact}
                                                currentUser={currentUser}
                                                openChat={openChat} />

                                            {uRole !== 'Visitor' ?
                                                <>
                                                    <Pagination pageNo={pageNo} setPageNo={setPageNo} numberOfPages={numberOfPages} />
                                                </> : null}
                                        </Col>

                                        <Col sm="6" style={{ height: "95%" }} className="my-2 bg-white overflow-auto">
                                            {isChatOpen ? <ChatComponent
                                                chatId={chatId}
                                                currentUser={currentUser}
                                                socket={socket}
                                                onlineList={onlineList} /> :

                                                isRoomChatOpen ? <RoomChatComponent
                                                    room1ON1ToGet={room1ON1ToGet}
                                                    currentUser={currentUser}
                                                    socket={socket}
                                                    onlineList={onlineList} /> : null}
                                        </Col>

                                        <Col sm="3" style={{ height: "95%" }} className="overflow-auto">
                                            <div>
                                                <h5 className='text-center my-4 font-weight-bold'>
                                                    CHAT WITH ({onlineList.length})
                                                </h5>
                                                <ul style={{ listStyle: "none" }}>
                                                    {onlineList.map((user) => {

                                                        const sortedRmArr = [currentUser.email, user.email].sort((a, b) => a.localeCompare(b));

                                                        return (
                                                            <li key={user.socketID} style={{ fontSize: ".8rem", margin: "4px" }}>

                                                                <Link to={'#'} onClick={() =>
                                                                    currentUser.email !== user.email &&
                                                                    openChat1on1Room({
                                                                        roomName: sortedRmArr[0] + "_" + sortedRmArr[1], sender: currentUser._id,
                                                                        receiver: user.user_id,
                                                                        whoToChat: user.username,
                                                                        username: currentUser.name
                                                                    })}>

                                                                    {user.username}
                                                                    {currentUser.email === user.email ? ' (You)' : null}&nbsp;
                                                                    <small style={{ fontSize: ".5rem", verticalAlign: "middle" }}>🟢</small>
                                                                </Link>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            </div>
                                        </Col>
                                    </Row>
                                }
                            </> :

                            // If not authenticated or loading
                            <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
                                {
                                    auth.isLoading ?
                                        <SpinningBubbles /> :
                                        <LoginModal
                                            textContent={'Login first'}
                                            textColor={'text-danger font-weight-bolder my-5 border rounded'} />
                                }
                            </div>
                    }
                </>
            </onlineListContext.Provider>
        </socketContext.Provider>
    )
}
const mapStateToProps = state => ({
    contacts: state.contactsReducer
})

export default connect(mapStateToProps, { getContacts, getUserContacts, deleteContact })(ContactChat)