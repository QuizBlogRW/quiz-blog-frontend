import React, { useState, useEffect, useContext } from 'react'
import { Col, Row, TabPane, Card, Alert, ListGroup, Button } from 'reactstrap'
import QBLoadingSM from '../../../rLoading/QBLoadingSM'

import { getComments, getPaginatedComments } from '../../../../redux/slices/questionCommentsSlice'
import { getAllComments } from '../../../../redux/slices/quizCommentsSlice'
import { useSelector, useDispatch } from 'react-redux'
import Comment from './Comment'
import PendingComments from './PendingComments'
import SearchInput from '../../../../utils/SearchInput'
import Pagination from '../../../dashboard/Pagination'
import PageOf from '../../../dashboard/PageOf'
import { currentUserContext } from '../../../../appContexts'

const CommentsTabPane = () => {

    // Redux
    const dispatch = useDispatch()
    const questionComments = useSelector(state => state.questionComments)
    const allQuizComments = useSelector(state => state.quizComments)

    // context
    const currentUser = useContext(currentUserContext)

    const totPages = questionComments && questionComments.totalPages
    const uRole = currentUser && currentUser.role
    const [pageNo, setPageNo] = useState(1)
    const [numberOfPages, setNumberOfPages] = useState(0)
    const [searchKey, setSearchKey] = useState('')
    const [searchKeyQ, setSearchKeyQ] = useState('')
    const [showAll, setShowAll] = useState(false)

    // Lifecycle methods
    useEffect(() => {
        dispatch(getComments())
        dispatch(getAllComments())
        dispatch(getPaginatedComments(pageNo))
        setNumberOfPages(totPages)
    }, [dispatch, pageNo, totPages])

    const pagComments = questionComments && questionComments.paginatedComments
    const allQnCmts = questionComments.allComments
    const allQuizCmts = allQuizComments.allComments

    return (

        <TabPane tabId="9">

            <Row>
                <PendingComments currentUser={currentUser} />
            </Row>

            <Row>
                {questionComments.getPaginatedCommentsLoading ?
                    <QBLoadingSM title='paginated comments' /> :

                    pagComments && pagComments.length > 0 ?
                        <>
                            {(uRole === 'Admin' || uRole === 'SuperAdmin') ?
                                // ONLY FOR QUESTION COMMENTS
                                <PageOf pageNo={pageNo} numberOfPages={numberOfPages} /> : null}

                            {
                                // SEARCH BARS -IF ALL QUIZ COMMENTS AND ALL QUESTION COMMENTS ARE LOADED
                                allQuizComments.isLoading || questionComments.isLoading ?
                                    <div className="p-1 m-1 d-flex justify-content-center align-items-center">
                                        <QBLoadingSM />  </div> :
                                    <Row className="mt-0 w-100">
                                        <Col sm="6">
                                            <SearchInput setSearchKey={setSearchKeyQ} placeholder=" Search question comments here ...  " />
                                        </Col>

                                        <Col sm="6">
                                            <SearchInput setSearchKey={setSearchKey} placeholder=" Search quiz comments here ...  " />
                                        </Col>
                                    </Row>
                            }

                            {/* SEARCH QUESTION COMMENTS */}
                            <Row>
                                <ListGroup>
                                    {allQnCmts && allQnCmts
                                        .filter(cmnt => {
                                            if (searchKeyQ === "") {
                                                return null
                                            } else if (cmnt.comment.toLowerCase().includes(searchKeyQ.toLowerCase())) {
                                                return cmnt
                                            }
                                            return null
                                        })
                                        .map(cmnt => (
                                            <Comment comment={cmnt} key={cmnt._id} />
                                        ))}
                                </ListGroup>
                            </Row>


                            {/* SEARCH QUIZ COMMENTS */}
                            <Row>
                                <ListGroup>
                                    {allQuizCmts && allQuizCmts
                                        .filter(cmnt => {
                                            if (searchKey === "") {
                                                return null
                                            } else if (cmnt.comment.toLowerCase().includes(searchKey.toLowerCase())) {
                                                return cmnt
                                            }
                                            return null
                                        })
                                        .map(cmnt => (
                                            <Comment comment={cmnt} key={cmnt._id} uRole={uRole} />
                                        ))}
                                </ListGroup>
                            </Row>

                            <Row>
                                <Col sm={12} className="mt-2 comments-card">
                                    <Card body>

                                        {
                                            // PAGINATED QUESTION COMMENTS
                                            pagComments.map((comment, i) => (
                                                <Comment comment={comment} key={i} uRole={uRole} />
                                            ))}

                                        {
                                            // IF QUIZ COMMENTS ARE LOADING
                                            allQuizComments.isLoading ?
                                                <div className="p-1 m-1 d-flex justify-content-center align-items-center">
                                                    <QBLoadingSM />  </div> :

                                                // ALL QUIZ COMMENTS ARE LOADED
                                                <>
                                                    {allQuizCmts.length > 0 && allQuizCmts.map((comment, i) => (
                                                        showAll && <Comment comment={comment} key={i} uRole={uRole} />
                                                    ))}

                                                    <Button color="warning" outline className='mt-2 mx-auto d-block text-success text-uppercase fw-bolder'
                                                        onClick={() => setShowAll(!showAll)}>
                                                        {showAll ? 'Hide' : 'Show'} all old quizes comments
                                                    </Button>
                                                </>}
                                    </Card>
                                </Col>
                            </Row>

                            {/* PAGINATION */}
                            {uRole !== 'Visitor' ?
                                <>
                                    <Pagination pageNo={pageNo} setPageNo={setPageNo} numberOfPages={numberOfPages} />
                                </> : null}
                        </> :
                        <Alert color="danger" className="w-100 text-center my-3">
                            There are no comments yet!
                        </Alert>
                }
            </Row>
        </TabPane>
    )
}

export default CommentsTabPane