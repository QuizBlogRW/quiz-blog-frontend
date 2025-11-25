import { useContext } from 'react';
import { Button } from 'reactstrap';

import { logRegContext } from '@/contexts/appContexts';
import { useSelector } from 'react-redux';

import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import './NotAuthenticated.css';

const NotAuthenticated = ({ message = 'You must be logged in' }) => {

    const { toggleL } = useContext(logRegContext);
    const { isLoading } = useSelector(state => state.auth);

    if (isLoading) {
        return (
            <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
                <QBLoadingSM />
            </div>
        );
    }
    return (
        <div className="vh-100 d-flex justify-content-center align-items-center">
            <div className="p-4 p-md-5 rounded shadow-sm text-center" style={{ maxWidth: '350px', backgroundColor: '#fff' }}>
                {<>
                    <h5 className="fw-bold text-success mb-3">
                        {message}
                    </h5>

                    <Button
                        color="warning"
                        onClick={toggleL}
                        className="fw-bold px-4 py-2 text-success"
                    >
                        Login
                    </Button>
                </>}
            </div>
        </div>
    );
};

export default NotAuthenticated;
