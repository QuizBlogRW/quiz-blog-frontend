import { useState, useEffect, useCallback, useMemo } from 'react'
import { Container, Row, Col, Button, Progress, Alert, Card, CardBody, Badge } from 'reactstrap'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { FiClock, FiArrowLeft, FiArrowRight, FiCheckCircle, FiCircle, FiAlertCircle, FiFlag } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import QuestionCard from './QuestionCard'
import QuizNavigation from './QuizNavigation'
import QuizProgressPanel from './QuizProgressPanel'
import QuizTimer from './QuizTimer'
import { createScore } from '../../redux/slices/scoresSlice'
import { v4 as uuidv4 } from 'uuid'

const QuizInterface = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const { quizSlug } = useParams()
    
    const auth = useSelector(state => state.auth)
    const currentUser = auth && auth.user
    
    // Get quiz data from route state
    const quizState = location.state
    const thisQuiz = quizState && quizState.oneQuiz
    
    // Quiz configuration
    const qnsLength = thisQuiz?.questions?.length || 0
    const passMark = thisQuiz?.category?._id === '60e9a2ba82f7830015c317f1' ? 80 : 50
    
    // Quiz state management
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState({})
    const [flaggedQuestions, setFlaggedQuestions] = useState(new Set())
    const [timeSpentPerQuestion, setTimeSpentPerQuestion] = useState({})
    const [quizStartTime] = useState(Date.now())
    const [questionStartTime, setQuestionStartTime] = useState(Date.now())
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)
    const [autoSaveStatus, setAutoSaveStatus] = useState('saved')
    
    // Enhanced navigation state
    const [navigationOpen, setNavigationOpen] = useState(false)
    const [showHints, setShowHints] = useState(true)
    const [confidenceLevel, setConfidenceLevel] = useState({})
    
    // Current question data
    const currentQuestion = thisQuiz?.questions?.[currentQuestionIndex]
    const currentQuestionId = currentQuestion?._id
    
    // Calculate progress metrics
    const answeredQuestions = Object.keys(answers).length
    const progressPercentage = qnsLength > 0 ? (answeredQuestions / qnsLength) * 100 : 0
    const remainingQuestions = qnsLength - answeredQuestions
    
    // Auto-save functionality
    useEffect(() => {
        const saveInterval = setInterval(() => {
            if (Object.keys(answers).length > 0) {
                setAutoSaveStatus('saving')
                // Simulate save operation
                setTimeout(() => setAutoSaveStatus('saved'), 1000)
            }
        }, 30000) // Auto-save every 30 seconds
        
        return () => clearInterval(saveInterval)
    }, [answers])
    
    // Track time spent on each question
    useEffect(() => {
        setQuestionStartTime(Date.now())
        
        return () => {
            if (currentQuestionId) {
                const timeSpent = Date.now() - questionStartTime
                setTimeSpentPerQuestion(prev => ({
                    ...prev,
                    [currentQuestionId]: (prev[currentQuestionId] || 0) + timeSpent
                }))
            }
        }
    }, [currentQuestionIndex, currentQuestionId, questionStartTime])
    
    // Handle answer selection
    const handleAnswerChange = useCallback((questionId, selectedAnswers, confidence = 'medium') => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: selectedAnswers
        }))
        
        setConfidenceLevel(prev => ({
            ...prev,
            [questionId]: confidence
        }))
        
        setAutoSaveStatus('modified')
    }, [])
    
    // Navigation functions
    const goToQuestion = useCallback((index) => {
        if (index >= 0 && index < qnsLength) {
            setCurrentQuestionIndex(index)
        }
    }, [qnsLength])
    
    const goToNextQuestion = useCallback(() => {
        if (currentQuestionIndex < qnsLength - 1) {
            setCurrentQuestionIndex(prev => prev + 1)
        }
    }, [currentQuestionIndex, qnsLength])
    
    const goToPreviousQuestion = useCallback(() => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1)
        }
    }, [currentQuestionIndex])
    
    // Flag/unflag questions
    const toggleQuestionFlag = useCallback((questionId) => {
        setFlaggedQuestions(prev => {
            const newSet = new Set(prev)
            if (newSet.has(questionId)) {
                newSet.delete(questionId)
            } else {
                newSet.add(questionId)
            }
            return newSet
        })
    }, [])
    
    // Calculate final score and create review object
    const calculateScore = useMemo(() => {
        if (!thisQuiz?.questions) return { marks: 0, review: null }
        
        let totalMarks = 0
        const reviewQuestions = thisQuiz.questions.map(question => {
            const userAnswers = answers[question._id] || []
            const correctOptions = question.answerOptions.filter(opt => opt.isCorrect)
            const userCorrectAnswers = question.answerOptions.filter(opt => 
                opt.isCorrect && userAnswers.includes(opt.answerText)
            )
            
            let questionMarks = 0
            if (correctOptions.length > 0) {
                questionMarks = userCorrectAnswers.length / correctOptions.length
                totalMarks += questionMarks
            }
            
            return {
                ...question,
                answerOptions: question.answerOptions.map(opt => ({
                    ...opt,
                    choosen: userAnswers.includes(opt.answerText)
                })),
                userConfidence: confidenceLevel[question._id] || 'medium',
                timeSpent: timeSpentPerQuestion[question._id] || 0
            }
        })
        
        return {
            marks: Math.floor(totalMarks),
            review: {
                id: uuidv4(),
                title: thisQuiz.title,
                description: thisQuiz.description,
                questions: reviewQuestions,
                totalTimeSpent: Date.now() - quizStartTime,
                flaggedQuestions: Array.from(flaggedQuestions)
            }
        }
    }, [answers, thisQuiz, confidenceLevel, timeSpentPerQuestion, quizStartTime, flaggedQuestions])
    
    // Submit quiz
    const handleSubmitQuiz = async () => {
        const { marks, review } = calculateScore
        
        const scoreToSave = {
            id: uuidv4(),
            marks,
            out_of: qnsLength,
            category: thisQuiz?.category?._id,
            quiz: thisQuiz?._id,
            review,
            taken_by: currentUser?._id
        }
        
        try {
            if (currentUser?._id) {
                const savedScore = await dispatch(createScore(scoreToSave)).unwrap()
                
                navigate(`/quiz-results/${quizSlug}`, {
                    state: {
                        score: marks,
                        qnsLength,
                        passMark,
                        thisQuiz,
                        quizToReview: review,
                        newScoreId: scoreToSave.id,
                        mongoScoreId: savedScore._id
                    }
                })
            }
        } catch (error) {
            console.error('Failed to save score:', error)
        }
    }
    
    if (!thisQuiz) {
        return (
            <div className="vh-100 d-flex justify-content-center align-items-center">
                <Alert color="warning">Quiz not found or failed to load.</Alert>
            </div>
        )
    }
    
    return (
        <div className="enhanced-quiz-interface">
            <Container fluid className="px-3 py-2">
                {/* Header with progress and timer */}
                <Card className="mb-3 shadow-sm">
                    <CardBody className="py-2">
                        <Row className="align-items-center">
                            <Col md={4}>
                                <h5 className="mb-0 text-primary">{thisQuiz.title}</h5>
                                <small className="text-muted">
                                    Question {currentQuestionIndex + 1} of {qnsLength}
                                </small>
                            </Col>
                            <Col md={4}>
                                <div className="text-center">
                                    <Progress 
                                        value={progressPercentage} 
                                        color={progressPercentage < 30 ? 'danger' : progressPercentage < 70 ? 'warning' : 'success'}
                                        className="mb-1"
                                    />
                                    <small className="text-muted">
                                        {answeredQuestions} answered • {flaggedQuestions.size} flagged
                                    </small>
                                </div>
                            </Col>
                            <Col md={4} className="text-end">
                                <QuizTimer 
                                    duration={currentQuestion?.duration || 60}
                                    onTimeUp={() => goToNextQuestion()}
                                    paused={showConfirmSubmit}
                                />
                                <div className="mt-1">
                                    <Badge color={autoSaveStatus === 'saved' ? 'success' : 'warning'}>
                                        {autoSaveStatus === 'saved' ? 'Saved' : 'Saving...'}
                                    </Badge>
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                
                <Row>
                    {/* Main question area */}
                    <Col lg={navigationOpen ? 8 : 10} className="mb-3">
                        <QuestionCard
                            question={currentQuestion}
                            questionIndex={currentQuestionIndex}
                            totalQuestions={qnsLength}
                            selectedAnswers={answers[currentQuestionId] || []}
                            onAnswerChange={(selected, confidence) => 
                                handleAnswerChange(currentQuestionId, selected, confidence)
                            }
                            isflagged={flaggedQuestions.has(currentQuestionId)}
                            onToggleFlag={() => toggleQuestionFlag(currentQuestionId)}
                            showHints={showHints}
                            confidenceLevel={confidenceLevel[currentQuestionId]}
                        />
                    </Col>
                    
                    {/* Side panel */}
                    <Col lg={navigationOpen ? 4 : 2}>
                        <QuizProgressPanel
                            questions={thisQuiz.questions}
                            currentIndex={currentQuestionIndex}
                            answers={answers}
                            flaggedQuestions={flaggedQuestions}
                            onQuestionSelect={goToQuestion}
                            isOpen={navigationOpen}
                            onToggle={() => setNavigationOpen(!navigationOpen)}
                        />
                        
                        {navigationOpen && (
                            <Card className="mt-3">
                                <CardBody>
                                    <h6>Quick Stats</h6>
                                    <p className="small mb-1">Answered: {answeredQuestions}/{qnsLength}</p>
                                    <p className="small mb-1">Flagged: {flaggedQuestions.size}</p>
                                    <p className="small mb-0">Remaining: {remainingQuestions}</p>
                                    
                                    <hr />
                                    
                                    <div className="d-grid gap-2">
                                        <Button 
                                            size="sm" 
                                            color="warning"
                                            onClick={() => setShowHints(!showHints)}
                                        >
                                            {showHints ? 'Hide' : 'Show'} Hints
                                        </Button>
                                        
                                        <Button
                                            size="sm"
                                            color="info"
                                            onClick={() => {
                                                const unanswered = thisQuiz.questions.findIndex(
                                                    (q, index) => !answers[q._id] && index > currentQuestionIndex
                                                )
                                                if (unanswered !== -1) goToQuestion(unanswered)
                                            }}
                                        >
                                            Next Unanswered
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        )}
                    </Col>
                </Row>
                
                {/* Navigation controls */}
                <Card className="mt-3">
                    <CardBody className="py-2">
                        <QuizNavigation
                            currentIndex={currentQuestionIndex}
                            totalQuestions={qnsLength}
                            onPrevious={goToPreviousQuestion}
                            onNext={goToNextQuestion}
                            onSubmit={() => setShowConfirmSubmit(true)}
                            answeredQuestions={answeredQuestions}
                            showSubmitWarning={answeredQuestions < qnsLength}
                        />
                    </CardBody>
                </Card>
                
                {/* Submit confirmation modal */}
                {showConfirmSubmit && (
                    <div className="submit-overlay">
                        <Card className="submit-confirmation">
                            <CardBody>
                                <h5>Submit Quiz?</h5>
                                <p>
                                    You have answered {answeredQuestions} out of {qnsLength} questions.
                                    {remainingQuestions > 0 && (
                                        <span className="text-warning">
                                            <br/>{remainingQuestions} questions remain unanswered.
                                        </span>
                                    )}
                                    {flaggedQuestions.size > 0 && (
                                        <span className="text-info">
                                            <br/>{flaggedQuestions.size} questions are flagged for review.
                                        </span>
                                    )}
                                </p>
                                <div className="d-flex gap-2 justify-content-end">
                                    <Button 
                                        color="secondary" 
                                        onClick={() => setShowConfirmSubmit(false)}
                                    >
                                        Continue Quiz
                                    </Button>
                                    <Button 
                                        color="primary" 
                                        onClick={handleSubmitQuiz}
                                    >
                                        Submit Quiz
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                )}
            </Container>
            
            <style jsx>{`
                .enhanced-quiz-interface {
                    min-height: 100vh;
                    background-color: #f8f9fa;
                }
                
                .submit-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1050;
                }
                
                .submit-confirmation {
                    max-width: 500px;
                    margin: 20px;
                }
            `}</style>
        </div>
    )
}

export default QuizInterface
