import { useMemo, useCallback, useEffect } from 'react';
import { Col, Row, Button, Badge, Form, Input, FormGroup, FormFeedback } from 'reactstrap';

// Helper function to parse explanation text and convert URLs to clickable links
const parseExplanation = (explanationText) => {
    if (!explanationText) return null;

    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const parts = explanationText.split(urlPattern);

    return parts.map((part, index) => {
        if (part.match(urlPattern)) {
            return (
                <a
                    key={index}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-decoration-underline"
                >
                    {part}
                </a>
            );
        }
        return <span key={index}>{part}</span>;
    });
};

// Answer Option Component
const AnswerOption = ({ answerOption, index }) => {
    const answerState = useMemo(() => ({
        isValid: answerOption.isCorrect,
        isInvalid: !answerOption.isCorrect && answerOption.choosen,
        isNeutral: !answerOption.isCorrect && !answerOption.choosen,
    }), [answerOption.isCorrect, answerOption.choosen]);

    const feedbackMsg = useMemo(() => {
        if (answerOption.isCorrect && answerOption.choosen) {
            return 'You got this right! ✓';
        }
        if (!answerOption.isCorrect && answerOption.choosen) {
            return 'Your choice was incorrect ✗';
        }
        if (answerOption.isCorrect && !answerOption.choosen) {
            return 'This was the correct answer ✓';
        }
        return null;
    }, [answerOption.isCorrect, answerOption.choosen]);

    const explanation = useMemo(
        () => parseExplanation(answerOption.explanations),
        [answerOption.explanations]
    );

    return (
        <FormGroup className="mb-3">
            {/* Answer Input */}
            <Input
                disabled
                value={answerOption.answerText}
                valid={answerState.isValid}
                invalid={answerState.isInvalid}
                className={`shadow-sm p-2 p-sm-3 rounded-3 ${answerState.isNeutral ? 'border border-secondary' : ''
                    }`}
                style={{
                    backgroundColor: '#F5F5F5',
                    color: '#000',
                    fontWeight: '500',
                    cursor: 'not-allowed',
                    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                }}
                readOnly
                aria-label={`Answer option ${index + 1}`}
            />

            {/* Feedback Text */}
            {feedbackMsg && (
                <FormFeedback
                    style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', fontWeight: '500' }}
                    valid={answerState.isValid}
                    invalid={answerState.isInvalid.toString()}
                >
                    {feedbackMsg}
                </FormFeedback>
            )}

            {/* Explanation Box */}
            {explanation && (
                <div
                    className="border rounded-3 mt-2 shadow-sm bg-white p-2 p-sm-3"
                    style={{
                        fontSize: 'clamp(0.8rem, 1.8vw, 0.95rem)',
                        lineHeight: '1.6',
                        borderLeft: '4px solid #157a6e',
                    }}
                    role="note"
                    aria-label="Answer explanation"
                >
                    <div className="d-flex align-items-start gap-2">
                        <span
                            className="flex-shrink-0"
                            role="img"
                            aria-label="information"
                            style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}
                        >
                            💡
                        </span>
                        <div className="flex-grow-1">{explanation}</div>
                    </div>
                </div>
            )}
        </FormGroup>
    );
};

// Answer Summary Badge Component
const AnswerSummaryBadge = ({ answerStats }) => (
    <div className="text-center my-3 my-sm-4">
        <Badge
            color={answerStats.isAnswerCorrect ? 'success' : 'danger'}
            className="py-2 px-3 px-sm-4 shadow-sm"
            style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
            pill
        >
            <i className={`fa ${answerStats.isAnswerCorrect ? 'fa-check-circle' : 'fa-times-circle'} me-2`}></i>
            <span className="d-none d-sm-inline">
                {answerStats.isAnswerCorrect ? 'Correct Answer!' : 'Incorrect Answer'}
            </span>
            <span className="d-inline d-sm-none">
                {answerStats.isAnswerCorrect ? 'Correct!' : 'Incorrect'}
            </span>
        </Badge>

        {answerStats.totalCorrect > 1 && (
            <div className="mt-2">
                <small className="text-muted" style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)' }}>
                    Selected {answerStats.correctlyChosen} of {answerStats.totalCorrect} correct
                    <span className="d-none d-sm-inline"> answers</span>
                </small>
            </div>
        )}
    </div>
);

