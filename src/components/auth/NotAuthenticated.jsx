import { useContext } from 'react'
import { useSelector } from 'react-redux'
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM'
import { Button } from 'reactstrap'
import { logRegContext } from '@/contexts/appContexts'
import './NotAuthenticated.css'

const NotAuthenticated = () => {

    const { toggleL } = useContext(logRegContext)
    const { isLoading } = useSelector((state) => state.auth);

    return (
        // If not authenticated or loading
        <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
            {
                isLoading ?
                    <QBLoadingSM /> :
                    <Button color="link" className="login-button" onClick={toggleL}>
                        Login first
                    </Button>
            }
        </div>
    )
}

export default NotAuthenticated
