import React, { useEffect } from 'react'
import { Row, Alert } from 'reactstrap'
import { connect } from 'react-redux'
import { setBroadcasts, deleteBroadcast } from '../../redux/broadcasts/broadcasts.actions'
import BroadcastsCard from './BroadcastCard'
import LoginModal from '../auth/LoginModal'
import SpinningBubbles from '../rLoading/SpinningBubbles'

const Broadcasts = ({ auth, broadcasts, setBroadcasts, deleteBroadcast }) => {

    const broadcastsToUse = broadcasts && broadcasts.allBroadcasts

    // Lifecycle methods
    useEffect(() => {
        setBroadcasts()
    }, [setBroadcasts])
    const isAuthenticated = auth && auth.isAuthenticated
    const userLoading = auth && auth.isLoading
    const currentUser = auth && auth.user
    const curUserRole = currentUser && currentUser.role

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
            curUserRole === 'Admin' ?
                <div className='mx-4 my-5'>

                    {broadcasts.isLoading ?
                        <SpinningBubbles title='broadcasts' /> :

                        <Row>
                            <BroadcastsCard
                                broadcastsToUse={broadcastsToUse}
                                deleteBroadcast={deleteBroadcast}
                                currentUser={currentUser} />
                        </Row>
                    }

                </div> : <Alert color="danger">Access Denied!</Alert>
    )
}

const mapStateToProps = state => ({
    broadcasts: state.broadcastsReducer
})

export default connect(mapStateToProps, { setBroadcasts, deleteBroadcast })(Broadcasts)