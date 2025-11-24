import { Col, Row, Button, Badge, Form, Input, FormGroup, FormFeedback } from 'reactstrap';

const ReviewView = ({ qnsAll, curRevQn, lastAnswer, currentQuestion, setLastAnswer, setCurrentQuestion }) => {

    const curRevQnOpts = curRevQn && curRevQn.answerOptions;
    const trueAnsNbr = curRevQnOpts?.filter(aOpt => aOpt.isCorrect).length;
    const trueChoicesNbr = curRevQnOpts?.filter(aOpt => aOpt.isCorrect && aOpt.choosen).length;

    const handleNextAnswer = () => {
        const next = currentQuestion + 1;
        next < qnsAll.length ? setCurrentQuestion(next) : setLastAnswer(true);
    };

    const handlePrevAnswer = () => {
        const prev = currentQuestion - 1;
        prev >= 0 ? setCurrentQuestion(prev) : alert('No previous available!');
    };

    return (
        <Row>
            <Col>
                <div className="answer d-flex flex-column mx-auto mt-3 w-100">

                    <Form className="mt-2">
                        {curRevQnOpts?.map((answerOption, index) => {

                            let explanation = answerOption.explanations || null;

                            if (explanation) {
                                explanation = explanation.split(' ').map((word, i) =>
                                    word.startsWith('http') ? (
                                        <a key={i} href={word} target="_blank" rel="noreferrer">{word} </a>
                                    ) : (
                                        word + ' '
                                    )
                                );
                            }

                            return (
                                <FormGroup key={index} className="mb-3">

                                    {/* ANSWER INPUT */}
                                    <Input
                                        disabled
                                        defaultValue={answerOption.answerText}
                                        valid={answerOption.isCorrect}
                                        invalid={!answerOption.isCorrect && answerOption.choosen}
                                        className={`shadow-sm p-2 rounded-3 ${!answerOption.isCorrect && !answerOption.choosen
                                                ? 'border border-secondary'
                                                : ''
                                            }`}
                                        style={{
                                            backgroundColor: '#F5F5F5',
                                            color: '#000',
                                            fontWeight: '500',
                                        }}
                                    />

                                    {/* FEEDBACK TEXT */}
                                    <FormFeedback
                                        style={{ fontSize: '.8rem' }}
                                        valid={answerOption.isCorrect}
                                        invalid={(!answerOption.isCorrect && answerOption.choosen).toString()}
                                    >
                                        {answerOption.isCorrect && answerOption.choosen
                                            ? 'You got this right!'
                                            : !answerOption.isCorrect && answerOption.choosen
                                                ? 'Your choice was incorrect!'
                                                : answerOption.isCorrect
                                                    ? 'Correct answer!'
                                                    : null}
                                    </FormFeedback>

                                    {/* EXPLANATION BOX */}
                                    {explanation && (
                                        <div
                                            className="border rounded-3 mt-2 shadow-sm bg-white p-2 px-lg-3"
                                            style={{
                                                fontSize: '.85rem',
                                                lineHeight: '1.4rem'
                                            }}
                                        >
                                            <span role="img" aria-label="pointing">👉</span> {explanation}
                                        </div>
                                    )}
                                </FormGroup>
                            );
                        })}
                    </Form>
                </div>

                {/* NAVIGATION ROW */}
                <div className="prevNext d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 gap-3">

                    <Button
                        onClick={handlePrevAnswer}
                        className="px-4 py-2 fw-bold shadow-sm"
                        style={{
                            color: 'var(--brand)',
                            backgroundColor: 'var(--accent)',
                            borderRadius: '8px'
                        }}
                    >
                        Previous
                    </Button>

                    <Badge
                        color={trueAnsNbr === trueChoicesNbr ? 'success' : 'danger'}
                        className="py-2 px-3 fs-6 shadow-sm"
                        pill
                    >
                        {`Your answer was ${trueAnsNbr === trueChoicesNbr ? 'correct' : 'incorrect'}`}
                    </Badge>

                    <Button
                        onClick={handleNextAnswer}
                        className="px-4 py-2 fw-bold shadow-sm"
                        style={{
                            color: 'var(--brand)',
                            backgroundColor: 'var(--accent)',
                            borderRadius: '8px'
                        }}
                    >
                        {lastAnswer ? 'End' : 'Next'}
                    </Button>
                </div>
            </Col>
        </Row>
    );
};

export default ReviewView;
