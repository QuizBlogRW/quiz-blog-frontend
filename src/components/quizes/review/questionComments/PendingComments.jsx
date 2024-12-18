import React, { useEffect } from 'react'
import { Col, Card, Alert } from 'reactstrap'
import QBLoadingSM from '../../../rLoading/QBLoadingSM'
import { getPendingComments } from '../../../../redux/slices/questionCommentsSlice'
import { useSelector, useDispatch } from 'react-redux'
import Comment from './Comment'

const PendingComments = () => {

    // Redux
    const dispatch = useDispatch()
    const questionComments = useSelector(state => state.questionComments)

    // Lifecycle methods
    useEffect(() => {
        dispatch(getPendingComments())
    }, [dispatch])

    const currentUser = useSelector(state => state.auth && state.auth.user)
    const uRole = currentUser && currentUser.role

    const renderLoading = () => (
        <div className="p-1 m-1 d-flex justify-content-center align-items-center">
            <QBLoadingSM />
        </div>
    )

    const renderComments = () => (
        <>
            <h5 className='text-center w-100 my-4 fw-bolder'>
                PENDING COMMENTS ({questionComments.pendingComments.length})
            </h5>
            <Col sm={12} className="mt-2 comments-card">
                <Card body>
                    {questionComments.pendingComments.map((comment, i) => (
                        <Comment comment={comment} isFromPending={true} uRole={uRole} key={i} />
                    ))}
                </Card>
            </Col>
        </>
    )

    const renderNoComments = () => (
        <Alert color="success" className="w-100 text-center">
            Hooray, wait! ...
        </Alert>
    )

    return (
        questionComments.isLoading ? renderLoading() :
            questionComments.pendingComments.length > 0 ? renderComments() : renderNoComments()
    )
}

export default PendingComments