import React, { useEffect } from 'react'
import { Col, Card, Alert } from 'reactstrap'
import ReactLoading from "react-loading"
import { connect } from 'react-redux'
import { approveComment, rejectComment, getPendingComments } from '../../../../redux/questionComments/questionComments.actions'
import Comment from './Comment'

const PendingComments = ({ currentUser, getPendingComments, approveComment, rejectComment, questionComments }) => {

    // Lifecycle methods
    useEffect(() => {
        getPendingComments()
    }, [getPendingComments])

    const uRole = currentUser && currentUser.role

    return (
        questionComments.pendingCommentsLoading ?
            <div className="p-1 m-1 d-flex justify-content-center align-items-center">
                <ReactLoading type="bubbles" color="#33FFFC" />Pending comments ...</div> :

            questionComments && questionComments.pendingComments.length > 0 ?
                <>
                    <h5 className='text-center w-100 my-4 font-weight-bold'>
                        PENDING COMMENTS ({questionComments && questionComments.pendingComments.length})
                    </h5>

                    <Col sm={12} className="mt-2 comments-card">
                        <Card body>
                            {
                                // PENDING QUESTION COMMENTS
                                questionComments.pendingComments.map((comment, i) => (
                                    <Comment comment={comment} isFromPending={true} uRole={uRole} approveComment={approveComment} rejectComment={rejectComment} key={i} />
                                ))}
                        </Card>
                    </Col>
                </> :

                <Alert color="success" className="w-100 text-center">
                    Hooray! there are no pending comments today!
                </Alert>
    )
}

const mapStateToProps = state => ({
    questionComments: state.questionCommentsReducer
})

export default connect(mapStateToProps, { getPendingComments, approveComment, rejectComment })(PendingComments)