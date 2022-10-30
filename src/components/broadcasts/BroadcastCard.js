import React from 'react'
import { Col, Card, Button, CardTitle, CardText, Alert } from 'reactstrap'
import { Link } from "react-router-dom"
import DeleteIcon from '../../images/remove.svg'
import BroadcastModal from './BroadcastModal'

const BroadcastsCard = ({ broadcastsToUse, currentUser, deleteBroadcast }) => {

    const uRole = currentUser && currentUser.role

    return (

        broadcastsToUse && broadcastsToUse.length > 0 ?

            <>
                <span className='w-100 d-flex justify-content-end pr-sm-4 mb-sm-4'>
                    <Button color="warning" size="sm">
                        <BroadcastModal currentUser={currentUser && currentUser} />
                    </Button>
                </span>
                {broadcastsToUse && broadcastsToUse.map(broadcast => (
                    <Col sm="6" className="mt-2 contact-card" key={broadcast._id}>

                        <Card body>

                            <CardTitle className="d-flex justify-content-between">
                                <Link to='#' className="text-success">
                                    {broadcast && broadcast.title}
                                </Link>

                                <div className="action-btns">
                                    <Button size="sm" color="white" className={`mr-2 ${uRole === 'Admin' ? '' : 'd-none'}`} onClick={() => deleteBroadcast(broadcast._id)}>
                                        <img src={DeleteIcon} alt="" width="12" height="12" />
                                    </Button>
                                </div>
                            </CardTitle>

                            <CardText>{broadcast && broadcast.message}</CardText>

                            <hr />
                            <small className="text-info d-flex justify-content-around">
                                <u>Sent on {broadcast && broadcast.createdAt.split('T').slice(0, 2).join(' at ')}</u>
                                <b>{broadcast.sent_by && broadcast.sent_by.name}</b>
                            </small>
                        </Card>
                    </Col>
                ))}
            </> :
            <Alert color="danger" className="w-100 text-center">
                Seems like you have nothing here!
            </Alert>
    )
}

export default BroadcastsCard