import { Toast, ToastHeader, ToastBody, CardTitle, Button } from 'reactstrap'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { approveRejectComment } from '@/redux/slices/questionsCommentsSlice'
import { useDispatch, useSelector } from 'react-redux'

const Comment = ({ comment, isFromPending }) => {
    
    // Redux
    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const { _id: questionID, questionText: questionText } = comment?.question || {}
    const { _id: quizID, title: quizTitle } = comment?.quiz || {}
    const { name: commentSender } = comment?.sender || {}
    const commentDate = comment?.createdAt
    const formattedCDate = commentDate && moment(commentDate).format('YYYY-MM-DD, HH:mm')

    return (
        <div className="my-3">
            <CardTitle tag="p" className="w-100 text-uppercase text-center fw-bolder d-flex justify-content-between bg-info text-white p-2">
                <Link to={`/quiz-ranking/${quizID}`} style={{ color: "khaki" }}>
                    {quizTitle}
                </Link>

                {isFromPending && user?.role === "SuperAdmin" ? (
                    <span>
                        <Button color="success" className='mx-1 text-white text-uppercase'
                            onClick={() => dispatch(approveRejectComment({ commentID: comment?._id, status: "Approved" }))}>
                            Approve
                        </Button>
                        <Button color="danger" className='mx-1 text-white text-uppercase'
                            onClick={() => dispatch(approveRejectComment({ commentID: comment?._id, status: "Rejected" }))}>
                            Reject
                        </Button>
                    </span>
                ) : user?.role === "Visitor" && (
                    <Button className={`${comment?.status === 'Pending' ? 'text-warning' :
                        comment?.status === 'Rejected' ? 'text-danger' : 'text-success'} bg-white text-uppercase`}>
                        {comment?.status}
                    </Button>
                )}
            </CardTitle>

            <small className='text-uppercase fw-bolder mb-4'>
                <Link to={`/view-question/${questionID}`}>
                    {questionText}
                </Link>
            </small>

            <div className='mt-3'>
                <Toast className='w-100' fade={false}>
                    <ToastHeader icon="warning" className="text-success">
                        {commentSender}
                        <small className="ms-2 px-1 text-dark bg-danger">
                            {formattedCDate}
                        </small>
                    </ToastHeader>
                    <ToastBody className='text-secondary'>
                        {comment?.comment}
                    </ToastBody>
                </Toast>
            </div>
        </div>
    )
}

export default Comment