import { useState, useEffect } from 'react';
import { Col, Row, CardTitle, Card, Button } from 'reactstrap';

import { getCommentsByQuiz, getOneQuestionComments } from '@/redux/slices/questionsCommentsSlice';
import { getOneQuizComments } from '@/redux/slices/quizzesCommentsSlice';
import { useSelector, useDispatch } from 'react-redux';

import Comment from '../../../dashboard/comments/Comment';
import AddComment from './AddComment';

const QuestionComments = ({ questionID, quizID, fromSingleQuestion }) => {

  const dispatch = useDispatch();
  const { commentsByQuiz, oneQuestionComments } = useSelector(state => state.questionsComments);
  const { oneQuizComments } = useSelector(state => state.quizzesComments);

  useEffect(() => {
    dispatch(getCommentsByQuiz(quizID));
    dispatch(getOneQuestionComments(questionID));
    dispatch(getOneQuizComments(quizID));
  }, [dispatch, questionID, quizID]);

  const [showAll, setShowAll] = useState(false);

  return (
    <>
      <Row className="mt-4">

        {/* Add Comment */}
        <Col sm={12} className="mt-3">
          <Card body className="shadow-sm rounded-4 p-3 p-md-4">
            <AddComment question={questionID} quiz={quizID} fromSingleQuestion={fromSingleQuestion} />
          </Card>
        </Col>

        {/* Comments on this question */}
        {oneQuestionComments?.length > 0 && (
          <Col sm={12} className="mt-4">
            <Card body className="shadow-sm rounded-4 p-3 p-md-4">
              <CardTitle
                tag="h4"
                className="text-center fw-bold mb-4 text-uppercase text-dark"
                style={{ letterSpacing: '.5px' }}
              >
                Comments on this question
              </CardTitle>
              <CommentsList comments={oneQuestionComments} />
            </Card>
          </Col>
        )}
      </Row>

      <hr className="my-5" />

      {/* All quiz comments */}
      <Row>
        {commentsByQuiz?.length > 0 && (
          <Col sm={12} className="mt-3">
            {showAll && (
              <Card body className="shadow-sm rounded-4 p-3 p-md-4">
                <CardTitle
                  tag="h4"
                  className="text-center fw-bold mb-4 text-uppercase text-dark"
                  style={{ letterSpacing: '.5px' }}
                >
                  All comments for this quiz
                </CardTitle>

                <CommentsList comments={commentsByQuiz} showQuestionText />
                <CommentsList comments={oneQuizComments} />
              </Card>
            )}

            <Button
              color="warning"
              outline
              onClick={() => setShowAll(!showAll)}
              className="fw-bold mt-3 mx-auto d-block px-4 py-2 text-uppercase rounded-3 shadow-sm"
              style={{ fontSize: '.9rem' }}
            >
              {showAll ? 'Hide' : 'Show'} all comments for this quiz
            </Button>
          </Col>
        )}
      </Row>
    </>
  );
};


const CommentsList = ({ comments, showQuestionText }) => {

  const sorted = [...comments].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <>
      {sorted.map((comment, i) => (
        <div
          key={i}
          className="border border-secondary rounded-3 shadow-sm bg-light p-3 mb-3"
        >
          {/* Optional question text */}
          {showQuestionText && (
            <small className="d-block text-uppercase fw-bold mb-2 text-dark">
              {comment.question.questionText}
            </small>
          )}

          {/* Existing Comment component */}
          <Comment comment={comment} />
        </div>
      ))}
    </>
  );
};

export default QuestionComments;
