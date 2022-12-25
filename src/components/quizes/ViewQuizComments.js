import React, { useEffect } from 'react'
import { Col, Row, CardTitle, Card, Alert } from 'reactstrap'
import SpinningBubbles from '../rLoading/SpinningBubbles'
import { connect } from 'react-redux'
import { getCommentsByQuiz } from '../../redux/questionComments/questionComments.actions'
import { getQuizComments } from '../../redux/quizComments/quizComments.actions'
import Comment from './review/questionComments/Comment'
import { Link } from 'react-router-dom'

const ViewQuizComments = ({ commentsByQuiz, getCommentsByQuiz, quizComments, getQuizComments, quizID }) => {

  // Lifecycle methods
  useEffect(() => {
    getCommentsByQuiz(quizID)
    getQuizComments(quizID)
  }, [getCommentsByQuiz, quizID, getQuizComments])

  return (
    commentsByQuiz.isByQuizLoading ?
      <SpinningBubbles title='comments' /> :
      <Row>
        {commentsByQuiz && commentsByQuiz.length > 0 ?

          <Col sm={12} className="mt-2 comments-card">

            {
              <Card body>
                <CardTitle tag="h2" className="w-100 py-2 py-lg-4 text-center font-weight-bolder">
                  All comments for this quiz
                </CardTitle>

                {commentsByQuiz && commentsByQuiz.map((comment, i) =>
                  <div key={i} className='border border-secondary rounded m-1 p-2'>
                    <small className='text-uppercase font-weight-bolder py-2 mt-4'>
                      <Link to={`/view-question/${comment.question._id}`}>
                        {comment.question.questionText}
                      </Link>
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
          </Col> :

          <Alert color="danger" className="w-100 text-center">
            No comments made yet!
          </Alert>
        }
      </Row>)
}

const mapStateToProps = state => ({
  commentsByQuiz: state.questionCommentsReducer.commentsByQuiz,
  quizComments: state.quizCommentsReducer.quizCmnts
})

export default connect(mapStateToProps, { getCommentsByQuiz, getQuizComments })(ViewQuizComments)