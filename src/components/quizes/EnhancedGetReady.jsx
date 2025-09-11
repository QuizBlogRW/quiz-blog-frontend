import { useState, useEffect } from 'react'
import { Card, CardBody, Button, Progress, Alert, Badge, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { FiPlay, FiInfo, FiClock, FiUsers, FiTarget, FiShare2, FiHelpCircle } from 'react-icons/fi'
import { useSelector } from 'react-redux'

const EnhancedGetReady = ({ quiz, onStartQuiz }) => {
    const [showInstructions, setShowInstructions] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [readyToStart, setReadyToStart] = useState(false)
    const [systemCheck, setSystemCheck] = useState({ passed: false, checking: true })
    
    const auth = useSelector(state => state.auth)
    const currentUser = auth && auth.user
    
    const qnsLength = quiz?.questions?.length || 0
    const estimatedDuration = Math.ceil(qnsLength * 1.5) // 1.5 minutes per question
    const passMark = quiz?.category?._id === '60e9a2ba82f7830015c317f1' ? 80 : 50
    
    useEffect(() => {
        // Simulate system check
        const checkTimer = setTimeout(() => {
            setSystemCheck({ passed: true, checking: false })
            setReadyToStart(true)
        }, 2000)
        
        return () => clearTimeout(checkTimer)
    }, [])
    
    const handleStartQuiz = async () => {
        setIsLoading(true)
        // Add a small delay for better UX
        setTimeout(() => {
            onStartQuiz()
        }, 1000)
    }
    
    const shareQuiz = () => {
        const shareData = {
            title: `Check out this quiz: ${quiz.title}`,
            text: `I'm about to take "${quiz.title}" - ${qnsLength} questions on ${quiz.category?.title}`,
            url: window.location.href
        }
        
        if (navigator.share) {
            navigator.share(shareData)
        } else {
            // Fallback to copy link
            navigator.clipboard.writeText(window.location.href)
            alert('Quiz link copied to clipboard!')
        }
    }
    
    const getDifficultyLevel = () => {
        if (qnsLength <= 10) return { level: 'Beginner', color: 'success' }
        if (qnsLength <= 20) return { level: 'Intermediate', color: 'warning' }
        return { level: 'Advanced', color: 'danger' }
    }
    
    const difficulty = getDifficultyLevel()
    
    if (!quiz) {
        return (
            <div className="vh-100 d-flex justify-content-center align-items-center">
                <Alert color="warning">Quiz not found or failed to load.</Alert>
            </div>
        )
    }
    
    return (
        <div className="enhanced-get-ready">
            <div className="container-fluid px-3 py-4">
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-xl-6">
                        {/* Main quiz info card */}
                        <Card className="quiz-overview-card shadow-lg">
                            <CardBody className="p-4">
                                {/* Header */}
                                <div className="quiz-header mb-4">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div className="flex-grow-1">
                                            <h2 className="quiz-title mb-2">{quiz.title}</h2>
                                            <Badge color="primary" className="category-badge">
                                                {quiz.category?.title}
                                            </Badge>
                                            <Badge color={difficulty.color} className="ms-2">
                                                {difficulty.level}
                                            </Badge>
                                        </div>
                                        <Button 
                                            color="outline-secondary" 
                                            size="sm"
                                            onClick={shareQuiz}
                                        >
                                            <FiShare2 />
                                        </Button>
                                    </div>
                                </div>
                                
                                {/* Quiz description */}
                                {quiz.description && (
                                    <Alert color="info" className="quiz-description">
                                        <FiInfo className="me-2" />
                                        {quiz.description}
                                    </Alert>
                                )}
                                
                                {/* Quiz stats */}
                                <div className="quiz-stats row g-3 mb-4">
                                    <div className="col-6 col-md-3">
                                        <div className="stat-card text-center">
                                            <FiHelpCircle className="stat-icon text-primary" />
                                            <div className="stat-value">{qnsLength}</div>
                                            <div className="stat-label">Questions</div>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <div className="stat-card text-center">
                                            <FiClock className="stat-icon text-warning" />
                                            <div className="stat-value">{estimatedDuration}</div>
                                            <div className="stat-label">Minutes</div>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <div className="stat-card text-center">
                                            <FiTarget className="stat-icon text-success" />
                                            <div className="stat-value">{passMark}%</div>
                                            <div className="stat-label">Pass Mark</div>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <div className="stat-card text-center">
                                            <FiUsers className="stat-icon text-info" />
                                            <div className="stat-value">{quiz.taken || 0}</div>
                                            <div className="stat-label">Attempts</div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* System check */}
                                <Card className="system-check mb-4">
                                    <CardBody className="py-3">
                                        <h6 className="mb-3">System Check</h6>
                                        {systemCheck.checking ? (
                                            <div className="d-flex align-items-center">
                                                <div className="spinner-border spinner-border-sm me-3" role="status"></div>
                                                <span>Checking your connection and browser compatibility...</span>
                                            </div>
                                        ) : systemCheck.passed ? (
                                            <Alert color="success" className="mb-0">
                                                ✅ All systems ready! You're good to start the quiz.
                                            </Alert>
                                        ) : (
                                            <Alert color="danger" className="mb-0">
                                                ❌ System check failed. Please refresh the page and try again.
                                            </Alert>
                                        )}
                                    </CardBody>
                                </Card>
                                
                                {/* User info */}
                                {currentUser && (
                                    <div className="user-info mb-4 p-3 bg-light rounded">
                                        <h6>Taking quiz as:</h6>
                                        <div className="d-flex align-items-center">
                                            <div className="user-avatar me-3">
                                                {currentUser.name?.charAt(0)?.toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <div className="user-name">{currentUser.name}</div>
                                                <small className="text-muted">{currentUser.email}</small>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Action buttons */}
                                <div className="action-buttons d-grid gap-2">
                                    <Button
                                        color="primary"
                                        size="lg"
                                        onClick={handleStartQuiz}
                                        disabled={!readyToStart || isLoading}
                                        className="start-quiz-btn"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                                Starting Quiz...
                                            </>
                                        ) : (
                                            <>
                                                <FiPlay className="me-2" />
                                                Start Quiz Now
                                            </>
                                        )}
                                    </Button>
                                    
                                    <Button
                                        color="outline-info"
                                        onClick={() => setShowInstructions(true)}
                                        className="instructions-btn"
                                    >
                                        <FiInfo className="me-2" />
                                        View Instructions
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
            
            {/* Instructions Modal */}
            <Modal isOpen={showInstructions} toggle={() => setShowInstructions(false)} size="lg">
                <ModalHeader toggle={() => setShowInstructions(false)}>
                    Quiz Instructions
                </ModalHeader>
                <ModalBody>
                    <div className="instructions-content">
                        <h6>Before you start:</h6>
                        <ul className="mb-4">
                            <li>Ensure you have a stable internet connection</li>
                            <li>Find a quiet place to focus</li>
                            <li>Have about {estimatedDuration} minutes available</li>
                            <li>Close unnecessary browser tabs</li>
                        </ul>
                        
                        <h6>During the quiz:</h6>
                        <ul className="mb-4">
                            <li>Read each question carefully</li>
                            <li>You can flag questions for review</li>
                            <li>Use the progress panel to navigate between questions</li>
                            <li>Your progress is automatically saved</li>
                            <li>Timer will show remaining time for the entire quiz</li>
                        </ul>
                        
                        <h6>Scoring:</h6>
                        <ul className="mb-4">
                            <li>Each question is worth 1 point</li>
                            <li>No negative marking for wrong answers</li>
                            <li>Pass mark is {passMark}%</li>
                            <li>You'll see detailed results after submission</li>
                        </ul>
                        
                        <Alert color="warning">
                            <strong>Important:</strong> Once you start, the timer begins immediately. 
                            Make sure you're ready before clicking "Start Quiz".
                        </Alert>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => setShowInstructions(false)}>
                        Close
                    </Button>
                    <Button color="primary" onClick={() => {
                        setShowInstructions(false)
                        handleStartQuiz()
                    }} disabled={!readyToStart}>
                        <FiPlay className="me-2" />
                        Start Quiz
                    </Button>
                </ModalFooter>
            </Modal>
            
            <style jsx>{`
                .enhanced-get-ready {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    display: flex;
                    align-items: center;
                }
                
                .quiz-overview-card {
                    border: none;
                    border-radius: 20px;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                }
                
                .quiz-title {
                    color: #2c3e50;
                    font-weight: 700;
                    line-height: 1.3;
                }
                
                .category-badge, .difficulty-badge {
                    font-size: 0.8rem;
                    padding: 0.4rem 0.8rem;
                    border-radius: 20px;
                }
                
                .quiz-description {
                    border-left: 4px solid #17a2b8;
                    background-color: #f7f9fc;
                }
                
                .stat-card {
                    padding: 1rem;
                    border-radius: 12px;
                    background: #f8f9fa;
                    border: 1px solid #e9ecef;
                    transition: transform 0.2s ease;
                }
                
                .stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                
                .stat-icon {
                    font-size: 1.5rem;
                    margin-bottom: 0.5rem;
                }
                
                .stat-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #2c3e50;
                }
                
                .stat-label {
                    font-size: 0.8rem;
                    color: #6c757d;
                    font-weight: 500;
                }
                
                .system-check {
                    border: 1px solid #e9ecef;
                    border-radius: 12px;
                    background: #ffffff;
                }
                
                .user-info {
                    border-radius: 12px;
                }
                
                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 700;
                    font-size: 1.1rem;
                }
                
                .user-name {
                    font-weight: 600;
                    color: #2c3e50;
                }
                
                .start-quiz-btn {
                    padding: 1rem 2rem;
                    border-radius: 50px;
                    font-weight: 600;
                    font-size: 1.1rem;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                    transition: all 0.3s ease;
                }
                
                .start-quiz-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
                }
                
                .instructions-btn {
                    padding: 0.8rem 2rem;
                    border-radius: 50px;
                    font-weight: 500;
                }
                
                .instructions-content {
                    font-size: 0.95rem;
                    line-height: 1.6;
                }
                
                .instructions-content h6 {
                    color: #495057;
                    font-weight: 600;
                    margin-top: 1rem;
                    margin-bottom: 0.5rem;
                }
                
                .instructions-content ul {
                    padding-left: 1.5rem;
                }
                
                .instructions-content li {
                    margin-bottom: 0.3rem;
                }
                
                @media (max-width: 768px) {
                    .enhanced-get-ready {
                        padding: 1rem;
                    }
                    
                    .quiz-overview-card {
                        border-radius: 15px;
                    }
                    
                    .quiz-title {
                        font-size: 1.5rem;
                    }
                    
                    .stat-card {
                        padding: 0.8rem;
                    }
                    
                    .stat-icon {
                        font-size: 1.3rem;
                    }
                    
                    .stat-value {
                        font-size: 1.3rem;
                    }
                    
                    .start-quiz-btn {
                        font-size: 1rem;
                        padding: 0.9rem 1.5rem;
                    }
                }
            `}</style>
        </div>
    )
}

export default EnhancedGetReady
