import { useContext } from 'react';
import { useSelector } from 'react-redux';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import { Button } from 'reactstrap';
import { logRegContext } from '@/contexts/appContexts';
import './NotAuthenticated.css';

const NotAuthenticated = () => {
    const { toggleL } = useContext(logRegContext);
    const { isLoading } = useSelector((state) => state.auth);

    return (
        <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
            <div
                className="p-4 p-md-5 rounded shadow-sm text-center"
                style={{ maxWidth: '350px', backgroundColor: '#fff' }}
            >
                {isLoading ? (
                    <QBLoadingSM />
                ) : (
                    <>
                        <h5 className="fw-bold text-danger mb-3">
                            You must be logged in
                        </h5>

                        <Button
                            color="danger"
                            onClick={toggleL}
                            className="fw-bold px-4 py-2"
                        >
                            Login
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default NotAuthenticated;
