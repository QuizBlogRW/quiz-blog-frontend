import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Row, Col, TabPane, ListGroup, ListGroupItem, Alert } from 'reactstrap'
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM'
import { getQuestions } from '@/redux/slices/questionsSlice'
import { getLimitedQuizzes, getQuizzes } from '@/redux/slices/quizzesSlice'
import QuizToast from './QuizToast'
import SearchInput from '@/utils/SearchInput'
import Pagination from '@/components/dashboard/utils/Pagination'
import PageOf from '@/components/dashboard/utils/PageOf'

const QuizzesTabPane = () => {

    const { user } = useSelector(state => state.auth)
    const categories = useSelector(state => state.categories)

    // Redux
    const dispatch = useDispatch()
    const { isLoading, loadingLimited, quizzes, limitedQuizzes, totalPages } = useSelector(state => state.quizzes)
    const questions = useSelector(state => state.questions)

    const [pageNo, setPageNo] = useState(1)
    const [numberOfPages, setNumberOfPages] = useState(0)
    const [searchKey, setSearchKey] = useState('')
    const [searchKeyQ, setSearchKeyQ] = useState('')

    // Lifecycle methods
    useEffect(() => {
        dispatch(getQuizzes())
        dispatch(getLimitedQuizzes({ pageNo }))
        dispatch(getQuestions())
    }, [dispatch, pageNo])

    useEffect(() => {
        setNumberOfPages(totalPages)
    }, [totalPages])

    // Quizzes to use - CREATED BY ROUTE
    const creatorQuizzes = limitedQuizzes?.filter(quiz => quiz.created_by && quiz.created_by._id === user._id)
    const quizzesToUse = user.role === 'Admin' || user.role === 'SuperAdmin' ? limitedQuizzes : creatorQuizzes

    // Questions to use
    const allQuestions = questions && questions.questionsData
    const creatorQuestions = questions && questions.questionsData?.filter(question => question.created_by && question.created_by._id === user._id)
    const questionsToUse = user.role === 'Admin' || user.role === 'SuperAdmin' ? allQuestions : creatorQuestions

    return (
        <TabPane tabId="2">
            {loadingLimited ?
                <QBLoadingSM title='paginated quizzes' /> :
                quizzesToUse && quizzesToUse.length > 0 ?
                    <>
                        {(user?.role === 'Admin' || user?.role === 'SuperAdmin') ?
                            <PageOf pageNo={pageNo} numberOfPages={numberOfPages} /> : null}

                        {
                            // SEARCH BARS
                            isLoading || questions.isLoading ?
                                <div className="p-1 m-1 d-flex justify-content-center align-items-center">
                                    <QBLoadingSM />  </div> :
                                <Row className="mt-0">
                                    <Col sm="6">
                                        <SearchInput setSearchKey={setSearchKey} placeholder=" Search quizzes here ...  " />
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

                        {/* SEARCH QUIZZES */}
                        <Row>
                            {quizzes?.filter(quiz => {
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
                                    quiz={quiz && quiz} />)}
                        </Row>

                        {/* LIMITED QUIZZES */}
                        <Row>
                            {quizzesToUse && quizzesToUse
                                .map(quiz => <QuizToast
                                    key={quiz._id}
                                    categories={categories}
                                    quiz={quiz && quiz} />)}
                        </Row>

                        {/* PAGINATION */}
                        {user?.role !== 'Visitor' ?
                            <>
                                <Pagination pageNo={pageNo} setPageNo={setPageNo} numberOfPages={numberOfPages} />
                            </> : null}
                    </> :
                    <Alert color="danger" className="w-50 text-center mx-auto" style={{ border: '2px solid var(--brand)' }}>
                        {console.log(isLoading, loadingLimited, quizzesToUse)}
                        You have not created any quiz yet!
                    </Alert>
            }
        </TabPane>
    )
}

export default QuizzesTabPane