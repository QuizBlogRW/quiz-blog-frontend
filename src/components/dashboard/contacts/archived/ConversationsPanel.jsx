// ============================================
// ConversationsPanel.jsx - Using GenericPanel for Contacts
// ============================================
import { memo, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteContact } from '@/redux/slices/contactsSlice';
import QBLoadingSM from "@/utils/rLoading/QBLoadingSM";
import GenericPanel from '../GenericPanel';

const ConversationsPanel = ({ openConversation }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.users.user);
    const allContacts = useSelector(state => state.contacts.allContacts);
    const userContacts = useSelector(state => state.contacts.userContacts);
    const isLoading = useSelector(state => state.contacts.isLoading);

    const contactsToUse = useMemo(() => {
        if (!user) return [];
        const isAdmin = user.role?.includes('Admin') || user.role === 'Creator';
        return isAdmin && allContacts ? allContacts : userContacts || [];
    }, [user, allContacts, userContacts]);

    const isAdmin = useMemo(() => user?.role?.includes('Admin'), [user?.role]);

    const handleDelete = (contactId) => {
        dispatch(deleteContact(contactId));
    };

    // Configuration for contacts
    const config = {
        getTitle: (contact) => contact.contact_name,
        getSubtitle: (contact) => contact.email,
        getMessage: (contact) => contact.message,
        getDate: (contact) => contact.contact_date,
        getCount: (contact) => contact.replies?.length || 0,
        getAriaLabel: (contact) => `Contact from ${contact.contact_name}`,
        getCountLabel: (count) => `${count} replies`,
        LoadingComponent: QBLoadingSM
    };

    const actions = {
        onClick: (contact) => openConversation(contact._id),
        onDelete: handleDelete
    };

    const emptyLink = user?.role !== 'Visitor' ? null : {
        to: '/contact',
        text: '➕ Start new chat with us',
        label: 'Start new chat'
    };

    return (
        <GenericPanel
            items={contactsToUse}
            config={config}
            actions={actions}
            permissions={{ showDelete: isAdmin }}
            loading={isLoading}
            emptyMessage={user?.role !== 'Visitor' ? 'No messages yet!' : null}
            emptyLink={emptyLink}
        />
    );
};

export default memo(ConversationsPanel);