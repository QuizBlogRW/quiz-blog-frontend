import React from 'react'
import { Card, Button, CardTitle, CardText, Alert } from 'reactstrap'
import DeleteIcon from '../../../images/remove.svg'
import moment from 'moment'

const ContactChatCard = ({ openChat, contactsToUse, currentUser, deleteContact }) => {

    const uRole = currentUser && currentUser.role

    return (

        contactsToUse && contactsToUse.length > 0 ?

            <>
                {contactsToUse && contactsToUse.map(contact => (

                    <Card body
                        onClick={() => openChat(contact._id)}
                        key={contact._id}
                        className="m-1 p-1 mb-2"
                        style={{ height: "150px!important", overflowY: "unset!important" }}>

                        <CardTitle className="p-1 d-flex justify-content-between" style={{ fontSize: ".65rem", backgroundColor: "honeydew" }}>
                            <small style={{ width: "80%" }}>
                                <b style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }} className='d-block overflow-hidden'>
                                    {contact.contact_name}
                                </b>
                                ({contact.email})
                            </small>

                            {contact.replies && contact.replies.length > 0 ?
                                <b
                                    className='border bg-secondary text-warning text-center'
                                    style={{ padding: "4px", borderRadius: "50%", verticalAlign: "middle", width: "25px", height: "25px", fontSize: ".65rem" }}>
                                    {contact.replies.length}
                                </b> :
                                null}
                        </CardTitle>

                        <CardText style={{ fontSize: ".7rem", marginLeft: "6px" }}>
                            {contact.message}
                        </CardText>
                        <div className="d-flex justify-content-between p-1" style={{ backgroundColor: "whitesmoke" }}>
                            <small className="d-flex align-items-center text-info" style={{ fontSize: ".65rem" }}>
                                <i>
                                    {moment(new Date(contact.contact_date))
                                        .format('YYYY-MM-DD, HH:MM')}
                                </i>
                            </small>

                            <Button size="sm" color="link" className={`mr-2 ${(uRole === 'Admin' || uRole === 'SuperAdmin') ? '' : 'd-none'}`} onClick={() => deleteContact(contact._id)}>
                                <img src={DeleteIcon} alt="" width="8" height="8" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </> :
            <Alert color="danger" className="w-100 text-center">
                Seems like you have nothing here!
            </Alert>
    )
}

export default ContactChatCard