import React, { useEffect, useContext } from 'react'
import { Container, Col, Row, Card, Button, CardTitle, CardText, Spinner } from 'reactstrap'
import { Link, useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { getOneChQuiz } from '../../../redux/challenges/challengeQuizzes/challengeQuizzes.actions'
import LoginModal from '../../auth/LoginModal'
import SpinningBubbles from '../../rLoading/SpinningBubbles'
import { authContext } from '../../../appContexts'

const ViewChallenge = ({ chQuiz, getOneChQuiz }) => {

    const auth = useContext(authContext)

    // Access route parameters
    const { challengeId } = useParams()

    useEffect(() => {
        getOneChQuiz(challengeId)
    }, [getOneChQuiz, challengeId])

    const { _id, title, description, category, duration, questions, createdAt } = chQuiz.oneChQuiz

    let date = new Date(createdAt)

    return (
        chQuiz.isLoading ?

            <>
                <div className="py-3 d-flex justify-content-center align-items-center">
                    <Spinner color="warning" style={{ width: '10rem', height: '10rem' }} />
                </div>
                <div className="py-3 d-flex justify-content-center align-items-center">
                    <h4 className="blink_load">Loading ...</h4>
                </div>
                <div className="py-3 d-flex justify-content-center align-items-center">
                    <Spinner type="grow" color="success" style={{ width: '10rem', height: '10rem' }} />
                </div>
            </> :

            questions && questions.length > 0 ?

                <Container className="main mx-auto d-flex flex-column justify-content-center rounded border border-primary my-5 py-4 w-80">

                    <div className="question-view p-2">
                        <Row>
                            <Col>

                                <Card body className='question-section text-center my-2 mx-auto w-75'>
                                    <CardTitle tag="h5" className='question-count text-uppercase text-center text-secondary font-weight-bold'>
                                        {title && title}
                                    </CardTitle>

                                    <CardText>{description && description}</CardText>

                                    <small className='text-center text-info font-weight-bolder'>{date && date.toDateString()}</small>

                                    {!auth.isAuthenticated ?

                                        // If not authenticated or loading
                                        <div className="d-flex justify-content-center align-items-center text-danger">
                                            {
                                                auth.isLoading ?
                                                    <SpinningBubbles /> :
                                                    <LoginModal
                                                        textContent={'Login first to take the challenge'}
                                                        textColor={'text-danger font-weight-bolder my-5 border rounded'} />
                                            }
                                        </div> :

                                        <div className='answer d-flex justify-content-center mx-auto mt-2 w-lg-50'>
                                            <Link to={`/take-challenge/${_id && _id}`}>
                                                <Button className="btn btn-outline-primary mt-3">
                                                    Take Challenge
                                                </Button>
                                            </Link>

                                            <Button color="success" className="mt-3 share-btn mx-1 mx-md-3">
                                                <i className="fa fa-whatsapp"></i>&nbsp;
                                                <a className="text-white" href={`https://api.whatsapp.com/send?phone=whatsappphonenumber&text=Take this ${title && title} challenge on Quiz-Blog
                        \nhttps://www.quizblog.rw/view-challenge/${_id && _id}`}>Share</a>
                                            </Button>

                                            <Link to={'/'}>
                                                <Button className="btn btn-outline-primary mt-3">
                                                    ⬅ Back
                                                </Button>
                                            </Link>
                                        </div>

                                    }
                                    <small className="mt-3 text-info">
                                        ~ {category && category.title} | {questions && questions.length} questions | {duration && Math.ceil(duration / 60)} min. ~
                                    </small>

                                </Card>

                            </Col>
                        </Row>
                    </div>

                </Container> :

                <div className="pt-5 d-flex justify-content-center align-items-center">
                    <h4>This challenge is unavailable now!</h4>
                    <Link to={'/'}>
                        <Button className="btn btn-outline-primary mt-3">
                            Go back
                        </Button>
                    </Link>
                </div>)
}

const mapStateToProps = state => ({
    chQuiz: state.challengeQuizesReducer
})

export default connect(mapStateToProps, { getOneChQuiz })(ViewChallenge)