import React, { useState, useEffect, useContext } from 'react'
import { Row, TabPane } from 'reactstrap';
import { connect } from 'react-redux'
import { setScores, getCreatorScores, getTakerScores, deleteScore } from '../../redux/scores/scores.actions'
import Pagination from './Pagination';
import PageOf from './PageOf';
import ScoresTable from './ScoresTable'
import SpinningBubbles from '../rLoading/SpinningBubbles';
import { currentUserContext } from '../../appContexts'

const ScoresTabPane = ({ scores, setScores, getCreatorScores, getTakerScores, deleteScore }) => {

    // context
    const currentUser = useContext(currentUserContext)

    const uId = currentUser && currentUser._id
    const uRole = currentUser && currentUser.role
    const totPages = scores && scores.totalPages
    const scoresToUse = scores && (uRole === 'Admin' || uRole === 'SuperAdmin') ? scores.allScores :
        scores && (uRole === 'Creator') ? scores.creatorScores : scores.takerScores

    const [pageNo, setPageNo] = useState(1);
    const [numberOfPages, setNumberOfPages] = useState(0)

    // Lifecycle methods
    useEffect(() => {
        if (uRole === 'Admin' || uRole === 'SuperAdmin') {
            setScores(pageNo)
            setNumberOfPages(totPages)
        }
        else if (uRole === 'Creator') {
            getCreatorScores(uId)
        }
        else {
            getTakerScores(uId)
        }
    }, [setScores, getCreatorScores, getTakerScores, pageNo, uId, totPages, uRole])

    return (

        <TabPane tabId="3">

            {
                scores.isLoading ?
                    <SpinningBubbles title='scores' /> :

                    <Row>
                        {(uRole === 'Admin' || uRole === 'SuperAdmin') ?
                            <PageOf pageNo={pageNo} numberOfPages={numberOfPages} /> : null}

                        <ScoresTable
                            scoresToUse={scoresToUse}
                            deleteScore={deleteScore}
                            currentUser={currentUser}
                            pageNo={pageNo} />

                        {uRole !== 'Visitor' ?
                            <>
                                <Pagination pageNo={pageNo} setPageNo={setPageNo} numberOfPages={numberOfPages} />
                            </> : null}
                    </Row>}
        </TabPane>
    )
}

const mapStateToProps = state => ({
    scores: state.scoresReducer
})

export default connect(mapStateToProps, { setScores, getCreatorScores, getTakerScores, deleteScore })(ScoresTabPane)