import React, { useEffect } from 'react'
import { Col, Row, TabPane, CardTitle, Card } from 'reactstrap'
import SpinningBubbles from '../../../rLoading/SpinningBubbles'
import { connect } from 'react-redux'
import { getComments } from '../../../../redux/questionComments/questionComments.actions'
import { getAllComments } from '../../../../redux/quizComments/quizComments.actions'
import Comment from './Comment'

const ViewComments = ({ comments, allQuizComments, getComments, getAllComments }) => {

    const allCmts = comments.allComments
    const allQuizCmts = allQuizComments.allComments

    // Lifecycle methods
    useEffect(() => {
        getComments()
        getAllComments()
    }, [getComments, getAllComments])

    return (

        <TabPane tabId="9">

            {comments.isLoading ?
                <SpinningBubbles title='comments' /> :

                <Row>
                    {allCmts.length > 0 &&
                        <Col sm={12} className="mt-2 comments-card">
                            <Card body>
                                {allCmts.map((comment, i) => (
                                    <div className="my-3" key={i}>

                                        <CardTitle tag="p" className="w-100 text-uppercase text-center font-weight-bolder d-flex bg-info text-white p-2">
                                            {comment.quiz && comment.quiz.title}
                                        </CardTitle>

                                        <small className='text-uppercase font-weight-bolder mb-4'>
                                            {comment.question && comment.question.questionText}
                                        </small>

                                        <Comment comment={comment} />
                                    </div>
                                ))}

                                {allQuizCmts.length > 0 && allQuizCmts.map((comment, i) => (
                                    <div className="my-3" key={i}>
                                        <CardTitle tag="p" className="w-100 text-uppercase text-center font-weight-bolder d-flex bg-info text-white p-2">
                                            {comment.quiz && comment.quiz.title}
                                        </CardTitle>

                                        <Comment comment={comment} />

                                    </div>
                                ))}
                            </Card>
                        </Col>}
                </Row>}

        </TabPane>
    )
}

const mapStateToProps = state => ({ 
    comments: state.questionCommentsReducer,
    allQuizComments: state.quizCommentsReducer
})

export default connect(mapStateToProps, { getComments, getAllComments })(ViewComments)