// Navigation Buttons Component
const NavigationButtons = ({
    currentQuestion,
    lastAnswer,
    handlePrevAnswer,
    handleNextAnswer
}) => {
    const isPrevDisabled = currentQuestion === 0;

    return (
        <>
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-stretch align-items-sm-center mt-4 gap-2 gap-sm-3 w-100">
                <Button
                    onClick={handlePrevAnswer}
                    disabled={isPrevDisabled}
                    className="px-3 px-sm-4 py-2 fw-bold shadow-sm order-2 order-sm-1"
                    color="secondary"
                    outline
                    style={{
                        borderRadius: '8px',
                        opacity: isPrevDisabled ? 0.5 : 1,
                        transition: 'all 0.2s ease-in-out',
                    }}
                    aria-label="Go to previous question"
                >
                    <i className="fa fa-arrow-left me-2"></i>
                    <span className="d-none d-sm-inline">Previous</span>
                    <span className="d-inline d-sm-none">Prev</span>
                </Button>

                <Button
                    onClick={handleNextAnswer}
                    className="px-3 px-sm-4 py-2 fw-bold shadow-sm order-3"
                    style={{
                        color: 'var(--brand)',
                        backgroundColor: 'var(--accent)',
                        borderRadius: '8px',
                        border: 'none',
                        transition: 'all 0.2s ease-in-out',
                    }}
                    aria-label={lastAnswer ? 'End review' : 'Go to next question'}
                >
                    <span className="d-none d-sm-inline">
                        {lastAnswer ? 'End Review' : 'Next'}
                    </span>
                    <span className="d-inline d-sm-none">
                        {lastAnswer ? 'End' : 'Next'}
                    </span>
                    <i className="fa fa-arrow-right ms-2"></i>
                </Button>
            </div>

            {/* Keyboard shortcuts hint - desktop only */}
            <div className="text-center mt-3 mt-sm-4 d-none d-sm-block">
                <small className="text-muted fst-italic" style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)' }}>
                    💡 Tip: Use keyboard arrows (← →) to navigate between questions
                </small>
            </div>
        </>
    );
};

// Progress Indicator Component
const ProgressIndicator = ({ currentQuestion, totalQuestions }) => (
    <div className="text-center mb-3">
        <small
            className="text-muted fw-semibold"
            style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)' }}
        >
            <span className="d-none d-sm-inline">Question </span>
            <span className="d-inline d-sm-none">Q </span>
            <strong>{currentQuestion + 1}</strong> of <strong>{totalQuestions}</strong>
        </small>
    </div>
);

// Main Component
const ReviewView = ({
    qnsAll,
    curRevQn,
    lastAnswer,
    currentQuestion,
    setLastAnswer,
    setCurrentQuestion
}) => {
    // Memoize answer options
    const curRevQnOpts = useMemo(
        () => curRevQn?.answerOptions || [],
        [curRevQn?.answerOptions]
    );

    // Calculate correct answer statistics
    const answerStats = useMemo(() => {
        const totalCorrect = curRevQnOpts.filter(opt => opt.isCorrect).length;
        const correctlyChosen = curRevQnOpts.filter(
            opt => opt.isCorrect && opt.choosen
        ).length;
        const isAnswerCorrect = totalCorrect === correctlyChosen && correctlyChosen > 0;

        return { totalCorrect, correctlyChosen, isAnswerCorrect };
    }, [curRevQnOpts]);

    // Navigation handlers
    const handleNextAnswer = useCallback(() => {
        const next = currentQuestion + 1;
        if (next < qnsAll.length) {
            setCurrentQuestion(next);
        } else {
            setLastAnswer(true);
        }
    }, [currentQuestion, qnsAll.length, setCurrentQuestion, setLastAnswer]);

    const handlePrevAnswer = useCallback(() => {
        const prev = currentQuestion - 1;
        if (prev >= 0) {
            setCurrentQuestion(prev);
        }
    }, [currentQuestion, setCurrentQuestion]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e) => {
            // Prevent keyboard navigation if user is typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                handleNextAnswer();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                handlePrevAnswer();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleNextAnswer, handlePrevAnswer]);

    if (!curRevQn) {
        return (
            <Row>
                <Col className="text-center py-5">
                    <div className="alert alert-warning">
                        <i className="fa fa-exclamation-triangle me-2"></i>
                        Question data not available
                    </div>
                </Col>
            </Row>
        );
    }

    return (
        <Row>
            <Col xs={12} lg={10} className="mx-auto">
                {/* Progress Indicator */}
                <ProgressIndicator
                    currentQuestion={currentQuestion}
                    totalQuestions={qnsAll.length}
                />

                {/* Answer Options */}
                <div className="answer d-flex flex-column mt-3 w-100 px-2 px-sm-0">
                    <Form className="mt-2">
                        {curRevQnOpts.map((answerOption, index) => (
                            <AnswerOption
                                key={`answer-${index}-${answerOption.answerText}`}
                                answerOption={answerOption}
                                index={index}
                            />
                        ))}
                    </Form>
                </div>

                {/* Answer Summary Badge */}
                <AnswerSummaryBadge answerStats={answerStats} />

                {/* Navigation Buttons */}
                <div className="px-2 px-sm-0">
                    <NavigationButtons
                        currentQuestion={currentQuestion}
                        lastAnswer={lastAnswer}
                        handlePrevAnswer={handlePrevAnswer}
                        handleNextAnswer={handleNextAnswer}
                    />
                </div>
            </Col>
        </Row>
    );
};

export default ReviewView;