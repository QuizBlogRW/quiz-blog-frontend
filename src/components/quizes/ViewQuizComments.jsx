import React, { useEffect } from 'react'
import { Col, Row, CardTitle, Card, Alert } from 'reactstrap'
import { Link } from 'react-router-dom'
import QBLoadingSM from '../rLoading/QBLoadingSM'
import { getCommentsByQuiz } from '../../redux/slices/questionCommentsSlice'
import { getQuizComments } from '../../redux/slices/quizCommentsSlice'
import { useSelector, useDispatch } from 'react-redux'
import Comment from './review/questionComments/Comment'

const ViewQuizComments = ({ quizID }) => {

  // Redux
  const dispatch = useDispatch()
  const commentsByQuiz = useSelector(state => state.questionComments.commentsByQuiz)
  const quizComments = useSelector(state => state.quizComments.quizCmnts)

  // Lifecycle methods
  useEffect(() => {
    dispatch(getCommentsByQuiz(quizID))
    dispatch(getQuizComments(quizID))
  }, [dispatch, quizID])

  return (
    commentsByQuiz.isByQuizLoading ?
      <QBLoadingSM title='comments' /> :
      <Row>
        {commentsByQuiz && commentsByQuiz.length > 0 ?

          <Col sm={12} className="mt-2 comments-card">

            {
              <Card body>
                <CardTitle tag="h2" className="w-100 py-2 py-lg-4 text-center fw-bolder">
                  All comments for this quiz
                </CardTitle>

                {commentsByQuiz && commentsByQuiz.map((comment, i) =>
                  <div key={i} className='border border-secondary rounded m-1 p-2'>
                    <small className='text-uppercase fw-bolder py-2 mt-4'>
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

          <Alert color="danger" className="w-50 text-center mx-auto" style={{ border: '2px solid #157A6E' }}>
            No comments made yet!
          </Alert>
        }
      </Row>)
}

export default ViewQuizComments