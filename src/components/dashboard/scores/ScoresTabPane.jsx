import { useState, useEffect } from 'react';
import { Row, TabPane } from 'reactstrap';
import Pagination from '@/components/dashboard/utils/Pagination';
import PageOf from '@/components/dashboard/utils/PageOf';
import ScoresTable from './ScoresTable';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import { setScores, getCreatorScores, getTakerScores, deleteScore } from '@/redux/slices/scoresSlice';
import { useSelector, useDispatch } from 'react-redux';

const ScoresTabPane = () => {

    // Redux
    const dispatch = useDispatch();
    const { isLoading, totalPages, allScores, creatorScores, takerScores } = useSelector(state => state.scores);
    const { user } = useSelector(state => state.auth);
    const scoresToUse = allScores && user && (user?.role === 'Admin' || user?.role === 'SuperAdmin') ? allScores : allScores && (user?.role === 'Creator') ? creatorScores : takerScores;
    const [pageNo, setPageNo] = useState(1);

    // Lifecycle methods
    useEffect(() => {
        if (user?.role === 'Admin' || user?.role === 'SuperAdmin') {
            dispatch(setScores(pageNo));
        }
        else if (user?.role === 'Creator') {
            dispatch(getCreatorScores(user?._id, pageNo));
        }
        else {
            dispatch(getTakerScores(user?._id, pageNo));
        }
    }, [dispatch, pageNo, user, totalPages]);

    return (

        <TabPane tabId="4">
            {isLoading ?
                <QBLoadingSM title='scores' /> :

                <Row>
                    <p className='m-3 w-100'>
                        To see more about quizzes feedbacks, click here 👉<button className="btn btn-sm btn-outline-warning ms-2">
                            <a href={'/feedbacks'} style={{ color: 'var(--brand)', fontWeight: 'bolder' }}>Feedbacks</a>
                        </button>
                    </p>
                    {(user?.role === 'Admin' || user?.role === 'SuperAdmin') ?
                        <PageOf pageNo={pageNo} numberOfPages={totalPages} /> : null}

                    <ScoresTable
                        scoresToUse={scoresToUse}
                        deleteScore={deleteScore}
                        pageNo={pageNo} />

                    {user?.role !== 'Visitor' ?
                        <>
                            <Pagination pageNo={pageNo} setPageNo={setPageNo} numberOfPages={totalPages} />
                        </> : null}
                </Row>}
        </TabPane>
    );
};

export default ScoresTabPane;
