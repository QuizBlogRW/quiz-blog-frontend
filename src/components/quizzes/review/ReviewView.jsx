import { useMemo, useCallback } from 'react';
import { Col, Row, Button, Badge, Form, Input, FormGroup, FormFeedback } from 'reactstrap';

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
        const isAnswerCorrect = totalCorrect === correctlyChosen &&
            correctlyChosen > 0;

        return { totalCorrect, correctlyChosen, isAnswerCorrect };
    }, [curRevQnOpts]);

    // Parse explanation text and convert URLs to links
    const parseExplanation = useCallback((explanationText) => {
        if (!explanationText) return null;

        return explanationText.split(' ').map((word, index) => {
            // Check if word is a URL
            if (word.startsWith('http://') || word.startsWith('https://')) {
                return (
                    <a
                        key={index}
                        href={word}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-decoration-underline"
                    >
                        {word}
                    </a>
                );
            }
            return <span key={index}>{word} </span>;
        });
    }, []);

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
    useMemo(() => {
        const handleKeyPress = (e) => {
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

    // Get feedback message for each answer option
    const getFeedbackMessage = useCallback((answerOption) => {
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
    }, []);

    // Determine answer option state
    const getAnswerState = useCallback((answerOption) => {
        return {
            isValid: answerOption.isCorrect,
            isInvalid: !answerOption.isCorrect && answerOption.choosen,
            isNeutral: !answerOption.isCorrect && !answerOption.choosen,
        };
    }, []);

    // Progress information
    const progressInfo = useMemo(
        () => `Question ${currentQuestion + 1} of ${qnsAll.length}`,
        [currentQuestion, qnsAll.length]
    );

    if (!curRevQn) return null;

    return (
        <Row>
            <Col>
                {/* Progress Indicator */}
                <div className="text-center mb-3">
                    <small className="text-muted fw-semibold">{progressInfo}</small>
                </div>

                <div className="answer d-flex flex-column mx-auto mt-3 w-100">
                    <Form className="mt-2">
                        {curRevQnOpts.map((answerOption, index) => {
                            const explanation = parseExplanation(answerOption.explanations);
                            const answerState = getAnswerState(answerOption);
                            const feedbackMsg = getFeedbackMessage(answerOption);

                            return (
                                <FormGroup key={`answer-${index}-${answerOption.answerText}`} className="mb-3">
                                    {/* ANSWER INPUT */}
                                    <Input
                                        disabled
                                        value={answerOption.answerText}
                                        valid={answerState.isValid}
                                        invalid={answerState.isInvalid}
                                        className={`shadow-sm p-2 rounded-3 ${answerState.isNeutral ? 'border border-secondary' : ''
                                            }`}
                                        style={{
                                            backgroundColor: '#F5F5F5',
                                            color: '#000',
                                            fontWeight: '500',
                                            cursor: 'not-allowed',
                                        }}
                                        readOnly
                                        aria-label={`Answer option ${index + 1}`}
                                    />

                                    {/* FEEDBACK TEXT */}
                                    {feedbackMsg && (
                                        <FormFeedback
                                            style={{ fontSize: '.8rem', fontWeight: '500' }}
                                            valid={answerState.isValid}
                                            invalid={answerState.isInvalid.toString()}
                                        >
                                            {feedbackMsg}
                                        </FormFeedback>
                                    )}

                                    {/* EXPLANATION BOX */}
                                    {explanation && (
                                        <div
                                            className="border rounded-3 mt-2 shadow-sm bg-white p-2 px-lg-3"
                                            style={{
                                                fontSize: '.85rem',
                                                lineHeight: '1.5rem',
                                                borderLeft: '4px solid #157a6e',
                                            }}
                                            role="note"
                                            aria-label="Answer explanation"
                                        >
                                            <div className="d-flex align-items-start">
                                                <span
                                                    className="me-2"
                                                    role="img"
                                                    aria-label="information"
                                                    style={{ fontSize: '1.1rem' }}
                                                >
                                                    💡
                                                </span>
                                                <div className="flex-grow-1">{explanation}</div>
                                            </div>
                                        </div>
                                    )}
                                </FormGroup>
                            );
                        })}
                    </Form>
                </div>

                {/* ANSWER SUMMARY BADGE */}
                <div className="text-center my-3">
                    <Badge
                        color={answerStats.isAnswerCorrect ? 'success' : 'danger'}
                        className="py-2 px-4 fs-6 shadow-sm"
                        pill
                    >
                        <i className={`fa ${answerStats.isAnswerCorrect ? 'fa-check-circle' : 'fa-times-circle'} me-2`}></i>
                        {answerStats.isAnswerCorrect ? 'Correct Answer!' : 'Incorrect Answer'}
                    </Badge>

                    {answerStats.totalCorrect > 1 && (
                        <div className="mt-2">
                            <small className="text-muted">
                                Selected {answerStats.correctlyChosen} of {answerStats.totalCorrect} correct answers
                            </small>
                        </div>
                    )}
                </div>

                {/* NAVIGATION ROW */}
                <div className="prevNext d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 gap-3">
                    <Button
                        onClick={handlePrevAnswer}
                        disabled={currentQuestion === 0}
                        className="px-4 py-2 fw-bold shadow-sm"
                        style={{
                            color: 'var(--brand)',
                            backgroundColor: currentQuestion === 0 ? '#e0e0e0' : 'var(--accent)',
                            borderRadius: '8px',
                            cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
                            opacity: currentQuestion === 0 ? 0.6 : 1,
                        }}
                        aria-label="Go to previous question"
                    >
                        <i className="fa fa-arrow-left me-2"></i>
                        Previous
                    </Button>

                    <Button
                        onClick={handleNextAnswer}
                        className="px-4 py-2 fw-bold shadow-sm"
                        style={{
                            color: 'var(--brand)',
                            backgroundColor: 'var(--accent)',
                            borderRadius: '8px',
                        }}
                        aria-label={lastAnswer ? 'End review' : 'Go to next question'}
                    >
                        {lastAnswer ? 'End Review' : 'Next'}
                        <i className="fa fa-arrow-right ms-2"></i>
                    </Button>
                </div>

                {/* KEYBOARD SHORTCUTS HINT */}
                <div className="text-center mt-4">
                    <small className="text-muted fst-italic">
                        💡 Tip: Use keyboard arrows (← →) to navigate between questions
                    </small>
                </div>
            </Col>
        </Row>
    );
};

export default ReviewView;
