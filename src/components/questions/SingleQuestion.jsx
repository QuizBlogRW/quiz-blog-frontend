import React, { useEffect, useContext } from 'react'
import { Row, ListGroup, ListGroupItem, Breadcrumb, BreadcrumbItem, Button } from 'reactstrap'
import { Link, useParams } from 'react-router-dom'
import Dashboard from '../dashboard/Dashboard'
import { getOneQuestion, deleteQuestion } from '../../redux/slices/questionsSlice'
import { useSelector, useDispatch } from 'react-redux'
import EditIcon from '../../images/edit.svg'
import ChangeQuizModal from './ChangeQuizModal'
import QBLoadingSM from '../rLoading/QBLoadingSM'
import QuestionComments from '../quizes/review/questionComments/QuestionComments'
import { authContext, logRegContext } from '../../appContexts'
import DeleteModal from '../../utils/DeleteModal'

const SingleQuestion = () => {

    const quest = useSelector(state => state.questions)
    const dispatch = useDispatch()

    // Context
    const auth = useContext(authContext)
    const { toggleL } = useContext(logRegContext)

    // Access route parameters
    const { questionId } = useParams()

    // Lifecycle methods
    useEffect(() => {
        dispatch(getOneQuestion(questionId))
    }, [dispatch, questionId])

    const thisQuestion = quest && quest.oneQuestion
    const thisQnCat = thisQuestion && thisQuestion.category
    const thisQnQZ = thisQuestion && thisQuestion.quiz
    const thisQnCrt = thisQuestion && thisQuestion.created_by

    return (
        auth.isAuthenticated ?

            auth.user.role !== 'Visitor' ?

                quest.isLoading ?

                    <QBLoadingSM /> :

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
                                        auth.user.role === 'SuperAdmin' || auth.user.role === 'Admin' || (thisQnCrt && auth.user._id === thisQnCrt._id) ?

                                            <div className="actions d-flex align-items-center">
                                                <ChangeQuizModal
                                                    questionID={thisQuestion && thisQuestion._id}
                                                    questionCatID={thisQnCat && thisQnCat._id}
                                                    oldQuizID={thisQnQZ && thisQnQZ._id} />
                                                <DeleteModal deleteFnName="deleteQuestion" deleteFn={deleteQuestion} delID={thisQuestion && thisQuestion._id} delTitle={thisQuestion && thisQuestion.questionText} />

                                                <Link to={`/edit-question/${thisQuestion && thisQuestion._id}`} className="text-secondary">
                                                    <img src={EditIcon} alt="" width="16" height="16" className="mx-2" />
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
                                            <ListGroupItem color={answerOpt.isCorrect ? 'success' : ''} key={answerOpt._id} className="mt-4 fw-bolder">
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

                <Dashboard /> :
            // If not authenticated or loading
            <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
                {
                    auth.isLoading ?
                        <QBLoadingSM /> :
                        <Button color="link" className="fw-bolder my-5 border rounded" onClick={toggleL} style={{ backgroundColor: "#ffc107", color: "#157A6E", fontSize: "1.5vw", boxShadow: "-2px 2px 1px 2px #157A6E", border: "2px solid #157A6E" }}>
                            Login first
                        </Button>
                }
            </div>
    )
}

export default SingleQuestion