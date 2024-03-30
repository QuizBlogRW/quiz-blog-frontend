import React, { useContext } from 'react'
import QBLoadingSM from '../rLoading/QBLoadingSM'
import { Button } from 'reactstrap'
import { logRegContext } from '../../appContexts'

const NotAuthenticated = ({ auth }) => {

    const { toggleL } = useContext(logRegContext)

    return (
        // If not authenticated or loading
        <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
            {
                auth.isLoading ?
                    <QBLoadingSM /> :
                    <Button color="link" className="fw-bolder my-5 border rounded" onClick={toggleL} style={{ backgroundColor: "#ffc107", color: "#157A6E", fontSize: "1.5vw", boxShadow: "-2px 2px 1px 2px #157A6E", border: "2px solid #157A6E" }}>
                        Login first
                    </Button>
            }
        </div>
    )
}

export default NotAuthenticated
