import React, { useState, useEffect, useContext } from 'react'
import { Row, TabPane } from 'reactstrap'
import { getContacts, getUserContacts } from '../../redux/slices/contactsSlice'
import { useSelector, useDispatch } from "react-redux"

import Pagination from '../dashboard/Pagination'
import PageOf from '../dashboard/PageOf'
import ContactCard from './ContactCard'
import QBLoadingSM from '../rLoading/QBLoadingSM'
import { currentUserContext } from '../../appContexts'

const ContactsTabPane = () => {

    // Redux
    const dispatch = useDispatch()
    const contacts = useSelector(state => state.contacts)

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
            dispatch(getContacts(pageNo))
            setNumberOfPages(totPages)
        }
        else {
            dispatch(getUserContacts(userEmail))
        }
    }, [dispatch, pageNo, userEmail, uRole, totPages])

    return (
        <TabPane tabId="5">

            {contacts.isLoading ?
                <QBLoadingSM title='contacts' /> :

                <Row>
                    {(uRole === 'Admin' || uRole === 'SuperAdmin') ?
                        <PageOf pageNo={pageNo} numberOfPages={numberOfPages} /> : null}

                    <ContactCard
                        contactsToUse={contactsToUse}
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

export default ContactsTabPane