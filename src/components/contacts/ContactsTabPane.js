import React, { useState, useEffect, useContext } from 'react'
import { Row, TabPane } from 'reactstrap'
import { connect } from 'react-redux'
import { getContacts, getUserContacts, deleteContact } from '../../redux/contacts/contacts.actions'
import Pagination from '../webmaster/Pagination'
import PageOf from '../webmaster/PageOf'
import ContactCard from './ContactCard'
import SpinningBubbles from '../rLoading/SpinningBubbles'
import { currentUserContext } from '../../appContexts'

const ContactsTabPane = ({ contacts, getContacts, getUserContacts, deleteContact }) => {

    // context
    const currentUser = useContext(currentUserContext)

    const userEmail = currentUser && currentUser.email
    const uRole = currentUser && currentUser.role
    const totPages = contacts && contacts.totalPages
    const contactsToUse = contacts && ((uRole === 'Admin' || uRole === 'SuperAdmin') || uRole === 'Creator') ? contacts.allContacts : contacts.userContacts

    const [pageNo, setPageNo] = useState(1)
    const [numberOfPages, setNumberOfPages] = useState(0)

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

    return (
        <TabPane tabId="5">

            {contacts.isLoading ?
                <SpinningBubbles title='contacts' /> :

                <Row>
                    {(uRole === 'Admin' || uRole === 'SuperAdmin') ?
                        <PageOf pageNo={pageNo} numberOfPages={numberOfPages} /> : null}

                    <ContactCard
                        contactsToUse={contactsToUse}
                        deleteContact={deleteContact}
                        currentUser={currentUser} />

                    {uRole !== 'Visitor' ?
                        <>
                            <Pagination pageNo={pageNo} setPageNo={setPageNo} numberOfPages={numberOfPages} />
                        </> : null}
                </Row>
            }

        </TabPane>
    )
}

const mapStateToProps = state => ({
    contacts: state.contactsReducer
})

export default connect(mapStateToProps, { getContacts, getUserContacts, deleteContact })(ContactsTabPane)