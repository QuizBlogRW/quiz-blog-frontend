import React from 'react'
import SpinningBubbles from '../rLoading/SpinningBubbles'
import LoginModal from './LoginModal'

const NotAuthenticated = ({ auth }) => {
    return (
        // If not authenticated or loading
        <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
            {
                auth.isLoading ?
                    <SpinningBubbles /> :
                    <LoginModal
                        textContent={'Login first'}
                        textColor={'text-danger font-weight-bolder my-5 border rounded'}
                        isAuthenticated={auth.isAuthenticated} />
            }
        </div>
    )
}

export default NotAuthenticated
