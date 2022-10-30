import React, { useEffect } from 'react'
import { Col, Row, TabPane, CardTitle, Card } from 'reactstrap'
import SpinningBubbles from '../../../rLoading/SpinningBubbles'
import { connect } from 'react-redux'
import { getComments } from '../../../../redux/quizComments/quizComments.actions'
import Comment from './Comment'

const ViewComments = ({ comments, getComments }) => {

    const allCmts = comments.allComments

    // Lifecycle methods
    useEffect(() => {
        getComments()
    }, [getComments])

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
                                        <CardTitle tag="small" className="w-100 text-uppercase text-center font-weight-bolder d-flex bg-info text-white p-2">
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

const mapStateToProps = state => ({ comments: state.quizCommentsReducer })

export default connect(mapStateToProps, { getComments })(ViewComments)