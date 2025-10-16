import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Row, TabPane } from 'reactstrap'
import Pagination from '@/components/dashboard/utils/Pagination'
import PageOf from '@/components/dashboard/utils/PageOf'
import FeedbacksTable from './FeedbacksTable'
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM'
import { getFeedbacks } from '@/redux/slices/feedbacksSlice'

const Feedbacks = () => {

    // Redux
    const dispatch = useDispatch()
    const { allFeedbacks, isLoading, totalPages } = useSelector(state => state.feedbacks)
    const [pageNo, setPageNo] = useState(1)
    const [numberOfPages, setNumberOfPages] = useState(0)

    // Lifecycle methods
    useEffect(() => {
        dispatch(getFeedbacks(pageNo))
        setNumberOfPages(totalPages && totalPages)
    }, [dispatch, pageNo, totalPages])

    return (

        <TabPane tabId="3">
            {
                isLoading ?
                    <QBLoadingSM title='feedbacks' /> :
                    <Row>
                        <PageOf pageNo={pageNo} numberOfPages={numberOfPages} />

                        <FeedbacksTable
                            feedbacksToUse={allFeedbacks && allFeedbacks}
                            pageNo={pageNo} />
                        <Pagination pageNo={pageNo} setPageNo={setPageNo} numberOfPages={numberOfPages} />
                    </Row>}
        </TabPane>
    )
}

export default Feedbacks