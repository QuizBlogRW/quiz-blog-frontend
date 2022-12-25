import React, { useState, useEffect } from 'react'
import { Col, Row, CardTitle, Card, Button } from 'reactstrap'
import SpinningBubbles from '../../../rLoading/SpinningBubbles'
import { connect } from 'react-redux'
import { getCommentsByQuiz, getQuestionComments } from '../../../../redux/questionComments/questionComments.actions'
import { getQuizComments } from '../../../../redux/quizComments/quizComments.actions'
import Comment from './Comment'
import AddComment from './AddComment'

const QuestionComments = ({ commentsByQuiz, getCommentsByQuiz, qComments, getQuestionComments, quizComments, getQuizComments, currentUser, questionID, quizID, fromSingleQuestion }) => {

  // Lifecycle methods
  useEffect(() => {
    getQuestionComments(questionID)
    getCommentsByQuiz(quizID)
    getQuizComments(quizID)
  }, [getQuestionComments, questionID, getCommentsByQuiz, quizID, getQuizComments])

  const [showAll, setShowAll] = useState(false);

  return (
    <>
      <Row className="mt-5">

        <Col sm={12} className="mt-2 comments-card">
          <Card body>
            <AddComment question={questionID}
              quiz={quizID} currentUser={currentUser} fromSingleQuestion={fromSingleQuestion}/>
          </Card>
        </Col>

        {commentsByQuiz.isLoading ?
          <SpinningBubbles title='comments' /> :
          <>
            {qComments && qComments.length > 0 &&
              <Col sm={12} className="mt-2 comments-card">
                <Card body>
                  <CardTitle tag="h2" className="w-100 py-2 py-lg-4 text-center font-weight-bolder">
                    Comments on this question
                  </CardTitle>

                  {qComments && qComments.map((comment, i) =>
                    <div key={i} className='border border-secondary rounded m-1 p-2'>
                      <Comment comment={comment} key={i} />
                    </div>
                  )}
                </Card>
              </Col>}
          </>}
      </Row>
      <hr />

      {commentsByQuiz.isByQuizLoading ?
        <SpinningBubbles title='comments' /> :
        <Row>
          {commentsByQuiz && commentsByQuiz.length > 0 &&
            <Col sm={12} className="mt-2 comments-card">

              {showAll &&
                <Card body>
                  <CardTitle tag="h2" className="w-100 py-2 py-lg-4 text-center font-weight-bolder">
                    All comments for this quiz
                  </CardTitle>

                  {commentsByQuiz && commentsByQuiz.map((comment, i) =>
                    <div key={i} className='border border-secondary rounded m-1 p-2'>
                      <small className='text-uppercase font-weight-bolder py-2 mt-4'>
                        {comment.question.questionText}
                      </small>
                      <Comment comment={comment} />
                    </div>
                  )}

                  {quizComments && quizComments.map((qzC, index) =>
                    <div key={index} className='border border-secondary rounded m-1 p-2'>
                      <Comment comment={qzC} />
                    </div>
                  )}
                </Card>}

              <Button color="warning" outline className='mt-2 mx-auto d-block text-success text-uppercase font-weight-bolder'
                onClick={() => setShowAll(!showAll)}>
                {showAll ? 'Hide' : 'Show'} all comments for this quiz
              </Button>
            </Col>}
        </Row>
      }
    </>
  )
}

const mapStateToProps = state => ({
  commentsByQuiz: state.questionCommentsReducer.commentsByQuiz,
  qComments: state.questionCommentsReducer.questionComments,
  quizComments: state.quizCommentsReducer.quizCmnts
})

export default connect(mapStateToProps, { getCommentsByQuiz, getQuestionComments, getQuizComments })(QuestionComments)