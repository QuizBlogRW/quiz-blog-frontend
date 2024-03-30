import React, { useState, useEffect, useContext } from 'react'
import { Col, Row, CardTitle, Card, Button } from 'reactstrap'
import QBLoadingSM from '../../../rLoading/QBLoadingSM'
import { getCommentsByQuiz, getQuestionComments } from '../../../../redux/slices/questionCommentsSlice'
import { getQuizComments } from '../../../../redux/slices/quizCommentsSlice'
import { useSelector, useDispatch } from 'react-redux'
import Comment from './Comment'
import AddComment from './AddComment'
import { currentUserContext } from '../../../../appContexts'

const QuestionComments = ({ questionID, quizID, fromSingleQuestion }) => {

  // Redux
  const dispatch = useDispatch()
  const commentsByQuiz = useSelector(state => state.questionComments.commentsByQuiz)
  const qComments = useSelector(state => state.questionComments.questionComments)
  const quizComments = useSelector(state => state.quizComments.quizCmnts)

  const currentUser = useContext(currentUserContext)

  // Lifecycle methods
  useEffect(() => {
    dispatch(getCommentsByQuiz(quizID))
    dispatch(getQuestionComments(questionID))
    dispatch(getQuizComments(quizID))
  }, [dispatch, questionID, quizID])

  const [showAll, setShowAll] = useState(false);

  return (
    <>
      <Row className="mt-5">

        <Col sm={12} className="mt-2 comments-card">
          <Card body>
            <AddComment question={questionID}
              quiz={quizID} currentUser={currentUser} fromSingleQuestion={fromSingleQuestion} />
          </Card>
        </Col>

        {commentsByQuiz.isLoading ?
          <QBLoadingSM title='comments' /> :
          <>
            {qComments && qComments.length > 0 &&
              <Col sm={12} className="mt-2 comments-card">
                <Card body>
                  <CardTitle tag="h2" className="w-100 py-2 py-lg-4 text-center fw-bolder">
                    Comments on this question
                  </CardTitle>

                  {qComments && qComments.map((comment, i) =>
                    <div key={i} className='border border-secondary rounded m-1 p-2'>
                      <Comment comment={comment} key={i} uRole={currentUser && currentUser.role} />
                    </div>
                  )}
                </Card>
              </Col>}
          </>}
      </Row>
      <hr />

      {commentsByQuiz.isByQuizLoading ?
        <QBLoadingSM title='comments' /> :
        <Row>
          {commentsByQuiz && commentsByQuiz.length > 0 &&
            <Col sm={12} className="mt-2 comments-card">

              {showAll &&
                <Card body>
                  <CardTitle tag="h2" className="w-100 py-2 py-lg-4 text-center fw-bolder">
                    All comments for this quiz
                  </CardTitle>

                  {commentsByQuiz && commentsByQuiz.map((comment, i) =>
                    <div key={i} className='border border-secondary rounded m-1 p-2'>
                      <small className='text-uppercase fw-bolder py-2 mt-4'>
                        {comment.question.questionText}
                      </small>
                      <Comment comment={comment} uRole={currentUser && currentUser.role} />
                    </div>
                  )}

                  {quizComments && quizComments.map((qzC, index) =>
                    <div key={index} className='border border-secondary rounded m-1 p-2'>
                      <Comment comment={qzC} uRole={currentUser && currentUser.role} />
                    </div>
                  )}
                </Card>}

              <Button color="warning" outline className='mt-2 mx-auto d-block text-success text-uppercase fw-bolder'
                onClick={() => setShowAll(!showAll)}>
                {showAll ? 'Hide' : 'Show'} all comments for this quiz
              </Button>
            </Col>}
        </Row>
      }
    </>
  )
}

export default QuestionComments