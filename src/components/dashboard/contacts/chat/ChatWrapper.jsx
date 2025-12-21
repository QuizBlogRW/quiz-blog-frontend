import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Row, Col, Button } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { getUserChatRooms, getCreateRoom, getRoomMessages, clearRoomMessages, clearUserChatRooms, clearAllChatRooms, getBatchedRoomMessages, getChatRooms } from "@/redux/slices/contactsSlice";

import Pagination from "@/components/dashboard/utils/Pagination";
import PageOf from "@/components/dashboard/utils/PageOf";
import ChatsPanel from "./ChatsPanel";
import RoomMessages from "./RoomMessages";
import QBLoadingSM from "@/utils/rLoading/QBLoadingSM";
import NotAuthenticated from "@/components/users/NotAuthenticated";
import { notify } from "@/utils/notifyToast";
import { initSocket, socketEmit, socketOn, socketOff } from "@/utils/socket";
import OnlineList from "./OnlineList";

const capitalizeName = (name) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1);
};

const ChatWrapper = () => {

    const dispatch = useDispatch();

    const user = useSelector(state => state.users.user);
    const isAuthenticated = useSelector(state => state.users.isAuthenticated);
    const usersLoading = useSelector(state => state.users.isLoading);
    const userChatRooms = useSelector(state => state.contacts.userChatRooms);
    const allChatRooms = useSelector(state => state.contacts.allChatRooms);

    const [showAllChats, setShowAllChats] = useState(false);
    const isAdmin = useMemo(() => user?.role?.includes('Admin'), [user?.role]);

    const totalPages = useSelector(state =>
        showAllChats && isAdmin
            ? state.contacts.allChatRoomsPages
            : state.contacts.userChatRoomsPages
    );
    const contactsLoading = useSelector(state => state.contacts.isLoading);
    const oneChatRoom = useSelector(state => state.contacts.oneChatRoom);

    /* ------------------ STATE ------------------ */
    const [pageNo, setPageNo] = useState(1);
    const [chatState, setChatState] = useState({
        isOpen: false,
        room: null,
        isTemporary: false, // Flag to indicate if room hasn't been created yet
    });
    const joinedRoomRef = useRef(null);
    const prevRoomIdsRef = useRef([]);

    /* ------------------ COMPUTED VALUES ------------------ */
    // Determine which chat rooms to display
    const chatRoomsToUse = useMemo(() => {
        if (!user) return [];
        if (showAllChats && isAdmin && allChatRooms) {
            return allChatRooms;
        }
        return userChatRooms || [];
    }, [user, showAllChats, isAdmin, allChatRooms, userChatRooms]);

    /* ------------------ INIT SOCKET ------------------ */
    useEffect(() => {
        if (!isAuthenticated) return;
        initSocket();
    }, [isAuthenticated]);


    /* ------------------ INITIAL DATA FETCH ------------------ */
    useEffect(() => {
        if (!user?._id) return;

        if (isAdmin && showAllChats) {
            dispatch(getChatRooms(pageNo));
        } else {
            dispatch(getUserChatRooms({ userID: user._id, pageNo }));
        }
    }, [user?._id, isAdmin, showAllChats, pageNo, dispatch]);

    /* ------------------ FETCH ROOM MESSAGES ON ROOM OPEN ------------------ */
    useEffect(() => {
        // Only fetch messages if room is not temporary (already exists in DB)
        if (!oneChatRoom?._id || chatState.isTemporary) return;
        dispatch(clearRoomMessages());
        dispatch(getRoomMessages(oneChatRoom._id));
    }, [oneChatRoom?._id, chatState.isTemporary, dispatch]);

    /* ------------------ DOCUMENT TITLE ------------------ */
    useEffect(() => {
        if (user?.name) {
            document.title = `${capitalizeName(user.name)} - Contacts`;
        }

        return () => {
            document.title = 'Quiz Blog';
        };
    }, [user?.name]);

    /* ------------------ ONLINE USERS ------------------ */
    const [onlineList, setOnlineList] = useState([]);
    const handleOnlineUsers = useCallback(({ onlineUsers, new_user }) => {
        setOnlineList(onlineUsers || []);
        if (new_user?.name && new_user._id !== user?._id) {
            notify(`${capitalizeName(new_user.name)} is online`);
        }
    }, [user?._id]);

    useEffect(() => {
        if (!isAuthenticated) return;
        socketOn("onlineUsers", handleOnlineUsers);
        return () => socketOff("onlineUsers", handleOnlineUsers);
    }, [isAuthenticated, handleOnlineUsers]);

    /* ------------------ ROOM JOIN/LEAVE MANAGEMENT ------------------ */
    useEffect(() => {
        const roomID = oneChatRoom?._id;
        // Don't join socket room if it's a temporary chat
        if (!roomID || chatState.isTemporary) return;

        // Prevent duplicate joins
        if (joinedRoomRef.current === roomID) return;

        // Leave previous room if exists
        if (joinedRoomRef.current) {
            socketEmit("leaveRoom", joinedRoomRef.current);
        }

        // Join new room
        socketEmit("joinRoom", roomID);
        joinedRoomRef.current = roomID;

        // Cleanup: leave room on unmount or when room changes
        return () => {
            if (joinedRoomRef.current) {
                socketEmit("leaveRoom", joinedRoomRef.current);
                joinedRoomRef.current = null;
            }
        };
    }, [oneChatRoom?._id, chatState.isTemporary]);

    /* ------------------ BATCH FETCH ROOM MESSAGES ------------------ */
    useEffect(() => {
        const roomsToFetch = showAllChats && isAdmin ? allChatRooms : userChatRooms;

        if (!roomsToFetch?.length) return;

        const currentIds = roomsToFetch.map(r => r._id);
        const idsChanged = JSON.stringify(prevRoomIdsRef.current) !== JSON.stringify(currentIds);

        if (idsChanged) {
            prevRoomIdsRef.current = currentIds;
            dispatch(getBatchedRoomMessages(currentIds));
        }
    }, [userChatRooms, allChatRooms, showAllChats, isAdmin, dispatch]);

    /* ------------------ CHAT HANDLERS ------------------ */
    const openRoom = useCallback(
        ({ roomName, sender, receiver, receiverName, fromExistingRoom = false }) => {
            if (!roomName || !sender || !receiver) {
                notify('Cannot open room: Invalid parameters', 'error');
                return;
            }

            if (fromExistingRoom) {
                setChatState({
                    isOpen: true,
                    room: { roomName, sender, receiver, receiverName },
                    isTemporary: false,
                });
                dispatch(getCreateRoom({ roomName, users: [sender, receiver] }));
            } else {
                setChatState({
                    isOpen: true,
                    room: { roomName, sender, receiver, receiverName },
                    isTemporary: true,
                });
                dispatch(clearRoomMessages());
            }
        },
        [dispatch]
    );

    const closeChatRoom = useCallback(() => {
        dispatch(clearRoomMessages());
        setChatState({
            isOpen: false,
            room: null,
            isTemporary: false,
        });
    }, [dispatch]);

    // Callback to mark room as permanent after first message
    const markRoomAsPermanent = useCallback(() => {
        setChatState(prev => ({
            ...prev,
            isTemporary: false,
        }));
    }, []);

    useEffect(() => {
        if (showAllChats) {
            dispatch(clearUserChatRooms());
        } else {
            dispatch(clearAllChatRooms());
        }
    }, [showAllChats, dispatch]);

    const toggleShowAllChats = useCallback(() => {
        setShowAllChats(prev => !prev);
        setPageNo(1);
    }, []);

    /* ------------------ GUARDS ------------------ */
    if (!isAuthenticated) return <NotAuthenticated />;
    if (contactsLoading || usersLoading) return <QBLoadingSM />;

    /* ------------------ RENDER ------------------ */
    return (
        <Row className="chat-view w-100 vh-100 g-2 m-0">
            {/* Left Panel: Contacts List */}
            <Col
                xs="12"
                sm="3"
                className="d-flex flex-column overflow-auto bg-light rounded p-2"
                style={{ maxHeight: '100vh' }}
            >
                {/* Admin toggle button */}
                {isAdmin && (
                    <div className="mb-2">
                        <Button
                            color={showAllChats ? "warning" : "success"}
                            size="sm"
                            className="w-100"
                            onClick={toggleShowAllChats}
                        >
                            {showAllChats ? '👤 View my chats' : '👥 View all chats'}
                        </Button>
                    </div>
                )}

                {isAdmin && <PageOf pageNo={pageNo} numberOfPages={totalPages} />}

                <div className="flex-grow-1 overflow-auto">
                    <ChatsPanel
                        chatRooms={chatRoomsToUse}
                        openRoom={(roomData) => openRoom({ ...roomData, fromExistingRoom: true })}
                    />
                </div>

                {isAdmin && totalPages > 1 && (
                    <div className="mt-2">
                        <Pagination
                            pageNo={pageNo}
                            setPageNo={setPageNo}
                            numberOfPages={totalPages}
                        />
                    </div>
                )}
            </Col>

            {/* Center Panel Column: Chat Room */}
            <RoomMessages
                room={chatState.room}
                roomOpen={chatState.isOpen}
                onlineList={onlineList}
                onClose={closeChatRoom}
                showAllChats={showAllChats}
                isTemporary={chatState.isTemporary}
                onRoomCreated={markRoomAsPermanent}
            />

            {/* Right Panel Column: Online Users */}
            <OnlineList openRoom={openRoom} onlineList={onlineList} capitalizeName={capitalizeName} />
        </Row>
    );
};

export default ChatWrapper;
