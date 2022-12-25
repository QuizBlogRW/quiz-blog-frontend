import React, { useEffect } from 'react'
import { Row, ListGroup, ListGroupItem, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import { Link, useParams, useHistory } from 'react-router-dom'
import ReactLoading from "react-loading"
import LoginModal from '../auth/LoginModal'
import Webmaster from '../webmaster/Webmaster'
import { connect } from 'react-redux'
import { getOneQuestion, deleteQuestion } from '../../redux/questions/questions.actions'
import trash from '../../images/trash.svg'
import EditIcon from '../../images/edit.svg'
import ChangeQuizModal from './ChangeQuizModal'
import SpinningBubbles from '../rLoading/SpinningBubbles'
import QuestionComments from '../quizes/review/questionComments/QuestionComments'

const SingleQuestion = ({ auth, quest, getOneQuestion, deleteQuestion }) => {

    // Access route parameters
    const { questionId } = useParams()

    // Lifecycle methods
    useEffect(() => {
        getOneQuestion(questionId)
    }, [getOneQuestion, questionId])

    const { push } = useHistory()

    const deleteQn = () => {
        deleteQuestion(questionId)
        push('/webmaster')
    }

    const thisQuestion = quest && quest.oneQuestion
    const thisQnCat = thisQuestion && thisQuestion.category
    const thisQnQZ = thisQuestion && thisQuestion.quiz
    const thisQnCrt = thisQuestion && thisQuestion.created_by

    return (
        auth.isAuthenticated ?

            auth.user.role !== 'Visitor' ?

                quest.isLoading ?

                    <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
                        <ReactLoading type="cylon" color="#33FFFC" />&nbsp;&nbsp;&nbsp;&nbsp; <br />
                    </div> :

                    thisQuestion ?
                        <div className="mt-2 mt-lg-5 mx-3 mx-lg-5 single-category view-question" key={thisQuestion && thisQuestion._id}>

                            <Row className="mb-0 mb-lg-3 mx-0">
                                <Breadcrumb>
                                    <BreadcrumbItem>
                                        <Link to={`/category/${thisQnCat && thisQnCat._id}`}>{thisQnCat && thisQnCat.title}</Link>
                                    </BreadcrumbItem>
                                    <BreadcrumbItem>
                                        <Link to={`/view-quiz/${thisQnQZ && thisQnQZ.slug}`}>{thisQnQZ && thisQnQZ.title}</Link>
                                    </BreadcrumbItem>

                                    <BreadcrumbItem active>View Question</BreadcrumbItem>
                                </Breadcrumb>
                            </Row>

                            <Row className="m-2 m-lg-4 d-block text-primary">

                                <div className="d-lg-flex my-3 justify-content-between align-items-baseline title-actions text-uppercase">
                                    <h4 className="mb-4">{thisQuestion && thisQuestion.questionText}</h4>

                                    {
                                        auth.user.role === 'Admin' || (thisQnCrt && auth.user._id === thisQnCrt._id) ?

                                            <div className="actions d-flex align-items-center">
                                                <ChangeQuizModal
                                                    auth={auth}
                                                    questionID={thisQuestion && thisQuestion._id}
                                                    questionCatID={thisQnCat && thisQnCat._id}
                                                    quizID={thisQnQZ && thisQnQZ._id} />
                                                <img src={trash} alt="" width="16" height="16" className="mx-2" onClick={deleteQn} />

                                                <Link to={`/edit-question/${thisQuestion && thisQuestion._id}`} className="text-secondary">
                                                    <img src={EditIcon} alt="" width="16" height="16" />
                                                </Link>
                                            </div> : null}
                                </div>

                                {thisQuestion.question_image &&
                                    <div className="my-3 mx-sm-5 px-sm-5 d-flex justify-content-center align-items-center">
                                        <img className="w-100 mt-2 mt-lg-0 mx-sm-5 px-sm-5" src={thisQuestion && thisQuestion.question_image} alt="Question Illustration" />
                                    </div>}

                                <ListGroup>
                                    {thisQuestion && thisQuestion.answerOptions.map((answerOpt, i) => (

                                        <span key={answerOpt._id}>
                                            <ListGroupItem color={answerOpt.isCorrect ? 'success' : ''} key={answerOpt._id} className="mt-4 font-weight-bold">
                                                {i + 1}. {answerOpt.answerText}
                                            </ListGroupItem>

                                            <div className='border rounded mt-1 p-2'>
                                                <small className="text-dark">
                                                    {answerOpt.explanations}
                                                </small>
                                            </div>
                                        </span>)
                                    )}
                                </ListGroup>

                            </Row>

                            <Row className='d-flex flex-column my-4'>
                                <QuestionComments questionID={thisQuestion._id} quizID={thisQnQZ._id} currentUser={auth && auth.user} fromSingleQuestion={true} />
                            </Row>
                        </div> :

                        <Row className="m-3 p-3 text-danger d-flex justify-content-center align-items-center">
                            <Breadcrumb>
                                <BreadcrumbItem>
                                    Question unavailable!
                                </BreadcrumbItem>
                            </Breadcrumb>
                        </Row> :

                <Webmaster auth={auth} /> :
            // If not authenticated or loading
            <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
                {
                    auth.isLoading ?
                        <SpinningBubbles /> :
                        <LoginModal
                            textContent={'Login first'}
                            textColor={'text-danger font-weight-bolder my-5 border rounded'}
                            isAuthenticated={auth.isAuthenticated} />
                }
            </div>
    )
}

const mapStateToProps = state => ({
    quest: state.questionsReducer
})

export default connect(mapStateToProps, { getOneQuestion, deleteQuestion })(SingleQuestion)