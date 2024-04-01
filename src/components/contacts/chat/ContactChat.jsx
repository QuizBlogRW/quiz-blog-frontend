import React, { useState, useEffect, useContext } from 'react'
import { Row, Col, Button } from 'reactstrap'
import { Link } from "react-router-dom"
import Pagination from '../../dashboard/Pagination'
import PageOf from '../../dashboard/PageOf'
import ContactChatCard from './ContactChatCard'
import ChatComponent from './ChatComponent'
import QBLoadingSM from '../../rLoading/QBLoadingSM'
import RoomChatComponent from './RoomChatComponent'
import { getContacts, getUserContacts, } from '../../../redux/slices/contactsSlice'
import { authContext, currentUserContext, logRegContext, onlineListContext } from '../../../appContexts'
import { useSelector, useDispatch } from "react-redux"
import { socket } from '../../../utils/socket'

const ContactChat = () => {

    // Redux
    const dispatch = useDispatch()
    const contacts = useSelector(state => state.contacts)

    // Contexts
    const auth = useContext(authContext)
    const currentUser = useContext(currentUserContext)
    const onlineList = useContext(onlineListContext)
    const { toggleL } = useContext(logRegContext)

    const userEmail = currentUser && currentUser.email
    const uRole = currentUser && currentUser.role
    const totPages = contacts && contacts.totalPages
    const contactsToUse = contacts && ((uRole === 'Admin' || uRole === 'SuperAdmin') || uRole === 'Creator') ? contacts.allContacts : contacts.userContacts
    const [pageNo, setPageNo] = useState(1)
    const [numberOfPages, setNumberOfPages] = useState(0)

    // Lifecycle methods
    useEffect(() => {
        if (uRole !== 'Visitor') {
            dispatch(getContacts(pageNo))
            setNumberOfPages(totPages)
        }
        else {
            dispatch(getUserContacts(userEmail))
        }
    }, [dispatch, userEmail, pageNo, totPages, uRole])

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
        <>
            {
                auth.isAuthenticated ?
                    <>
                        {contacts.isLoading ?
                            <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
                                <QBLoadingSM title='contacts' />
                            </div> :

                            <Row className='chat-view vh-100'>
                                <Col sm="3" style={{ height: "95%" }} className="my-2 overflow-auto">
                                    {(uRole === 'Admin' || uRole === 'SuperAdmin') ?
                                        <PageOf pageNo={pageNo} numberOfPages={numberOfPages} /> : null}

                                    <ContactChatCard contactsToUse={contactsToUse} openChat={openChat} />
                                    {uRole !== 'Visitor' ?
                                        <>
                                            <Pagination pageNo={pageNo} setPageNo={setPageNo} numberOfPages={numberOfPages} />
                                        </> : null}
                                </Col>

                                <Col sm="6" style={{ height: "95%" }} className="my-2 bg-white overflow-auto">
                                    {isChatOpen ? <ChatComponent chatId={chatId} /> :
                                        isRoomChatOpen ? <RoomChatComponent room1ON1ToGet={room1ON1ToGet} /> : null}
                                </Col>

                                <Col sm="3" style={{ height: "95%" }} className="overflow-auto">
                                    <div>
                                        <h5 className='text-center my-4 fw-bolder'>
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

export default ContactChat