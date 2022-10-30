import React, { useEffect } from 'react'
import { Col, Row, CardTitle, Card } from 'reactstrap'
// import SpinningBubbles from '../../../rLoading/SpinningBubbles'
import { connect } from 'react-redux'
import { getQuizComments } from '../../../../redux/quizComments/quizComments.actions'
import Comment from './Comment'
import AddComment from './AddComment'

const QuizComments = ({ comments, getQuizComments, currentUser, quizID }) => {

  const qComments = comments.quizCmnts

  // Lifecycle methods
  useEffect(() => {
    getQuizComments(quizID)
  }, [getQuizComments, quizID])

  return (
    <Row className="mt-5">

      <Col sm={12} className="mt-2 comments-card">
        <Card body>
          <AddComment quiz={quizID} currentUser={currentUser} />
        </Card>
      </Col>

      {qComments.length > 0 &&
        <Col sm={12} className="mt-2 comments-card">
          <Card body>
            <CardTitle tag="h5" className="w-100 text-uppercase text-center font-weight-bolder">
              Comments on this quiz
            </CardTitle>
            {qComments.map((comment, i) => (<Comment comment={comment} key={i} />))}
          </Card>
        </Col>}
    </Row>
  )
}

const mapStateToProps = state => ({ comments: state.quizCommentsReducer })

export default connect(mapStateToProps, { getQuizComments })(QuizComments)