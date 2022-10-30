import React, { useState, useEffect } from 'react'
import { Row, Col, TabPane, ListGroup, ListGroupItem, Alert } from 'reactstrap'
import SpinningBubbles from '../rLoading/SpinningBubbles'
import { connect } from 'react-redux'
import SearchInput from '../SearchInput'
import { setQuestions, setQuestionsLoading } from '../../redux/questions/questions.actions'
import { setQuizes, deleteQuiz } from '../../redux/quizes/quizes.actions'
import QuizToast from './QuizToast'

const QuizesTabPane = ({ auth, categories, quizes, questionsData, setQuizes, setQuestions, deleteQuiz }) => {

    const [searchKey, setSearchKey] = useState('')
    const [searchKeyQ, setSearchKeyQ] = useState('')
    const currentUser = auth.user

    // Lifecycle methods
    useEffect(() => {
        setQuizes()
        setQuestions()
    }, [setQuestions, setQuizes])


    // Quizzes to use
    const allQuizzes = quizes && quizes.allQuizes
    const creatorQuizzes = quizes.allQuizes && quizes.allQuizes
        .filter(quiz => quiz.created_by && quiz.created_by._id === currentUser._id)
    const quizzesToUse = currentUser.role === 'Admin' ? allQuizzes : creatorQuizzes

    // Questions to use
    const allQuestions = questionsData && questionsData
    const creatorQuestions = questionsData && questionsData
        .filter(question => question.created_by && question.created_by._id === currentUser._id)
    const questionsToUse = currentUser.role === 'Admin' ? allQuestions : creatorQuestions

    return (

        <TabPane tabId="2">

            {quizes.isLoading ?
            
                <SpinningBubbles title='quizes' /> :

                quizzesToUse && quizzesToUse.length > 0 ?
                    <>
                        <Row className="mt-0">
                            <Col sm="6">
                                <SearchInput setSearchKey={setSearchKey} placeholder=" Search quizes here ...  " />
                            </Col>
                            <Col sm="6">
                                <SearchInput setSearchKey={setSearchKeyQ} placeholder=" Search questions here ...  " />
                            </Col>
                        </Row>

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

                        {/* Search quizes */}
                        <Row>
                            {quizzesToUse && quizzesToUse
                                .filter(quiz => {

                                    if (searchKey === "") {
                                        return quiz
                                    } else if (quiz.title.toLowerCase().includes(searchKey.toLowerCase())) {
                                        return quiz
                                    }
                                    return null
                                })
                                .map(quiz => <QuizToast
                                    key={quiz._id}
                                    auth={auth}
                                    categories={categories}
                                    quiz={quiz && quiz}
                                    deleteQuiz={deleteQuiz}
                                    currentUser={currentUser} />)}
                        </Row>
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
    questionsData: state.questionsReducer.questionsData
})

export default connect(mapStateToProps, { setQuizes, setQuestions, setQuestionsLoading, deleteQuiz })(QuizesTabPane)