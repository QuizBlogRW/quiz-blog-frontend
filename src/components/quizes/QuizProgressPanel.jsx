import React from 'react'
import { Card, CardBody, Button, Badge } from 'reactstrap'
import { FiGrid3x3, FiCheck, FiFlag, FiCircle, FiEye, FiEyeOff } from 'react-icons/fi'

const QuizProgressPanel = ({ 
    questions, 
    currentIndex, 
    answers, 
    flaggedQuestions, 
    onQuestionSelect,
    isOpen,
    onToggle 
}) => {
    const getQuestionStatus = (question, index) => {
        const isAnswered = answers[question._id]?.length > 0
        const isFlagged = flaggedQuestions.has(question._id)
        const isCurrent = index === currentIndex
        
        return {
            isAnswered,
            isFlagged,
            isCurrent,
            className: isCurrent 
                ? 'current' 
                : isAnswered 
                    ? 'answered' 
                    : isFlagged 
                        ? 'flagged' 
                        : 'unanswered'
        }
    }
    
    const getStatusIcon = (status) => {
        if (status.isCurrent) return '▶️'
        if (status.isAnswered) return <FiCheck />
        if (status.isFlagged) return <FiFlag />
        return <FiCircle />
    }
    
    const getStatusColor = (status) => {
        if (status.isCurrent) return 'primary'
        if (status.isAnswered) return 'success'
        if (status.isFlagged) return 'warning'
        return 'light'
    }
    
    const answeredCount = Object.keys(answers).length
    const flaggedCount = flaggedQuestions.size
    const totalQuestions = questions.length
    
    return (
        <div className="quiz-progress-panel">
            {/* Toggle button for mobile */}
            <Button
                color="outline-primary"
                size="sm"
                onClick={onToggle}
                className="toggle-panel-btn d-lg-none mb-2 w-100"
            >
                {isOpen ? <FiEyeOff /> : <FiEye />}
                {isOpen ? 'Hide' : 'Show'} Progress
            </Button>
            
            {/* Desktop toggle */}
            <Button
                color="outline-primary"
                size="sm"
                onClick={onToggle}
                className="toggle-panel-btn d-none d-lg-block mb-3"
            >
                <FiGrid3x3 className="me-2" />
                {isOpen ? 'Collapse' : 'Expand'}
            </Button>
            
            {isOpen && (
                <Card className="progress-panel-card">
                    <CardBody>
                        {/* Header stats */}
                        <div className="panel-header mb-3">
                            <h6 className="mb-2">Quiz Progress</h6>
                            <div className="stats-row mb-3">
                                <div className="stat-item">
                                    <Badge color="success" className="stat-badge">
                                        ✓ {answeredCount}
                                    </Badge>
                                    <small className="stat-label">Answered</small>
                                </div>
                                <div className="stat-item">
                                    <Badge color="warning" className="stat-badge">
                                        🚩 {flaggedCount}
                                    </Badge>
                                    <small className="stat-label">Flagged</small>
                                </div>
                                <div className="stat-item">
                                    <Badge color="light" className="stat-badge">
                                        ⭕ {totalQuestions - answeredCount}
                                    </Badge>
                                    <small className="stat-label">Remaining</small>
                                </div>
                            </div>
                        </div>
                        
                        {/* Question grid */}
                        <div className="questions-grid">
                            {questions.map((question, index) => {
                                const status = getQuestionStatus(question, index)
                                return (
                                    <Button
                                        key={question._id}
                                        color={getStatusColor(status)}
                                        size="sm"
                                        className={`question-btn ${status.className}`}
                                        onClick={() => onQuestionSelect(index)}
                                        title={`Question ${index + 1}${status.isAnswered ? ' (Answered)' : ''}${status.isFlagged ? ' (Flagged)' : ''}`}
                                    >
                                        <div className="question-btn-content">
                                            <span className="question-number">{index + 1}</span>
                                            <span className="question-status-icon">
                                                {getStatusIcon(status)}
                                            </span>
                                        </div>
                                    </Button>
                                )
                            })}
                        </div>
                        
                        {/* Legend */}
                        <div className="legend mt-3">
                            <small className="text-muted">Legend:</small>
                            <div className="legend-items">
                                <div className="legend-item">
                                    <Badge color="primary" size="sm">▶️</Badge>
                                    <small>Current</small>
                                </div>
                                <div className="legend-item">
                                    <Badge color="success" size="sm"><FiCheck /></Badge>
                                    <small>Answered</small>
                                </div>
                                <div className="legend-item">
                                    <Badge color="warning" size="sm"><FiFlag /></Badge>
                                    <small>Flagged</small>
                                </div>
                                <div className="legend-item">
                                    <Badge color="light" size="sm"><FiCircle /></Badge>
                                    <small>Unanswered</small>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            )}
            
            <style jsx>{`
                .quiz-progress-panel {
                    position: sticky;
                    top: 20px;
                }
                
                .progress-panel-card {
                    border: none;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    border-radius: 15px;
                }
                
                .panel-header h6 {
                    color: #495057;
                    font-weight: 600;
                }
                
                .stats-row {
                    display: flex;
                    justify-content: space-between;
                    gap: 8px;
                }
                
                .stat-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    flex: 1;
                }
                
                .stat-badge {
                    font-size: 0.75rem;
                    padding: 0.3rem 0.5rem;
                    margin-bottom: 0.2rem;
                    min-width: 35px;
                }
                
                .stat-label {
                    font-size: 0.7rem;
                    color: #6c757d;
                    line-height: 1;
                }
                
                .questions-grid {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 8px;
                    margin-bottom: 15px;
                }
                
                .question-btn {
                    aspect-ratio: 1;
                    padding: 0;
                    border-radius: 8px;
                    border-width: 2px;
                    position: relative;
                    overflow: hidden;
                }
                
                .question-btn.current {
                    border-color: #007bff;
                    box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
                }
                
                .question-btn.answered {
                    background-color: #d4edda;
                    border-color: #28a745;
                }
                
                .question-btn.flagged {
                    background-color: #fff3cd;
                    border-color: #ffc107;
                }
                
                .question-btn.unanswered {
                    background-color: #f8f9fa;
                    border-color: #dee2e6;
                }
                
                .question-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                }
                
                .question-btn-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                }
                
                .question-number {
                    font-size: 0.8rem;
                    font-weight: 600;
                    line-height: 1;
                }
                
                .question-status-icon {
                    font-size: 0.7rem;
                    margin-top: 2px;
                }
                
                .legend {
                    border-top: 1px solid #e9ecef;
                    padding-top: 10px;
                }
                
                .legend-items {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-top: 5px;
                }
                
                .legend-item {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                
                .legend-item small {
                    font-size: 0.7rem;
                }
                
                .toggle-panel-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                @media (max-width: 992px) {
                    .questions-grid {
                        grid-template-columns: repeat(6, 1fr);
                        gap: 6px;
                    }
                    
                    .question-btn {
                        font-size: 0.75rem;
                    }
                    
                    .stats-row {
                        gap: 4px;
                    }
                    
                    .stat-badge {
                        font-size: 0.7rem;
                        padding: 0.2rem 0.4rem;
                        min-width: 30px;
                    }
                }
                
                @media (max-width: 768px) {
                    .questions-grid {
                        grid-template-columns: repeat(8, 1fr);
                    }
                    
                    .legend-items {
                        justify-content: center;
                    }
                }
            `}</style>
        </div>
    )
}

export default QuizProgressPanel
