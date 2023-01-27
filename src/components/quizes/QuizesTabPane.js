import React, { useState, useEffect, useContext } from 'react'
import { Row, Col, TabPane, ListGroup, ListGroupItem, Alert } from 'reactstrap'
import SpinningBubbles from '../rLoading/SpinningBubbles'
import ReactLoading from "react-loading";
import { connect } from 'react-redux'
import { setQuestions } from '../../redux/questions/questions.actions'
import { setPaginatedQuizes, setAllNoLimitQuizes, deleteQuiz } from '../../redux/quizes/quizes.actions'
import QuizToast from './QuizToast'
import SearchInput from '../SearchInput'
import Pagination from '../webmaster/Pagination'
import PageOf from '../webmaster/PageOf'
import { categoriesContext, currentUserContext } from '../../appContexts'

const QuizesTabPane = ({ quizes, questions, allNoLimit, allNoLimitLoading, setPaginatedQuizes, setAllNoLimitQuizes, setQuestions, deleteQuiz }) => {

    // context
    const currentUser = useContext(currentUserContext)
    const categories = useContext(categoriesContext)

    const [pageNo, setPageNo] = useState(1)
    const [numberOfPages, setNumberOfPages] = useState(0)
    const totPages = quizes && quizes.totalPages
    const [searchKey, setSearchKey] = useState('')
    const [searchKeyQ, setSearchKeyQ] = useState('')
    const uRole = currentUser && currentUser.role

    // Lifecycle methods
    useEffect(() => {
        setPaginatedQuizes(pageNo)
        setNumberOfPages(totPages)
        setQuestions()
        setAllNoLimitQuizes()
    }, [setQuestions, setPaginatedQuizes, setAllNoLimitQuizes, pageNo, totPages])

    // Quizzes to use - CREATED BY ROUTE
    const allQuizzes = quizes && quizes.paginatedQuizes
    const creatorQuizzes = quizes.paginatedQuizes && quizes.paginatedQuizes
        .filter(quiz => quiz.created_by && quiz.created_by._id === currentUser._id)
    const quizzesToUse = currentUser.role === 'Admin' || currentUser.role === 'SuperAdmin' ? allQuizzes : creatorQuizzes

    // Questions to use
    const allQuestions = questions && questions.questionsData
    const creatorQuestions = questions && questions.questionsData
        .filter(question => question.created_by && question.created_by._id === currentUser._id)
    const questionsToUse = currentUser.role === 'Admin' || currentUser.role === 'SuperAdmin' ? allQuestions : creatorQuestions

    return (

        <TabPane tabId="2">

            {quizes.isPaginatedLoading ?

                <SpinningBubbles title='paginated quizes' /> :

                quizzesToUse && quizzesToUse.length > 0 ?
                    <>
                        {(uRole === 'Admin' || uRole === 'SuperAdmin') ?
                            <PageOf pageNo={pageNo} numberOfPages={numberOfPages} /> : null}

                        {
                            // SEARCH BARS
                            allNoLimitLoading || questions.isLoading ?
                                <div className="p-1 m-1 d-flex justify-content-center align-items-center">
                                    <ReactLoading type="bubbles" color="#33FFFC" /> </div> :
                                <Row className="mt-0">
                                    <Col sm="6">
                                        <SearchInput setSearchKey={setSearchKey} placeholder=" Search quizes here ...  " />
                                    </Col>
                                    <Col sm="6">
                                        <SearchInput setSearchKey={setSearchKeyQ} placeholder=" Search questions here ...  " />
                                    </Col>
                                </Row>
                        }

                        {/* Search questions */}
                        <Row>
                            <ListGroup>
                                {questionsToUse && questionsToUse
                                    .filter(question => {
                                        if (searchKeyQ === "") {
                                            return null
                                        } else if (question.questionText.toLowerCase().includes(searchKeyQ.toLowerCase())) {
                                            return question
                                        }
                                        return null
                                    })
                                    .map(question => (
                                        <ListGroupItem key={question._id} tag="a" href={`/view-question/${question._id}`}>
                                            {question.questionText}
                                        </ListGroupItem>
                                    ))}

                            </ListGroup>
                        </Row>

                        {/* SEARCH QUIZES */}
                        <Row>
                            {allNoLimit && allNoLimit
                                .filter(quiz => {

                                    if (searchKey === "") {
                                        return null
                                    } else if (quiz.title.toLowerCase().includes(searchKey.toLowerCase())) {
                                        return quiz
                                    }
                                    return null
                                })
                                .map(quiz => <QuizToast
                                    fromSearch={true}
                                    key={quiz._id}
                                    categories={categories}
                                    quiz={quiz && quiz}
                                    deleteQuiz={deleteQuiz}
                                    currentUser={currentUser} />)}
                        </Row>

                        {/* LIMITED QUIZZES */}
                        <Row>
                            {quizzesToUse && quizzesToUse
                                .map(quiz => <QuizToast
                                    key={quiz._id}
                                    categories={categories}
                                    quiz={quiz && quiz}
                                    deleteQuiz={deleteQuiz}
                                    currentUser={currentUser} />)}
                        </Row>

                        {/* PAGINATION */}
                        {uRole !== 'Visitor' ?
                            <>
                                <Pagination pageNo={pageNo} setPageNo={setPageNo} numberOfPages={numberOfPages} />
                            </> : null}
                    </> :
                    <Alert color="danger" className="w-100 text-center">
                        You have not created any quiz yet!
                    </Alert>
            }
        </TabPane>
    )
}

const mapStateToProps = state => ({
    quizes: state.quizesReducer,
    questions: state.questionsReducer,
    allNoLimit: state.quizesReducer.allQuizesNoLimit,
    allNoLimitLoading: state.quizesReducer.isNoLimitLoading,
})

export default connect(mapStateToProps, { setPaginatedQuizes, setAllNoLimitQuizes, setQuestions, deleteQuiz })(QuizesTabPane)