import React, { useContext } from 'react'
import { Col, Card, Button, CardTitle, CardText, Alert } from 'reactstrap'
import { Link } from "react-router-dom"
import ReplyContactModal from './ReplyContactModal'
import moment from 'moment'
import { currentUserContext } from '../../appContexts'
import DeleteModal from '../../utils/DeleteModal'
import { deleteContact } from '../../redux/slices/contactsSlice'

const ContactCard = ({ contactsToUse }) => {

    // Context
    const currentUser = useContext(currentUserContext)
    const uRole = currentUser && currentUser.role

    return (

        contactsToUse && contactsToUse.length > 0 ?

            <>
                {contactsToUse && contactsToUse.map(contact => (
                    <Col sm="6" className="mt-2 contact-card" key={contact._id}>

                        <Card body>

                            <CardTitle className="d-flex justify-content-between">
                                <Link to='#' className="text-success">
                                    {contact.contact_name}
                                    &nbsp;<small>({contact.email})</small> said:
                                </Link>
                                <div className="d-flex">
                                    <Button color="success" size="sm" className="me-1 me-md-1">

                                        <ReplyContactModal
                                            currentUser={currentUser}
                                            thisContact={contact} />

                                    </Button>
                                    <DeleteModal deleteFnName="deleteContact" deleteFn={deleteContact} delID={contact._id} delTitle={contact.contact_name} />
                                </div>
                            </CardTitle>

                            <CardText
                                style={{
                                    whiteSpace: "pre",
                                    padding: "10px",
                                    borderTop: ".1px solid #BFC9CA",
                                    borderBottom: ".3px solid #BFC9CA",
                                    borderRadius: "10px",
                                }}>
                                {contact.message}
                                <small className="text-info">
                                    <i className='text-end d-block'>
                                        {moment(new Date(contact.contact_date))
                                            .format('YYYY-MM-DD, HH:mm')}
                                    </i>
                                </small>
                            </CardText>
                            {contact.replies && contact.replies.length > 0 ? <h5 className="fw-bolder text-primary text-center text-uppercase">
                                <u>Replies ({contact.replies.length})</u>
                            </h5> : null}

                            {contact && contact.replies.map((reply) =>
                                <ul key={reply._id} className="pl-1">

                                    <li style={{ listStyle: "none" }} className="text-warning">
                                        <div className='mb-1 mb-lg-2 mt-lg-3 p-1 p-lg-2'>
                                            <strong>{reply.reply_name}</strong>&nbsp;
                                            <small>({reply.email})</small> said:
                                        </div>
                                        <div
                                            className="text-dark"
                                            style={{
                                                whiteSpace: "pre",
                                                padding: "10px",
                                                borderTop: ".1px solid #D1F2EB",
                                                borderBottom: ".3px solid #D1F2EB",
                                                borderRadius: "10px",
                                            }}>
                                            <p style={{ color: "#0B5345" }}>
                                                {reply.message}
                                            </p>

                                            <small className="text-info text-end d-block">
                                                <i>
                                                    {moment(new Date(reply.reply_date))
                                                        .format('YYYY-MM-DD, HH:mm')}
                                                </i>
                                            </small>
                                        </div>
                                    </li>
                                </ul>
                            )}
                        </Card>
                    </Col>
                ))}
            </> :
            <Alert color="danger" className="w-50 text-center mx-auto" style={{ border: '2px solid #157A6E' }}>
                Seems like you have nothing here!
            </Alert>
    )
}

export default ContactCard