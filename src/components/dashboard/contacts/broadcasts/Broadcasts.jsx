import { useEffect } from 'react';
import { Row, Alert } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { getBroadcasts } from '@/redux/slices/broadcastsSlice';

import BroadcastsCard from './BroadcastCard';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';

const Broadcasts = () => {
    const dispatch = useDispatch();

    const { allBroadcasts = [], isLoading } = useSelector(state => state.broadcasts);
    const { user } = useSelector(state => state.users);

    const curUserRole = user?.role || [];

    useEffect(() => {
        dispatch(getBroadcasts());
    }, [dispatch]);


    // --- ACCESS CONTROL ---
    if (!curUserRole.includes('Admin')) {
        return <Alert color="danger">Access Denied!</Alert>;
    }


    return (
        <div className="broadcasts-section px-3 px-sm-4 py-3 py-sm-5 d-flex flex-column align-items-center">
            <div className="jbtron rounded w-lg-75 px-3 px-sm-4 py-3 py-sm-5 p-2 m-2 
                            text-center border border-info">

                <h1
                    className="display-4 fw-bolder text-center my-3 mb-lg-4"
                    style={{ color: 'var(--accent)' }}
                >
                    Broadcasts
                </h1>

                <p className="lead mb-1 mb-lg-4 text-white">
                    These are all broadcasts sent to users across the Quiz-Blog platform.
                </p>
            </div>

            {isLoading ? (
                <QBLoadingSM title="broadcasts" />
            ) : (
                <Row className="w-100 mt-4">
                    {allBroadcasts.length === 0 ? (
                        <div className="text-center py-5 text-muted w-100">
                            <h5>No broadcasts found.</h5>
                            <p className="small">New broadcasts will appear here.</p>
                        </div>
                    ) : (
                        <BroadcastsCard broadcastsToUse={allBroadcasts} />
                    )}
                </Row>
            )}
        </div>
    );
};

export default Broadcasts;
