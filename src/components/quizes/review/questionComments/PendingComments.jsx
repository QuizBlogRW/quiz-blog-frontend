import React, { useEffect } from 'react'
import { Col, Card, Alert } from 'reactstrap'
import QBLoadingSM from '../../../rLoading/QBLoadingSM'
import { getPendingComments } from '../../../../redux/slices/questionCommentsSlice'
import { useSelector, useDispatch } from 'react-redux'
import Comment from './Comment'

const PendingComments = ({ currentUser }) => {

    // Redux
    const dispatch = useDispatch()
    const questionComments = useSelector(state => state.questionComments)

    // Lifecycle methods
    useEffect(() => {
        dispatch(getPendingComments())
    }, [dispatch])

    const uRole = currentUser && currentUser.role

    return (
        questionComments.pendingCommentsLoading ?
            <div className="p-1 m-1 d-flex justify-content-center align-items-center">
                <QBLoadingSM /> Pending comments ...</div> :

            questionComments && questionComments.pendingComments.length > 0 ?
                <>
                    <h5 className='text-center w-100 my-4 fw-bolder'>
                        PENDING COMMENTS ({questionComments && questionComments.pendingComments.length})
                    </h5>

                    <Col sm={12} className="mt-2 comments-card">
                        <Card body>
                            {
                                // PENDING QUESTION COMMENTS
                                questionComments.pendingComments.map((comment, i) => (
                                    <Comment comment={comment} isFromPending={true} uRole={uRole} key={i} />
                                ))}
                        </Card>
                    </Col>
                </> :

                <Alert color="success" className="w-100 text-center">
                    Hooray! there are no pending comments today!
                </Alert>
    )
}

export default PendingComments