import React from 'react'
import { Col, Row, Button, Badge, Form, Input, FormGroup, FormFeedback } from 'reactstrap';

const ReviewView = ({ qnsAll, curRevQn, lastAnswer, currentQuestion, setLastAnswer, setCurrentQuestion }) => {

    const curRevQnOpts = curRevQn && curRevQn.answerOptions
    const trueAnsNbr = curRevQnOpts && curRevQnOpts.filter(aOpt => aOpt.isCorrect === true).length
    const trueChoicesNbr = curRevQnOpts && curRevQnOpts.filter(aOpt => aOpt.isCorrect === true && aOpt.choosen === true).length

    const handleNextAnswer = () => {
        const nextQuestion = currentQuestion + 1;
        nextQuestion < qnsAll.length ?
            setCurrentQuestion(nextQuestion) :
            setLastAnswer(true)
    };

    const handlePrevAnswer = () => {
        const prevQuestion = currentQuestion - 1;
        prevQuestion >= 0 ?
            setCurrentQuestion(prevQuestion) :
            alert('No previous available!')
    };

    return (
        <Row>
            <Col>
                <div className='answer d-flex flex-column mx-auto mt-2 w-100'>
                    <Form>

                        {curRevQnOpts && curRevQnOpts.map((answerOption, index) => (
                            <FormGroup key={index}>
                                <Input
                                    disabled
                                    defaultValue={answerOption.answerText}
                                    valid={answerOption.isCorrect}
                                    invalid={!answerOption.isCorrect && answerOption.choosen}
                                    className={`bg-white 
                                    ${!answerOption.isCorrect && !answerOption.choosen ?
                                            'border border-secondary' :
                                            null}`}
                                />
                                <FormFeedback
                                style={{fontSize: ".7rem"}}
                                    valid={answerOption.isCorrect}
                                    invalid={(!answerOption.isCorrect && answerOption.choosen).toString()}>
                                    {answerOption.isCorrect && answerOption.choosen ? 'You got this right!' :
                                        !answerOption.isCorrect && answerOption.choosen ? 'Your choice was incorrect!' :
                                            answerOption.isCorrect ? 'Correct answer!' : null}
                                </FormFeedback>
                                {answerOption.explanations ?
                                    <div className="border rounded p-1 p-lg-2 mt-2">
                                        <small className="text-dark mb-1 pl-1" style={{fontSize: ".8rem"}}>
                                            👉 {answerOption.explanations}
                                        </small>
                                    </div> :
                                    null}
                            </FormGroup>
                        ))}
                    </Form>
                </div>

                <div className="prevNext d-flex justify-content-between align-items-center mt-5">
                    <Button color="info" className="ml-0 ml-md-5 p-1 px-md-2" onClick={handlePrevAnswer}>Previous</Button>
                    <Badge href="#" color={trueAnsNbr === trueChoicesNbr ? 'success' : 'danger'}>
                        {`Your answer was ${trueAnsNbr === trueChoicesNbr ? 'correct' : 'incorrect'}`}
                    </Badge>
                    <Button color="info" className="mr-0 mr-md-5 p-1 px-md-2" onClick={handleNextAnswer}>
                        {lastAnswer ? 'End' : 'Next'}</Button>
                </div>
            </Col>
        </Row>
    )
}

export default ReviewView