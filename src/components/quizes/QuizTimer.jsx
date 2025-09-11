import { useState, useEffect } from 'react'
import { Badge } from 'reactstrap'
import { FiClock, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi'

const QuizTimer = ({ duration = 60, onTimeUp, paused = false, questionIndex = 0 }) => {
    const [timeLeft, setTimeLeft] = useState(duration)
    const [isWarning, setIsWarning] = useState(false)
    const [isCritical, setIsCritical] = useState(false)
    
    useEffect(() => {
        setTimeLeft(duration)
        setIsWarning(false)
        setIsCritical(false)
    }, [duration, questionIndex])
    
    useEffect(() => {
        if (paused) return
        
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    onTimeUp()
                    return 0
                }
                
                const newTime = prev - 1
                
                // Set warning states
                const warningThreshold = Math.max(duration * 0.25, 30) // 25% or 30 seconds
                const criticalThreshold = Math.max(duration * 0.1, 10) // 10% or 10 seconds
                
                setIsWarning(newTime <= warningThreshold && newTime > criticalThreshold)
                setIsCritical(newTime <= criticalThreshold)
                
                return newTime
            })
        }, 1000)
        
        return () => clearInterval(timer)
    }, [paused, duration, onTimeUp, questionIndex])
    
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }
    
    const getTimerColor = () => {
        if (isCritical) return 'danger'
        if (isWarning) return 'warning'
        return 'primary'
    }
    
    const getProgressPercentage = () => {
        return (timeLeft / duration) * 100
    }
    
    const getTimerIcon = () => {
        if (isCritical) return <FiAlertTriangle />
        if (paused) return <FiCheckCircle />
        return <FiClock />
    }
    
    return (
        <div className="quiz-timer">
            <div className="timer-container">
                <Badge 
                    color={getTimerColor()} 
                    className={`timer-badge ${isCritical ? 'pulse' : ''} ${paused ? 'paused' : ''}`}
                >
                    {getTimerIcon()}
                    <span className="timer-text">
                        {paused ? 'PAUSED' : formatTime(timeLeft)}
                    </span>
                </Badge>
                
                {!paused && (
                    <div className="timer-progress-container">
                        <div 
                            className={`timer-progress ${getTimerColor()}`}
                            style={{ width: `${getProgressPercentage()}%` }}
                        />
                    </div>
                )}
            </div>
            
            <style jsx>{`
                .quiz-timer {
                    position: relative;
                }
                
                .timer-container {
                    position: relative;
                }
                
                .timer-badge {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    padding: 8px 12px;
                    border-radius: 20px;
                    min-width: 80px;
                    justify-content: center;
                }
                
                .timer-badge.pulse {
                    animation: pulse-red 1s infinite;
                }
                
                .timer-badge.paused {
                    background-color: #6c757d !important;
                }
                
                .timer-text {
                    font-family: 'Courier New', monospace;
                    font-size: 0.9rem;
                }
                
                .timer-progress-container {
                    width: 100%;
                    height: 3px;
                    background-color: rgba(0,0,0,0.1);
                    border-radius: 2px;
                    overflow: hidden;
                    margin-top: 4px;
                }
                
                .timer-progress {
                    height: 100%;
                    transition: width 1s linear;
                    border-radius: 2px;
                }
                
                .timer-progress.primary {
                    background-color: #007bff;
                }
                
                .timer-progress.warning {
                    background-color: #ffc107;
                }
                
                .timer-progress.danger {
                    background-color: #dc3545;
                }
                
                @keyframes pulse-red {
                    0% {
                        box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7);
                    }
                    70% {
                        box-shadow: 0 0 0 10px rgba(220, 53, 69, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(220, 53, 69, 0);
                    }
                }
                
                @media (max-width: 768px) {
                    .timer-badge {
                        font-size: 0.8rem;
                        padding: 6px 10px;
                        min-width: 70px;
                    }
                    
                    .timer-text {
                        font-size: 0.8rem;
                    }
                }
            `}</style>
        </div>
    )
}

export default QuizTimer
