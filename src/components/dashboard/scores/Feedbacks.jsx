import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, TabPane } from 'reactstrap';
import { getFeedbacks } from '@/redux/slices/feedbacksSlice';
import Pagination from '@/components/dashboard/utils/Pagination';
import PageOf from '@/components/dashboard/utils/PageOf';
import FeedbacksTable from './FeedbacksTable';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import NotAuthenticated from '@/components/auth/NotAuthenticated';
import Dashboard from '@/components/dashboard/Dashboard';

const Feedbacks = () => {

    // Redux
    const dispatch = useDispatch();
    const { allFeedbacks, isLoading, totalPages } = useSelector(state => state.feedbacks);
    const { user, isAuthenticated } = useSelector(state => state.auth);
    const [pageNo, setPageNo] = useState(1);
    const [numberOfPages, setNumberOfPages] = useState(0);

    // Lifecycle methods
    useEffect(() => {
        dispatch(getFeedbacks(pageNo));
        setNumberOfPages(totalPages && totalPages);
    }, [dispatch, pageNo, totalPages]);

    if (!isAuthenticated) return <NotAuthenticated />;
    if (user?.role === 'Visitor') return <Dashboard />;

    return (<TabPane tabId="3">
        {isLoading ?
            <QBLoadingSM title='feedbacks' /> :
            <Row>
                <PageOf pageNo={pageNo} numberOfPages={numberOfPages} />
                <FeedbacksTable
                    feedbacksToUse={allFeedbacks && allFeedbacks}
                    pageNo={pageNo} />
                <Pagination pageNo={pageNo} setPageNo={setPageNo} numberOfPages={numberOfPages} />
            </Row>}
    </TabPane>);
};

export default Feedbacks;
