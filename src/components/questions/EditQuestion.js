import React, { useState, useEffect, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button, Row, Col, Form, FormGroup, Label, Input, CustomInput, Breadcrumb, BreadcrumbItem, Alert, Progress } from 'reactstrap'
import LoginModal from '../auth/LoginModal'
import Webmaster from '../webmaster/Webmaster'
import { connect } from 'react-redux'
import { getOneQuestion, updateQuestion } from '../../redux/questions/questions.actions'
import { clearErrors } from '../../redux/error/error.actions'
import { clearSuccess } from '../../redux/success/success.actions'
import SpinningBubbles from '../rLoading/SpinningBubbles'
import { authContext } from '../../appContexts'

const EditQuestion = ({ updateQuestion, quest, getOneQuestion, successful, clearErrors, clearSuccess, errors }) => {

    const auth = useContext(authContext)

    // Access route parameters & history
    const { questionId } = useParams()

    const [progress, setProgress] = useState()

    // Alert
    const [visible, setVisible] = useState(true)
    const onDismiss = () => setVisible(false)

    // Errors state on form
    const [errorsState, setErrorsState] = useState([])

    // Lifecycle methods
    useEffect(() => {
        getOneQuestion(questionId)
    }, [getOneQuestion, questionId])

    const thisQnCat = quest && quest.category
    const thisQnQZ = quest && quest.quiz

    const [questionTextState, setQuestionTextState] = useState()
    useEffect(() => { setQuestionTextState({ questionText: quest && quest.questionText }) }, [quest])

    const [question_image, setQuestion_image] = useState('')
    useEffect(() => { setQuestion_image(quest && quest.question_image) }, [quest])

    const [durationState, setDurationState] = useState()
    useEffect(() => { setDurationState({ duration: quest && quest.duration }) }, [quest])

    const [answerOptionsState, setAnswerOptionsState] = useState(quest && quest.answerOptions)
    useEffect(() => { setAnswerOptionsState(quest && quest.answerOptions) }, [quest])

    const onQuestionChangeHandler = e => {
        const { name, value } = e.target
        setQuestionTextState(questionTextState => ({ ...questionTextState, [name]: value }))
    }

    const onFileHandler = (e) => {
        setErrorsState([])
        clearErrors()
        clearSuccess()
        setQuestion_image(e.target.files[0])
    }

    const onDurationChangeHandler = e => {
        const { name, value } = e.target
        setDurationState(durationState => ({ ...durationState, [name]: value }))
    }

    const handleAnswerChangeInput = (id, event) => {
        const updatedAnswerOptions = answerOptionsState && answerOptionsState.map(oneAnswer => {

            if (id === oneAnswer._id) {

                event.target.type === "checkbox" ?
                    oneAnswer[event.target.name] = event.target.checked :
                    oneAnswer[event.target.name] = event.target.value
            }
            return oneAnswer
        })

        setAnswerOptionsState((updatedAnswerOptions))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const formData = new FormData()

        // VALIDATE
        if (questionTextState.questionText.length < 4) {
            setErrorsState(['Insufficient info!'])
            return
        }
        else if (questionTextState.questionText.length > 700) {
            setErrorsState(['Question is too long!'])
            return
        }

        else if (answerOptionsState.length <= 1) {
            alert('Answers are not sufficient!')
            return
        }

        formData.append('qtId', questionId)
        formData.append('questionText', questionTextState.questionText)
        formData.append('question_image', question_image)
        answerOptionsState.forEach(aOptn => {
            formData.append('answerOptions', JSON.stringify(aOptn))
        })
        formData.append('last_updated_by', auth.isLoading === false ? auth.user._id : null)
        formData.append('duration', durationState.duration)

        const onUploadProgress = (data) => {
            //Set the progress value to show the progress bar
            setProgress(Math.round((100 * data.loaded) / data.total))
        }

        updateQuestion(questionId, formData, onUploadProgress)
    }

    const handleAddFields = () => {
        setAnswerOptionsState([...answerOptionsState, { answerText: '', explanations: '', isCorrect: false }])
    }

    const handleRemoveFields = _id => {

        const values = [...answerOptionsState]
        values.splice(values.findIndex(value => value._id === _id), 1)

        setAnswerOptionsState(values)
    }

    return (
        auth.isAuthenticated ?

            auth.user.role !== 'Visitor' ?

                <Form className="my-3 mt-lg-5 mx-3 mx-lg-5 edit-question" onSubmit={handleSubmit}>

                    <Row className="mb-0 mb-lg-3 mx-0">
                        <Breadcrumb>
                            <BreadcrumbItem>
                                <Link to={`/category/${thisQnCat && thisQnCat._id}`}>
                                    {thisQnCat && thisQnCat.title}
                                </Link>
                            </BreadcrumbItem>

                            <BreadcrumbItem>
                                <Link to={`/view-quiz/${thisQnQZ && thisQnQZ.slug}`}>
                                    {thisQnQZ && thisQnQZ.title}
                                </Link>
                            </BreadcrumbItem>

                            <BreadcrumbItem active>Edit Question</BreadcrumbItem>
                        </Breadcrumb>
                    </Row>

                    {progress &&
                        <div className={`${errors.id || successful.msg ? 'd-none' : ''} text-center text-danger font-weight-bolder`}>
                            {progress - 1}%
                            <Progress animated color="info" value={progress - 1} className='mb-2' />
                        </div>}

                    {/* Error frontend*/}
                    {errorsState.length > 0 ?
                        errorsState.map(err =>
                            <Alert color="danger" isOpen={visible} toggle={onDismiss} key={Math.floor(Math.random() * 1000)} className='border border-warning'>
                                {err}
                            </Alert>) :
                        null
                    }

                    {/* Error backend */}
                    {errors.id ?
                        <Alert isOpen={visible} toggle={onDismiss} color='danger'>
                            <small>{errors.msg && errors.msg.msg}</small>
                        </Alert> :
                        successful.id ?
                            <Alert color='success' isOpen={visible} toggle={onDismiss} className='border border-warning'>
                                <small>{successful.msg && successful.msg}</small>
                            </Alert> : null
                    }

                    <FormGroup row className="mx-0">
                        <Label sm={2}>Question Edit</Label>
                        <Col sm={10}>
                            <Input type="text" name="questionText" value={questionTextState && questionTextState.questionText} placeholder="Question here ..." onChange={onQuestionChangeHandler} required />
                        </Col>
                    </FormGroup>

                    <FormGroup row className="mx-0">
                        {question_image &&
                            <Col sm={12}>
                                <div className="my-3 mx-sm-5 px-sm-5 d-flex justify-content-center align-items-center">
                                    <img className="w-100 my-2 mt-lg-0" src={question_image} alt="Question Illustration" />
                                </div>
                            </Col>}

                        <Col sm={12}>
                            <CustomInput bsSize="sm" type="file" accept=".jpg, .png, .jpeg, .svg" name="question_image" onChange={onFileHandler} label="Pick an image ..." id="question_image_pick" required />
                        </Col>
                    </FormGroup>

                    <FormGroup row className="mx-0">
                        <Label sm={2}>Question Duration</Label>
                        <Col sm={3}>
                            <Input type="number" name="duration" value={durationState && durationState.duration} placeholder="Time in seconds ..." onChange={onDurationChangeHandler} required />
                        </Col>
                    </FormGroup>

                    {answerOptionsState && answerOptionsState.map(answerOption => (

                        <div key={answerOption._id}>

                            <FormGroup row className="mx-0">
                                <Label sm={2}>Answer</Label>

                                <Col sm={10} xl={7}>
                                    <Input type="text" name="answerText" value={answerOption.answerText}
                                        onChange={event => handleAnswerChangeInput(answerOption._id, event)} placeholder="Answer here ..." required />
                                </Col>

                                <Col sm={6} xl={2} className="my-3 my-sm-2 d-sm-flex justify-content-around">
                                    <CustomInput type="checkbox" name="isCorrect" value={answerOption.isCorrect}
                                        onChange={event => handleAnswerChangeInput(answerOption._id, event)} id={answerOption._id} label="Is Correct?" required checked={answerOption.isCorrect} />
                                </Col>

                                <Col sm={6} xl={1} className="my-3 my-sm-2">
                                    <Button className="px-2 py-1" disabled={answerOptionsState.length === 1} color="danger" onClick={() => handleRemoveFields(answerOption._id)}> - </Button>{' '}
                                    <Button className="px-2 py-1" color="danger" onClick={handleAddFields}> + </Button>{' '}
                                </Col>

                                <Label sm={2}>Rationale</Label>

                                <Col sm={10} xl={7}>
                                    <Input type="textarea" name="explanations" placeholder="Rationales or explanations ..." minLength="5" maxLength="1000" onChange={event => handleAnswerChangeInput(answerOption._id, event)} value={answerOption.explanations} />
                                </Col>

                            </FormGroup>

                        </div>

                    ))}

                    <FormGroup check row className="mx-0">
                        <Col sm={{ size: 10, offset: 2 }} className="pl-0">
                            <Button className="btn btn-info btn-sm" type="submit" onClick={handleSubmit}>Update</Button>
                        </Col>
                    </FormGroup>

                </Form> :

                <Webmaster /> :

            // If not authenticated or loading
            <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
                {
                    auth.isLoading ?
                        <SpinningBubbles /> :
                        <LoginModal
                            textContent={'Login first'}
                            textColor={'text-danger font-weight-bolder my-5 border rounded'} />
                }
            </div>
    )
}

// Map the question to state props
const mapStateToProps = state => ({
    quest: state.questionsReducer.oneQuestion,
    errors: state.errorReducer,
    successful: state.successReducer
})

export default connect(mapStateToProps, { updateQuestion, getOneQuestion, clearErrors, clearSuccess })(EditQuestion)