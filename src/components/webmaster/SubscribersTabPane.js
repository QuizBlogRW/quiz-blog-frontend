import React, { useEffect } from 'react'
import { Row, Button, TabPane, Table } from 'reactstrap';
import { connect } from 'react-redux'
import { setSubscribers, deleteSubscriber } from '../../redux/subscribers/subscribers.actions'
import trash from '../../images/trash.svg';
import SpinningBubbles from '../rLoading/SpinningBubbles';

const SubscribersTabPane = ({ subscribedUsers, setSubscribers, deleteSubscriber }) => {

    // Lifecycle methods
    useEffect(() => {
        setSubscribers();
    }, [setSubscribers]);

    return (

        <TabPane tabId="6" className='mx-4'>
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
                                        <td>{subscribedUser.subscription_date.split('T').slice(0, 2).join(' at ')}</td>
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

        </TabPane>
    )
}

const mapStateToProps = state => ({
    subscribedUsers: state.subscribersReducer
})

export default connect(mapStateToProps, { setSubscribers, deleteSubscriber })(SubscribersTabPane)