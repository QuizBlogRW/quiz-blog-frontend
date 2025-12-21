import { useMemo } from "react";
import { ListGroup, ListGroupItem, Col } from "reactstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const OnlineList = ({ openRoom, onlineList, capitalizeName }) => {

    const user = useSelector(state => state.users.user);
    const userChatRooms = useSelector(state => state.contacts.userChatRooms);

    const onlineUsersCount = useMemo(
        () => onlineList?.length || 0,
        [onlineList]
    );

    const otherUsers = useMemo(
        () => onlineList?.filter((u) => u._id !== user?._id) || [],
        [onlineList, user?._id]
    );

    return (
        <Col xs="12" sm="3" className="d-flex flex-column overflow-auto bg-light rounded p-2" style={{ maxHeight: '100vh' }}>
            {onlineUsersCount > 1 ?
                <>
                    <h5 className="text-center fw-bold my-3">
                        CHAT WITH ({onlineUsersCount})
                    </h5>
                    <ListGroup flush className="mb-3">
                        {/* Current User */}
                        <ListGroupItem className="p-2 text-truncate bg-light">
                            <span className="text-muted">
                                {capitalizeName(user?.name)} (You)
                            </span>
                        </ListGroupItem>

                        {/* Other Online Users */}
                        {otherUsers.map((usr) => {

                            const sorted = [user?.email, usr.email].sort();
                            const roomName = sorted.join("_");

                            const existingRoom = userChatRooms.find(room =>
                            (room.users.find(u => u.email === user?.email) &&
                                room.users.find(u => u.email === usr.email))
                            );

                            return (
                                <ListGroupItem
                                    key={usr.socketID}
                                    className="p-2 text-truncate"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Link
                                        to="#"
                                        className="text-decoration-none d-flex justify-content-between align-items-center"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            openRoom({
                                                roomName,
                                                sender: user?._id,
                                                receiver: usr._id,
                                                receiverName: usr.name,
                                                fromExistingRoom: Boolean(existingRoom),
                                            });
                                        }}
                                        aria-label={`Start chat with ${usr.name}`}
                                    >
                                        <span>{capitalizeName(usr.name)}</span>
                                        <span
                                            className="text-success"
                                            aria-label="Online"
                                            style={{ fontSize: '0.75rem' }}
                                        >
                                            ●
                                        </span>
                                    </Link>
                                </ListGroupItem>
                            );
                        })}
                    </ListGroup>
                </> :

                <div className="d-flex flex-column justify-content-center align-items-center h-100 text-center">
                    <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="mb-3 text-muted opacity-50"
                    >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <h6 className="text-muted fw-normal">No one else is online</h6>
                </div>
            }
        </Col>
    )
}

export default OnlineList
