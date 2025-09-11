import { useState, useEffect } from 'react'
import { Card, CardBody, Form, FormGroup, Label, Input, Button, Progress, Badge, Alert } from 'reactstrap'
import { FiFlag, FiAlertCircle, FiCheckCircle, FiHelpCircle, FiClock } from 'react-icons/fi'

const QuestionCard = ({ 
    question, 
    questionIndex, 
    totalQuestions,
    selectedAnswers, 
    onAnswerChange, 
    isflagged, 
    onToggleFlag,
    showHints,
    confidenceLevel 
}) => {
    const [localAnswers, setLocalAnswers] = useState(selectedAnswers || [])
    const [confidence, setConfidence] = useState(confidenceLevel || 'medium')
    const [showExplanation, setShowExplanation] = useState(false)
    const [timeSpent, setTimeSpent] = useState(0)
    
    const isMultipleChoice = question?.answerOptions?.filter(opt => opt.isCorrect).length > 1
    
    useEffect(() => {
        setLocalAnswers(selectedAnswers || [])
    }, [selectedAnswers, question])
    
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeSpent(prev => prev + 1)
        }, 1000)
        
        return () => clearInterval(timer)
    }, [questionIndex])
    
    useEffect(() => {
        setTimeSpent(0)
    }, [questionIndex])
    
    const handleAnswerSelection = (answerText, isChecked) => {
        let newAnswers
        
        if (isMultipleChoice) {
            if (isChecked) {
                newAnswers = [...localAnswers, answerText]
            } else {
                newAnswers = localAnswers.filter(answer => answer !== answerText)
            }
        } else {
            newAnswers = isChecked ? [answerText] : []
        }
        
        setLocalAnswers(newAnswers)
        onAnswerChange(newAnswers, confidence)
    }
    
    const handleConfidenceChange = (newConfidence) => {
        setConfidence(newConfidence)
        onAnswerChange(localAnswers, newConfidence)
    }
    
    const getConfidenceColor = (level) => {
        switch (level) {
            case 'high': return 'success'
            case 'medium': return 'warning'
            case 'low': return 'danger'
            default: return 'secondary'
        }
    }
    
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }
    
    if (!question) {
        return (
            <Card>
                <CardBody>
                    <Alert color="danger">Question not found</Alert>
                </CardBody>
            </Card>
        )
    }
    
    return (
        <Card className="question-card shadow">
            <CardBody>
                {/* Question header */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <Badge color="primary">Q{questionIndex + 1}</Badge>
                            {isMultipleChoice && (
                                <Badge color="info">Multiple Answers</Badge>
                            )}
                            {isflagged && (
                                <Badge color="warning">
                                    <FiFlag className="me-1" />
                                    Flagged
                                </Badge>
                            )}
                            <div className="ms-auto d-flex align-items-center text-muted">
                                <FiClock className="me-1" />
                                <small>{formatTime(timeSpent)}</small>
                            </div>
                        </div>
                        
                        <Progress 
                            value={(questionIndex + 1) / totalQuestions * 100} 
                            color="primary" 
                            className="mb-2"
                            style={{ height: '4px' }}
                        />
                    </div>
                </div>
                
                {/* Question text and image */}
                <div className="question-content mb-4">
                    <h5 className="question-text mb-3">{question.questionText}</h5>
                    
                    {question.imageUrl && (
                        <div className="text-center mb-3">
                            <img 
                                src={question.imageUrl} 
                                alt="Question visual"
                                className="img-fluid rounded shadow-sm"
                                style={{ maxHeight: '300px', maxWidth: '100%' }}
                            />
                        </div>
                    )}
                    
                    {showHints && question.hint && (
                        <Alert color="info" className="hint-box">
                            <FiHelpCircle className="me-2" />
                            <strong>Hint:</strong> {question.hint}
                        </Alert>
                    )}
                </div>
                
                {/* Answer options */}
                <Form>
                    <div className="answer-options">
                        {question.answerOptions?.map((option, index) => (
                            <div key={index} className="answer-option mb-3">
                                <Card 
                                    className={`answer-card ${localAnswers.includes(option.answerText) ? 'selected' : ''}`}
                                    onClick={() => handleAnswerSelection(option.answerText, !localAnswers.includes(option.answerText))}
                                >
                                    <CardBody className="py-3">
                                        <FormGroup check className="mb-0">
                                            <Label check className="w-100 cursor-pointer">
                                                <Input
                                                    type={isMultipleChoice ? "checkbox" : "radio"}
                                                    name={`question-${question._id}`}
                                                    checked={localAnswers.includes(option.answerText)}
                                                    onChange={(e) => handleAnswerSelection(option.answerText, e.target.checked)}
                                                    className="me-3"
                                                />
                                                <div className="answer-content">
                                                    <div className="answer-text">
                                                        {option.answerText}
                                                    </div>
                                                    {option.imageUrl && (
                                                        <img 
                                                            src={option.imageUrl} 
                                                            alt="Answer option"
                                                            className="answer-image mt-2"
                                                        />
                                                    )}
                                                </div>
                                                {localAnswers.includes(option.answerText) && (
                                                    <FiCheckCircle className="answer-check-icon" />
                                                )}
                                            </Label>
                                        </FormGroup>
                                    </CardBody>
                                </Card>
                            </div>
                        ))}
                    </div>
                </Form>
                
                {/* Question actions */}
                <div className="question-actions mt-4">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        {/* Confidence selector */}
                        <div className="confidence-selector">
                            <Label className="small text-muted mb-1">Confidence Level:</Label>
                            <div className="btn-group btn-group-sm" role="group">
                                <Button
                                    color={confidence === 'low' ? 'danger' : 'outline-danger'}
                                    size="sm"
                                    onClick={() => handleConfidenceChange('low')}
                                >
                                    Low
                                </Button>
                                <Button
                                    color={confidence === 'medium' ? 'warning' : 'outline-warning'}
                                    size="sm"
                                    onClick={() => handleConfidenceChange('medium')}
                                >
                                    Medium
                                </Button>
                                <Button
                                    color={confidence === 'high' ? 'success' : 'outline-success'}
                                    size="sm"
                                    onClick={() => handleConfidenceChange('high')}
                                >
                                    High
                                </Button>
                            </div>
                        </div>
                        
                        {/* Question utilities */}
                        <div className="question-utilities">
                            <Button
                                color={isflagged ? 'warning' : 'outline-secondary'}
                                size="sm"
                                onClick={onToggleFlag}
                                className="me-2"
                            >
                                <FiFlag className="me-1" />
                                {isflagged ? 'Unflag' : 'Flag for Review'}
                            </Button>
                            
                            {question.explanation && (
                                <Button
                                    color="outline-info"
                                    size="sm"
                                    onClick={() => setShowExplanation(!showExplanation)}
                                >
                                    <FiHelpCircle className="me-1" />
                                    {showExplanation ? 'Hide' : 'Show'} Explanation
                                </Button>
                            )}
                        </div>
                    </div>
                    
                    {/* Explanation panel */}
                    {showExplanation && question.explanation && (
                        <Alert color="light" className="explanation-panel mt-3">
                            <h6>Explanation:</h6>
                            <p className="mb-0">{question.explanation}</p>
                        </Alert>
                    )}
                    
                    {/* Answer feedback */}
                    {localAnswers.length > 0 && (
                        <Alert color="success" className="answer-feedback mt-3">
                            <FiCheckCircle className="me-2" />
                            Answer{isMultipleChoice && localAnswers.length > 1 ? 's' : ''} selected: {localAnswers.join(', ')}
                            {confidence && (
                                <Badge color={getConfidenceColor(confidence)} className="ms-2">
                                    {confidence} confidence
                                </Badge>
                            )}
                        </Alert>
                    )}
                </div>
            </CardBody>
            
            <style jsx>{`
                .question-card {
                    border: none;
                    border-radius: 15px;
                }
                
                .answer-card {
                    border: 2px solid #dee2e6;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .answer-card:hover {
                    border-color: #007bff;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 8px rgba(0,123,255,0.15);
                }
                
                .answer-card.selected {
                    border-color: #28a745;
                    background-color: #f8fff9;
                }
                
                .answer-content {
                    flex-grow: 1;
                }
                
                .answer-text {
                    font-weight: 500;
                    color: #495057;
                }
                
                .answer-image {
                    max-width: 200px;
                    max-height: 150px;
                    border-radius: 8px;
                }
                
                .answer-check-icon {
                    color: #28a745;
                    font-size: 1.2rem;
                    margin-left: auto;
                }
                
                .cursor-pointer {
                    cursor: pointer;
                }
                
                .confidence-selector .btn {
                    min-width: 60px;
                }
                
                .hint-box {
                    border-left: 4px solid #17a2b8;
                }
                
                .explanation-panel {
                    border-left: 4px solid #6c757d;
                }
                
                .answer-feedback {
                    border-left: 4px solid #28a745;
                }
                
                .question-text {
                    line-height: 1.6;
                    color: #2c3e50;
                }
                
                @media (max-width: 768px) {
                    .question-actions {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    
                    .confidence-selector,
                    .question-utilities {
                        width: 100%;
                        text-align: center;
                    }
                    
                    .btn-group {
                        width: 100%;
                    }
                    
                    .btn-group .btn {
                        flex: 1;
                    }
                }
            `}</style>
        </Card>
    )
}

export default QuestionCard
