import React from 'react'
import { Toast, ToastHeader, ToastBody, CardTitle, Button } from 'reactstrap'
import moment from 'moment'
import { Link } from 'react-router-dom'

const Comment = ({ comment, uRole, isFromPending, rejectComment, approveComment }) => {

    const questionID = comment && comment.question && comment.question._id
    const quizID = comment && comment.quiz && comment.quiz._id
    const questionTEXT = comment && comment.question && comment.question.questionText
    const commentSender = comment && comment.sender && comment.sender.name
    const commentDate = comment && comment.createdAt
    const formattedCDate = commentDate && moment(commentDate).format('YYYY-MM-DD, HH:mm')

    return (
        <div className="my-3">
            <CardTitle tag="p" className="w-100 text-uppercase text-center font-weight-bolder d-flex justify-content-between bg-info text-white p-2">
                <Link to={`/quiz-ranking/${quizID && quizID}`} style={{ color: "khaki" }}>
                    {comment.quiz && comment.quiz.title}
                </Link>

                {(isFromPending && uRole === "SuperAdmin") ?
                    <span>
                        <Button color="success" className='mx-1 text-white text-uppercase'
                            onClick={() => approveComment({
                                commentID: comment && comment._id,
                                status: "Approved"
                            })}>
                            Approve
                        </Button>

                        <Button color="danger" className='mx-1 text-white text-uppercase'
                            onClick={() => rejectComment({
                                commentID: comment && comment._id,
                                status: "Rejected"
                            })}>
                            Reject
                        </Button>
                    </span> :

                    uRole === "Visitor" ? null :

                        <Button className={`${comment.status === 'Pending' ? 'text-warning' :
                            comment.status === 'Rejected' ? 'text-danger' : 'text-success'} bg-white text-uppercase`}>
                            {comment.status}
                        </Button>
                }

            </CardTitle>

            <small className='text-uppercase font-weight-bolder mb-4'>
                <Link to={`/view-question/${questionID && questionID}`}>
                    {questionTEXT && questionTEXT}
                </Link>
            </small>

            <div className='mt-3'>
                <Toast style={{ maxWidth: '100%' }}>
                    <ToastHeader icon="warning" className="text-success">
                        {commentSender && commentSender}
                        <small className="ml-2 px-1 text-dark bg-danger">
                            {formattedCDate && formattedCDate}
                        </small>
                    </ToastHeader>
                    <ToastBody className='text-secondary'>
                        {comment.comment}
                    </ToastBody>
                </Toast>
            </div>
        </div>
    )
}

export default Comment