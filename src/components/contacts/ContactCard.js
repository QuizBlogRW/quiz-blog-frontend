import React from 'react'
import { Col, Card, Button, CardTitle, CardText, Alert } from 'reactstrap'
import { Link } from "react-router-dom"
import DeleteIcon from '../../images/remove.svg'
import ReplyContactModal from './ReplyContactModal'
import moment from 'moment'

const ContactCard = ({ contactsToUse, currentUser, deleteContact }) => {

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
                                <div className="action-btns">
                                    <Button color="success" size="sm" className="mr-1 mr-md-1">

                                        <ReplyContactModal
                                            currentUser={currentUser}
                                            thisContact={contact} />

                                    </Button>
                                    <Button size="sm" color="link" className={`mr-2 ${(uRole === 'Admin' || uRole === 'SuperAdmin') ? '' : 'd-none'}`} onClick={() => deleteContact(contact._id)}>
                                        <img src={DeleteIcon} alt="" width="16" height="16" />
                                    </Button>
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
                                    <i className='text-right d-block'>
                                        {moment(new Date(contact.contact_date))
                                            .format('YYYY-MM-DD, HH:MM')}
                                    </i>
                                </small>
                            </CardText>
                            {contact.replies && contact.replies.length > 0 ? <h5 className="font-weight-bold text-primary text-center text-uppercase">
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

                                            <small className="text-info text-right d-block">
                                                <i>
                                                    {moment(new Date(reply.reply_date))
                                                        .format('YYYY-MM-DD, HH:MM')}
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
            <Alert color="danger" className="w-100 text-center">
                Seems like you have nothing here!
            </Alert>
    )
}

export default ContactCard