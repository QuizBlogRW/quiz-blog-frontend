import React, { useEffect } from 'react'
import { Row, Button, Table, Alert } from 'reactstrap'
import { connect } from 'react-redux'
import { setSubscribers, deleteSubscriber } from '../../redux/subscribers/subscribers.actions'
import trash from '../../images/trash.svg'
import LoginModal from '../auth/LoginModal'
import SpinningBubbles from '../rLoading/SpinningBubbles'
import moment from 'moment'

const Subscribers = ({ auth, subscribedUsers, setSubscribers, deleteSubscriber }) => {

    // Lifecycle methods
    useEffect(() => {
        setSubscribers()
    }, [setSubscribers])
    const isAuthenticated = auth && auth.isAuthenticated
    const userLoading = auth && auth.isLoading
    const curUser = auth.user && auth.user.role

    return (
        !isAuthenticated ?

            // If not authenticated or loading
            <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
                {
                    userLoading ?
                        <SpinningBubbles title='subscribers' /> :
                        <LoginModal
                            textContent={'Login first to access subscribers'}
                            textColor={'text-danger font-weight-bolder my-5 border rounded'}
                            isAuthenticated={isAuthenticated} />
                }
            </div> :
            curUser === 'Admin' ?
                <div className='mx-4 my-5'>
                    {
                        subscribedUsers.isLoading ?
                            <SpinningBubbles title='subscribers' /> :
                            <Row>
                                <Table bordered className='all-scores table-success' hover responsive striped size="sm">
                                    <thead className='text-uppercase table-dark'>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">Subscription Date</th>
                                            <th scope="col">❌</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subscribedUsers && subscribedUsers.subscribedUsers.map((subscribedUser, index) => (
                                            <tr key={subscribedUser._id}>
                                                <th scope="row" className="table-dark">{index + 1}</th>
                                                <td className='text-uppercase'>
                                                    {subscribedUser.name.split(' ').slice(0, 2).join(' ')}
                                                </td>
                                                <td className='text-lowercase'>{subscribedUser.email}</td>
                                                <td>
                                                    <i>
                                                        {moment(new Date(subscribedUser.subscription_date))
                                                            .format('YYYY-MM-DD, HH:MM')}
                                                    </i>
                                                </td>
                                                <td className="table-dark">
                                                    <Button size="sm" color="link" className="mt-0 p-0" onClick={() => deleteSubscriber(subscribedUser._id)}>
                                                        <img src={trash} alt="" width="16" height="16" />
                                                    </Button>
                                                </td>
                                            </tr>))}
                                    </tbody>
                                </Table>
                            </Row>
                    }
                </div> : <Alert color="danger">Access Denied!</Alert>
    )
}

const mapStateToProps = state => ({
    subscribedUsers: state.subscribersReducer
})

export default connect(mapStateToProps, { setSubscribers, deleteSubscriber })(Subscribers)