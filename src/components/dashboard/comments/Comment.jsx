import { Toast, ToastHeader, ToastBody, CardTitle, Button } from 'reactstrap';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { approveRejectComment } from '@/redux/slices/questionsCommentsSlice';
import { useDispatch, useSelector } from 'react-redux';

const Comment = ({ comment, isFromPending }) => {

    const { user } = useSelector(state => state.users);
    const dispatch = useDispatch();

    const { _id: questionID, questionText } = comment?.question || {};
    const { _id: quizID, title: quizTitle } = comment?.quiz || {};
    const { name: commentSender } = comment?.sender || {};

    const commentDate = comment?.createdAt;
    const formattedCDate = commentDate && moment(commentDate).format('YYYY-MM-DD, HH:mm');

    return (
        <div className="my-4 p-3 border rounded bg-light shadow-sm">

            {/* Top Row */}
            <CardTitle
                tag="div"
                className="
          d-flex 
          justify-content-between 
          align-items-center 
          text-uppercase 
          fw-bold 
          bg-info 
          text-white 
          p-2 
          rounded
        "
            >
                <Link to={`/quiz-ranking/${quizID}`} className="text-warning fw-bold">
                    {quizTitle}
                </Link>

                {isFromPending && user.role?.includes('Admin') ? (
                    <div className="d-flex">
                        <Button
                            color="success"
                            size="sm"
                            className="text-white text-uppercase me-1"
                            onClick={() =>
                                dispatch(approveRejectComment({
                                    commentID: comment?._id,
                                    status: 'Approved'
                                }))
                            }
                        >
                            Approve
                        </Button>

                        <Button
                            color="danger"
                            size="sm"
                            className="text-white text-uppercase"
                            onClick={() =>
                                dispatch(approveRejectComment({
                                    commentID: comment?._id,
                                    status: 'Rejected'
                                }))
                            }
                        >
                            Reject
                        </Button>
                    </div>
                ) : (
                    user?.role === 'Visitor' && (
                        <Button
                            size="sm"
                            className={`
                bg-white 
                text-uppercase 
                fw-bold 
                ${comment?.status === 'Pending' ? 'text-warning' : ''} 
                ${comment?.status === 'Rejected' ? 'text-danger' : ''} 
                ${comment?.status === 'Approved' ? 'text-success' : ''}
              `}
                        >
                            {comment?.status}
                        </Button>
                    )
                )}
            </CardTitle>

            {/* Question Text */}
            <div className="mt-2">
                <small className="text-uppercase fw-bold">
                    <Link to={`/view-question/${questionID}`} className="text-decoration-none text-primary">
                        {questionText}
                    </Link>
                </small>
            </div>

            {/* Comment Box */}
            <div className="mt-3">
                <Toast className="w-100 shadow-sm rounded" fade={false}>
                    <ToastHeader icon="warning" className="text-success fw-bold">
                        {commentSender}

                        <small className="ms-2 px-2 py-1 bg-danger text-white rounded">
                            {formattedCDate}
                        </small>
                    </ToastHeader>

                    <ToastBody className="text-secondary fs-6" style={{ lineHeight: '1.5' }}>
                        {comment?.comment}
                    </ToastBody>
                </Toast>
            </div>

        </div>
    );
};

export default Comment;
