import React from 'react'
import { Col, Card, Button, CardTitle, CardText, Alert } from 'reactstrap'
import { Link } from "react-router-dom"
import DeleteIcon from '../../images/remove.svg'
import ReplyContactModal from './ReplyContactModal'

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
                                    <Button size="sm" color="link" className={`mr-2 ${uRole === 'Admin' ? '' : 'd-none'}`} onClick={() => deleteContact(contact._id)}>
                                        <img src={DeleteIcon} alt="" width="16" height="16" />
                                    </Button>
                                </div>
                            </CardTitle>

                            <CardText>{contact.message}</CardText>
                            <small className="text-info">
                                <i>Sent on {contact.contact_date.split('T').slice(0, 2).join(' at ')}</i>
                            </small>
                            <br />
                            {contact.replies && contact.replies.length > 0 ? <p className="font-weight-bold">Replies ({contact.replies.length})</p> : null}

                            {contact && contact.replies.map((reply) =>
                                <ul key={reply._id} className="pl-1">

                                    <li style={{ listStyle: "none" }} className="text-info">
                                        <strong>{reply.reply_name}</strong>&nbsp;
                                        <small>({reply.email})</small> said:

                                        <br />
                                        <div className="text-dark">
                                            <i className="d-block">
                                                {reply.message}
                                            </i>
                                            <small>{reply.reply_date.split('T').slice(0, 2).join(' at ')}</small>
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