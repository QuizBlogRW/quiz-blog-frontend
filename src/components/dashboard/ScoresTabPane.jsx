import React, { useState, useEffect, useContext } from 'react'
import { Row, TabPane } from 'reactstrap'
import Pagination from './Pagination'
import PageOf from './PageOf'
import ScoresTable from './ScoresTable'
import QBLoadingSM from '../rLoading/QBLoadingSM'
import { setScores, getCreatorScores, getTakerScores, deleteScore } from '../../redux/slices/scoresSlice'
import { useSelector, useDispatch } from 'react-redux'
import { currentUserContext } from '../../appContexts'

const ScoresTabPane = () => {

    // Redux
    const dispatch = useDispatch()
    const scores = useSelector(state => state.scores)

    // context
    const currentUser = useContext(currentUserContext)

    const uId = currentUser && currentUser._id
    const uRole = currentUser && currentUser.role
    const totPages = scores && scores.totalPages
    const scoresToUse = scores && (uRole === 'Admin' || uRole === 'SuperAdmin') ? scores.allScores :
        scores && (uRole === 'Creator') ? scores.creatorScores : scores.takerScores

    const [pageNo, setPageNo] = useState(1)
    const [numberOfPages, setNumberOfPages] = useState(0)

    // Lifecycle methods
    useEffect(() => {
        if (uRole === 'Admin' || uRole === 'SuperAdmin') {
            dispatch(setScores(pageNo))
            setNumberOfPages(totPages)
        }
        else if (uRole === 'Creator') {
            dispatch(getCreatorScores(uId, pageNo))
        }
        else {
            dispatch(getTakerScores(uId, pageNo))
        }
    }, [pageNo, uRole, uId, dispatch, totPages])

    return (

        <TabPane tabId="3">
            {
                scores.isLoading ?
                    <QBLoadingSM title='scores' /> :

                    <Row>
                        {(uRole === 'Admin' || uRole === 'SuperAdmin') ?
                            <PageOf pageNo={pageNo} numberOfPages={numberOfPages} /> : null}

                        <ScoresTable
                            scoresToUse={scoresToUse}
                            deleteScore={deleteScore}
                            pageNo={pageNo} />

                        {uRole !== 'Visitor' ?
                            <>
                                <Pagination pageNo={pageNo} setPageNo={setPageNo} numberOfPages={numberOfPages} />
                            </> : null}
                    </Row>}
        </TabPane>
    )
}

export default ScoresTabPane