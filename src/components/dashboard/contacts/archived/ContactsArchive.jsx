import { useState, useEffect, useCallback, useMemo } from "react";
import { Row, Col } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { getContacts, getOneContact, getUserContacts } from "@/redux/slices/contactsSlice";

import Pagination from "@/components/dashboard/utils/Pagination";
import PageOf from "@/components/dashboard/utils/PageOf";
import ConversationsPanel from "./ConversationsPanel";
import ConversationMessages from "./ConversationMessages";
import QBLoadingSM from "@/utils/rLoading/QBLoadingSM";
import NotAuthenticated from "@/components/users/NotAuthenticated";
import Unauthorized from "@/components/users/Unauthorized";

const ContactsArchive = () => {

    const dispatch = useDispatch();

    const user = useSelector(state => state.users.user);
    const isAuthenticated = useSelector(state => state.users.isAuthenticated);
    const usersLoading = useSelector(state => state.users.isLoading);
    const contactsLoading = useSelector(state => state.contacts.isLoading);
    const totalPages = useSelector(state => state.contacts.totalPages);

    const [pageNo, setPageNo] = useState(1);
    const [isConversationOpen, setIsConversationOpen] = useState(false);

    const isVisitor = useMemo(() => user?.role === "Visitor", [user?.role]);
    const isAdmin = useMemo(() => user?.role?.includes("Admin"), [user?.role]);

    /* ------------------ INITIAL DATA FETCH ------------------ */
    useEffect(() => {
        if (!user) return;

        if (!isVisitor) {
            dispatch(getContacts(pageNo));
        } else {
            dispatch(getUserContacts(user.email));
        }
    }, [pageNo, user, isVisitor, dispatch]);

    /* ------------------ DOCUMENT TITLE ------------------ */
    useEffect(() => {
        if (user?.name) {
            const capitalizedName = user.name.charAt(0).toUpperCase() + user.name.slice(1);
            document.title = `${capitalizedName} - Contacts`;
        }

        return () => {
            document.title = 'Quiz Blog'; // Reset on unmount
        };
    }, [user?.name]);

    /* ------------------ CHAT HANDLERS ------------------ */
    const openConversation = useCallback(
        (chatId) => {
            setIsConversationOpen(true);
            dispatch(getOneContact(chatId));
        },
        [dispatch]
    );

    const closeChat = useCallback(() => {
        setIsConversationOpen(false);
    }, []);

    /* ------------------ GUARDS ------------------ */
    if (!isAuthenticated) return <NotAuthenticated />;
    if (!isAdmin) return <Unauthorized />;
    if (contactsLoading || usersLoading) return <QBLoadingSM />;

    /* ------------------ RENDER ------------------ */
    return (
        <Row className="chat-view w-100 vh-100 g-2 m-0">
            {/* Contacts List */}
            <Col
                xs="12"
                sm="4"
                className="d-flex flex-column overflow-auto bg-light rounded p-2"
                style={{ maxHeight: '100vh' }}
            >
                {isAdmin && <PageOf pageNo={pageNo} numberOfPages={totalPages} />}

                <div className="flex-grow-1 overflow-auto">
                    <ConversationsPanel openConversation={openConversation} />
                </div>

                {!isVisitor && totalPages > 1 && (
                    <div className="mt-2">
                        <Pagination
                            pageNo={pageNo}
                            setPageNo={setPageNo}
                            numberOfPages={totalPages}
                        />
                    </div>
                )}
            </Col>

            {/* Messages Panel */}
            <ConversationMessages onClose={closeChat} isConversationOpen={isConversationOpen} />
        </Row>
    );
};

export default ContactsArchive;