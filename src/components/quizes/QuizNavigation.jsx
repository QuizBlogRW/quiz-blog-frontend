import React from 'react'
import { Button, ButtonGroup, Alert } from 'reactstrap'
import { FiArrowLeft, FiArrowRight, FiSend, FiAlertTriangle } from 'react-icons/fi'

const QuizNavigation = ({ 
    currentIndex, 
    totalQuestions, 
    onPrevious, 
    onNext, 
    onSubmit,
    answeredQuestions,
    showSubmitWarning 
}) => {
    const isFirstQuestion = currentIndex === 0
    const isLastQuestion = currentIndex === totalQuestions - 1
    const completionPercentage = (answeredQuestions / totalQuestions * 100).toFixed(0)
    
    return (
        <div className="quiz-navigation">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                {/* Previous button */}
                <div className="navigation-left">
                    <Button
                        color="outline-secondary"
                        onClick={onPrevious}
                        disabled={isFirstQuestion}
                        className="d-flex align-items-center"
                    >
                        <FiArrowLeft className="me-2" />
                        Previous
                    </Button>
                </div>
                
                {/* Progress indicator */}
                <div className="navigation-center text-center">
                    <div className="progress-info">
                        <div className="question-counter mb-1">
                            Question {currentIndex + 1} of {totalQuestions}
                        </div>
                        <div className="completion-status">
                            <small className="text-muted">
                                {answeredQuestions} answered ({completionPercentage}% complete)
                            </small>
                        </div>
                    </div>
                </div>
                
                {/* Next/Submit buttons */}
                <div className="navigation-right">
                    <ButtonGroup>
                        {!isLastQuestion ? (
                            <Button
                                color="primary"
                                onClick={onNext}
                                className="d-flex align-items-center"
                            >
                                Next
                                <FiArrowRight className="ms-2" />
                            </Button>
                        ) : (
                            <Button
                                color="success"
                                onClick={onSubmit}
                                className="d-flex align-items-center"
                                size="lg"
                            >
                                <FiSend className="me-2" />
                                Submit Quiz
                            </Button>
                        )}
                    </ButtonGroup>
                </div>
            </div>
            
            {/* Submit warning for incomplete quiz */}
            {showSubmitWarning && isLastQuestion && (
                <Alert color="warning" className="mt-3 mb-0">
                    <FiAlertTriangle className="me-2" />
                    <strong>Incomplete Quiz:</strong> You have {totalQuestions - answeredQuestions} unanswered questions. 
                    You can still submit, but consider reviewing your answers first.
                </Alert>
            )}
            
            {/* Keyboard shortcuts hint */}
            <div className="keyboard-hints mt-2 text-center">
                <small className="text-muted">
                    Use ← → arrow keys to navigate • Press S to submit • Press F to flag
                </small>
            </div>
            
            <style jsx>{`
                .quiz-navigation {
                    padding: 10px 0;
                }
                
                .progress-info {
                    min-width: 150px;
                }
                
                .question-counter {
                    font-weight: 600;
                    color: #495057;
                    font-size: 1.1rem;
                }
                
                .completion-status {
                    font-size: 0.875rem;
                }
                
                .navigation-left,
                .navigation-right {
                    min-width: 120px;
                }
                
                .navigation-left {
                    display: flex;
                    justify-content: flex-start;
                }
                
                .navigation-right {
                    display: flex;
                    justify-content: flex-end;
                }
                
                .keyboard-hints {
                    border-top: 1px solid #e9ecef;
                    padding-top: 8px;
                    margin-top: 15px;
                }
                
                @media (max-width: 768px) {
                    .quiz-navigation .d-flex {
                        flex-direction: column;
                        text-align: center;
                    }
                    
                    .navigation-left,
                    .navigation-center,
                    .navigation-right {
                        width: 100%;
                        justify-content: center;
                        margin-bottom: 10px;
                    }
                    
                    .navigation-left:last-child,
                    .navigation-center:last-child,
                    .navigation-right:last-child {
                        margin-bottom: 0;
                    }
                    
                    .keyboard-hints {
                        display: none; /* Hide on mobile */
                    }
                }
            `}</style>
        </div>
    )
}

export default QuizNavigation
