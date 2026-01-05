import { useEffect, useMemo } from 'react';
import { Col, Row, Card, CardBody, Alert, Badge } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { getCommentsByQuiz } from '@/redux/slices/questionsCommentsSlice';
import { getOneQuizComments } from '@/redux/slices/quizzesCommentsSlice';
import Comment from '../dashboard/comments/Comment';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';

const ViewQuizComments = ({ quizID }) => {
  
  const dispatch = useDispatch();

  // Redux selectors
  const { commentsByQuiz } = useSelector((state) => state.questionsComments);
  const qnLoading = useSelector((state) => state.questionsComments.isLoading.commentsByQuiz);
  const { quizzesComments } = useSelector((state) => state.quizzesComments);
  const qzLoading = useSelector((state) => state.quizzesComments.isLoading.quizzesComments);

  // Fetch comments on mount
  useEffect(() => {
    if (quizID) {
      dispatch(getCommentsByQuiz(quizID));
      dispatch(getOneQuizComments(quizID));
    }
  }, [dispatch, quizID]);

  // Combine and organize comments
  const organizedComments = useMemo(() => {
    const questionComments = commentsByQuiz || [];
    const generalComments = quizzesComments || [];

    // Group question comments by question
    const groupedByQuestion = questionComments.reduce((acc, comment) => {
      const questionId = comment.question?._id;
      if (!questionId) return acc;

      if (!acc[questionId]) {
        acc[questionId] = {
          question: comment.question,
          comments: [],
        };
      }
      acc[questionId].comments.push(comment);
      return acc;
    }, {});

    return {
      questionComments: Object.values(groupedByQuestion),
      generalComments,
      totalCount: questionComments.length + generalComments.length,
    };
  }, [commentsByQuiz, quizzesComments]);

  // Loading state
  const isLoading = qnLoading && qzLoading;

  // Check if there are any comments
  const hasComments = organizedComments.totalCount > 0;

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <QBLoadingSM />
      </div>
    );
  }

  if (!hasComments) {
    return (
      <Alert
        color="info"
        className="text-center border-0 shadow-sm"
        style={{ backgroundColor: '#f0f8ff' }}
      >
        <i className="fa fa-comment-slash fa-2x mb-3 d-block text-muted"></i>
        <h5 className="mb-2">No Comments Yet</h5>
        <p className="mb-0 text-muted">
          Be the first to share your thoughts on this quiz!
        </p>
      </Alert>
    );
  }

  return (
    <Row>
      <Col xs={12}>
        {/* Comment Count Badge */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">
            <i className="fa fa-comments me-2 text-primary"></i>
            All Comments
          </h5>
          <Badge color="primary" pill className="px-3 py-2">
            {organizedComments.totalCount}{' '}
            {organizedComments.totalCount === 1 ? 'Comment' : 'Comments'}
          </Badge>
        </div>

        {/* General Quiz Comments */}
        {organizedComments.generalComments.length > 0 && (
          <div className="mb-4">
            <h6 className="text-muted mb-3">
              <i className="fa fa-comment-dots me-2"></i>
              General Comments
            </h6>
            {organizedComments.generalComments.map((comment, index) => (
              <Card
                key={comment._id || `general-${index}`}
                className="mb-3 border-0 shadow-sm"
              >
                <CardBody className="p-3">
                  <Comment comment={comment} />
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* Question-Specific Comments */}
        {organizedComments.questionComments.length > 0 && (
          <div>
            <h6 className="text-muted mb-3">
              <i className="fa fa-question-circle me-2"></i>
              Question Comments
              <Badge color="secondary" className="ms-2" pill>
                {organizedComments.questionComments.length}
              </Badge>
            </h6>

            {organizedComments.questionComments.map((group, index) => (
              <Card
                key={group.question._id || `question-${index}`}
                className="mb-3 border-0 shadow-sm"
              >
                <CardBody className="p-0">
                  {/* Question Header */}
                  <div
                    className="p-3 border-bottom"
                    style={{ backgroundColor: '#f8f9fa' }}
                  >
                    <Link
                      to={`/view-question/${group.question._id}`}
                      className="text-decoration-none"
                      style={{ color: 'var(--brand)' }}
                    >
                      <div className="d-flex align-items-start">
                        <i className="fa fa-link me-2 mt-1"></i>
                        <div className="flex-grow-1">
                          <strong className="d-block mb-1">
                            {group.question.questionText}
                          </strong>
                          <Badge color="info" className="me-2">
                            {group.comments.length}{' '}
                            {group.comments.length === 1 ? 'Comment' : 'Comments'}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  </div>

                  {/* Comments for this question */}
                  <div className="p-3">
                    {group.comments.map((comment, commentIndex) => (
                      <div
                        key={comment._id || `comment-${commentIndex}`}
                        className={commentIndex > 0 ? 'mt-3 pt-3 border-top' : ''}
                      >
                        <Comment comment={comment} />
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* Summary Footer */}
        <div className="text-center mt-4 p-3 rounded border" style={{ backgroundColor: '#f8f9fa' }}>
          <small className="text-muted">
            <i className="fa fa-info-circle me-1"></i>
            Showing {organizedComments.totalCount} total{' '}
            {organizedComments.totalCount === 1 ? 'comment' : 'comments'}
            {' '}({organizedComments.generalComments.length} general,{' '}
            {commentsByQuiz?.length || 0} on questions)
          </small>
        </div>
      </Col>
    </Row>
  );
};

export default ViewQuizComments;
