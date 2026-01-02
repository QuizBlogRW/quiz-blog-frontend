import { useState, useEffect, useMemo, useCallback } from 'react';
import { Col, Row, Card, CardBody, Button, Badge, Collapse } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';

import {
  getCommentsByQuiz,
  getOneQuestionComments,
} from '@/redux/slices/questionsCommentsSlice';
import { getOneQuizComments } from '@/redux/slices/quizzesCommentsSlice';

import Comment from '../../../dashboard/comments/Comment';
import AddComment from './AddComment';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';

const QuestionComments = ({ questionID, quizID, fromSingleQuestion = false }) => {
  const dispatch = useDispatch();

  const {
    commentsByQuiz,
    oneQuestionComments,
  } = useSelector((state) => state.questionsComments);

  const {
    isLoading: {
      oneQuestionComments: isQuestionLoading,
      commentsByQuiz: isQuizQuestionsLoading,
    },
  } = useSelector((state) => state.questionsComments);

  const {
    isLoading: {
      oneQuizComments: isQuizGeneralLoading,
    },
  } = useSelector((state) => state.quizzesComments);

  const {
    oneQuizComments,
  } = useSelector((state) => state.quizzesComments);

  const [showAll, setShowAll] = useState(false);

  // Fetch all comments
  useEffect(() => {
    if (questionID && quizID) {
      dispatch(getCommentsByQuiz(quizID));
      dispatch(getOneQuestionComments(questionID));
      dispatch(getOneQuizComments(quizID));
    }
  }, [dispatch, questionID, quizID]);

  // Calculate comment counts
  const commentCounts = useMemo(() => {

    const questionCount = oneQuestionComments?.length || 0;
    const quizQuestionsCount = commentsByQuiz?.length || 0;
    const quizGeneralCount = oneQuizComments?.length || 0;
    const totalQuizCount = quizQuestionsCount + quizGeneralCount;

    return {
      question: questionCount,
      totalQuiz: totalQuizCount,
      quizQuestions: quizQuestionsCount,
      quizGeneral: quizGeneralCount,
    };
  }, [oneQuestionComments, commentsByQuiz, oneQuizComments]);

  // Toggle show all comments
  const toggleShowAll = useCallback(() => {
    setShowAll((prev) => !prev);
  }, []);

  return (
    <>
      {/* Add Comment Section */}
      <Row className="mt-4">
        <Col xs={12}>
          <Card className="shadow-sm border-0 rounded-4">
            <CardBody className="p-3 p-md-4">
              <div className="mb-3">
                <h5 className="fw-bold mb-1">
                  <i className="fa fa-comment-dots me-2 text-primary"></i>
                  Add Your Comment
                </h5>
                <p className="text-muted small mb-0">
                  Share your thoughts, ask questions, or help others understand better
                </p>
              </div>
              <AddComment
                question={questionID}
                quiz={quizID}
                fromSingleQuestion={fromSingleQuestion}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Comments on This Question */}
      {oneQuestionComments?.length > 0 && (
        <Row className="mt-4">
          <Col xs={12}>
            <Card className="shadow-sm border-0 rounded-4">
              <CardBody className="p-3 p-md-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold mb-0">
                    <i className="fa fa-comments me-2 text-success"></i>
                    Question Comments
                  </h5>
                  <Badge color="success" pill className="px-3 py-2">
                    {commentCounts.question}{' '}
                    {commentCounts.question === 1 ? 'Comment' : 'Comments'}
                  </Badge>
                </div>

                {isQuestionLoading ? (
                  <QBLoadingSM />
                ) : (
                  <CommentsList comments={oneQuestionComments} />
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {/* Divider */}
      {commentCounts.totalQuiz > 0 && (
        <Row className="my-4">
          <Col xs={12}>
            <div className="position-relative">
              <hr className="my-0" />
              <div
                className="position-absolute top-50 start-50 translate-middle bg-white px-3"
                style={{ color: '#999' }}
              >
                <small>
                  <i className="fa fa-chevron-down"></i>
                </small>
              </div>
            </div>
          </Col>
        </Row>
      )}

      {/* All Quiz Comments */}
      {commentCounts.totalQuiz > 0 && (
        <Row>
          <Col xs={12}>
            {/* Toggle Button */}
            <Button
              color="primary"
              outline
              onClick={toggleShowAll}
              className="w-100 fw-bold py-3 rounded-3 shadow-sm mb-3 d-flex align-items-center justify-content-center"
            >
              <i className={`fa fa-${showAll ? 'eye-slash' : 'eye'} me-2`}></i>
              {showAll ? 'Hide' : 'Show'} All Quiz Comments
              <Badge color="primary" className="ms-2" pill>
                {commentCounts.totalQuiz}
              </Badge>
            </Button>

            {/* Collapsible Content */}
            <Collapse isOpen={showAll}>
              <Card className="shadow-sm border-0 rounded-4">
                <CardBody className="p-3 p-md-4">
                  {/* Question Comments */}
                  {commentsByQuiz?.length > 0 && (
                    <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold mb-0">
                          <i className="fa fa-question-circle me-2 text-info"></i>
                          Comments on Other Questions
                        </h6>
                        <Badge color="info" pill>
                          {commentCounts.quizQuestions}
                        </Badge>
                      </div>

                      {isQuizQuestionsLoading ? (
                        <QBLoadingSM />
                      ) : (
                        <CommentsList comments={commentsByQuiz} showQuestionText />
                      )}
                    </div>
                  )}

                  {/* General Quiz Comments */}
                  {oneQuizComments?.length > 0 && (
                    <div>
                      {commentsByQuiz?.length > 0 && (
                        <hr className="my-4" />
                      )}

                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold mb-0">
                          <i className="fa fa-comment me-2 text-warning"></i>
                          General Quiz Comments
                        </h6>
                        <Badge color="warning" pill>
                          {commentCounts.quizGeneral}
                        </Badge>
                      </div>

                      {isQuizGeneralLoading ? (
                        <QBLoadingSM />
                      ) : (
                        <CommentsList comments={oneQuizComments} />
                      )}
                    </div>
                  )}
                </CardBody>
              </Card>
            </Collapse>
          </Col>
        </Row>
      )}

      {/* Empty State */}
      {commentCounts.question === 0 && commentCounts.totalQuiz === 0 && !isQuestionLoading && isQuizQuestionsLoading && (
        <Row className="mt-4">
          <Col xs={12}>
            <Card className="shadow-sm border-0 rounded-4">
              <CardBody className="text-center py-5">
                <i className="fa fa-comment-slash fa-3x text-muted mb-3"></i>
                <h5 className="text-muted mb-2">No Comments Yet</h5>
                <p className="text-muted mb-0">
                  Be the first to share your thoughts!
                </p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

// Separate CommentsList Component
const CommentsList = ({ comments, showQuestionText = false }) => {
  // Sort comments by date (newest first)
  const sortedComments = useMemo(() => {
    if (!comments) return [];
    return [...comments].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [comments]);

  if (!sortedComments.length) {
    return (
      <div className="text-center py-4 text-muted">
        <i className="fa fa-inbox fa-2x mb-2 d-block"></i>
        No comments available
      </div>
    );
  }

  return (
    <div className="comments-list">
      {sortedComments.map((comment, index) => (
        <div
          key={comment._id || `comment-${index}`}
          className="border rounded-3 shadow-sm bg-light p-3 mb-3"
          style={{
            transition: 'all 0.2s ease-in-out',
          }}
        >
          {/* Question Text (for quiz-wide comments) */}
          {showQuestionText && comment.question?.questionText && (
            <div
              className="mb-2 pb-2 border-bottom"
              style={{ borderColor: '#dee2e6' }}
            >
              <small className="text-muted d-block mb-1">
                <i className="fa fa-link me-1"></i>
                Question:
              </small>
              <small className="d-block fw-bold text-dark">
                {comment.question.questionText}
              </small>
            </div>
          )}

          {/* Comment Content */}
          <Comment comment={comment} />
        </div>
      ))}
    </div>
  );
};

export default QuestionComments;
