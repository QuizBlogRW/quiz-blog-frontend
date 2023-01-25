import React, { useState, useEffect, useContext } from 'react'
import { Button, Row, Col, Form, FormGroup, Label, Input, CustomInput, Breadcrumb, BreadcrumbItem, Alert, Progress } from 'reactstrap'
import { Link, useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { addChQuestion, deleteChQuestion } from '../../../redux/challenges/challengeQuestions/challengeQuestions.actions'
import { getOneChQuiz } from '../../../redux/challenges/challengeQuizzes/challengeQuizzes.actions'
import { clearErrors } from '../../../redux/error/error.actions'
import { clearSuccess } from '../../../redux/success/success.actions'
import { v4 as uuidv4 } from 'uuid'
import LoginModal from '../../auth/LoginModal'
import Webmaster from '../../webmaster/Webmaster'
import SpinningBubbles from '../../rLoading/SpinningBubbles'
import ChallengeQuestions from './ChallengeQuestions'
import { authContext } from '../../../appContexts'

const EditChallengeQuiz = ({ addChQuestion, deleteChQuestion, getOneChQuiz, oneChQuiz, successful, errors, clearErrors, clearSuccess }) => {

    // Auth context
    const auth = useContext(authContext)

    // Access route parameters
    const { challengeId } = useParams()

    const [progress, setProgress] = useState();

    // Alert
    const [visible, setVisible] = useState(true);
    const onDismiss = () => setVisible(false);

    const [questionText, setQuestionText] = useState({
        questionText: '',
    })

    const [question_image, setQuestion_image] = useState('')

    const [answerOptions, setAnswerOptions] = useState([
        { id: uuidv4(), answerText: '', explanations: '', isCorrect: false },
    ])

    // Errors state on form
    const [errorsState, setErrorsState] = useState([])

    const onQuestionChangeHandler = e => {
        setErrorsState([])
        clearErrors()
        clearSuccess()

        const { name, value } = e.target
        setQuestionText(state => ({ ...state, [name]: value }))
    }

    const onFileHandler = (e) => {
        setErrorsState([])
        clearErrors()
        clearSuccess()
        setQuestion_image(e.target.files[0])
    }

    const handleAnswerChangeInput = (id, event) => {
        setErrorsState([])
        clearErrors()
        clearSuccess()

        const newAnswerOptions = answerOptions.map(i => {
            if (id === i.id) {
                event.target.type === "checkbox" ?
                    i[event.target.name] = event.target.checked :
                    i[event.target.name] = event.target.value
            }
            return i
        })

        setAnswerOptions(newAnswerOptions)
    }

    // Lifecycle methods
    useEffect(() => {
        getOneChQuiz(challengeId)
    }, [getOneChQuiz, challengeId])

    const chCategory = oneChQuiz && oneChQuiz.category && oneChQuiz.category._id

    const handleSubmit = (e) => {
        e.preventDefault()

        const formData = new FormData()
        const trueAnswer = answerOptions.find(ansop => ansop.isCorrect === true ? ansop : null)

        // VALIDATE
        if (!questionText.questionText && !question_image) {
            setErrorsState(['Please give the title or upload question image!'])
            return
        }
        else if (questionText.questionText.length < 4) {
            setErrorsState(['Insufficient info!'])
            return
        }
        else if (questionText.questionText.length > 700) {
            setErrorsState(['Question is too long!'])
            return
        }

        else if (answerOptions.length <= 1) {
            setErrorsState(['Answers are not sufficient!'])
            return
        }

        else if (!trueAnswer) {
            setErrorsState(['Please provide a true answer!'])
            return
        }

        // Create new qn object
        formData.append('questionText', questionText.questionText)
        formData.append('question_image', question_image)
        answerOptions.forEach(aOptn => {
            formData.append('answerOptions', JSON.stringify(aOptn))
        })
        formData.append('category', chCategory)
        formData.append('challengeQuiz', challengeId)
        formData.append('created_by', auth.isLoading === false ? auth.user._id : null)

        const onUploadProgress = (data) => {
            //Set the progress value to show the progress bar
            setProgress(Math.round((100 * data.loaded) / data.total))
        }

        // Attempt to create
        addChQuestion(formData, onUploadProgress)

        // Reset form fields
        setQuestionText({ questionText: '' })
        setQuestion_image('')
        setAnswerOptions([{ id: uuidv4(), answerText: '', explanations: '', isCorrect: false }])
    }

    const handleAddFields = () => {
        setAnswerOptions([...answerOptions, { id: uuidv4(), answerText: '', explanations: '', isCorrect: false }])
    }

    const handleRemoveFields = id => {
        const values = [...answerOptions]
        values.splice(values.findIndex(value => value.id === id), 1)
        setAnswerOptions(values)
    }

    return (
        auth.isAuthenticated ?

            auth.user.role !== 'Visitor' ?

                <>
                    <Form className="my-3 mt-lg-5 mx-3 mx-lg-5 create-question" onSubmit={handleSubmit}>

                        <Row key={oneChQuiz && oneChQuiz._id} className="mb-0 mb-lg-3 mx-0">
                            <Breadcrumb key={oneChQuiz && oneChQuiz._id}>
                                <BreadcrumbItem>
                                    <Link to="/webmaster">
                                        {oneChQuiz && oneChQuiz.category && oneChQuiz && oneChQuiz.category.title} </Link>
                                </BreadcrumbItem>

                                <BreadcrumbItem>
                                    <Link to={`/category/${oneChQuiz && oneChQuiz.category && oneChQuiz && oneChQuiz.category._id}`}>
                                        {oneChQuiz && oneChQuiz.title}({oneChQuiz && oneChQuiz.questions && oneChQuiz && oneChQuiz.questions.length})
                                    </Link>
                                </BreadcrumbItem>

                                <BreadcrumbItem active>Create Question</BreadcrumbItem>
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
                                <small>{errors.msg && errors.msg}</small>
                            </Alert> :
                            successful.id ?
                                <Alert color='success' isOpen={visible} toggle={onDismiss} className='border border-warning'>
                                    <small>{successful.msg && successful.msg}</small>
                                </Alert> : null
                        }

                        <FormGroup row className="mx-0">
                            <Label sm={2}>Question</Label>
                            <Col sm={10}>
                                <Input type="text" name="questionText" value={questionText.questionText || ""} placeholder="Question here ..." onChange={onQuestionChangeHandler} required />
                            </Col>
                        </FormGroup>

                        <FormGroup row className="mx-0">
                            <Label sm={2} for="question_image">
                                <strong>Upload</strong>&nbsp;
                                <small className="text-info">.jpg, .png, .jpeg, .svg</small>
                            </Label>
                            <Col sm={10}>
                                <CustomInput bsSize="sm" type="file" accept=".jpg, .png, .jpeg, .svg" name="question_image" onChange={onFileHandler} label="Pick an image ..." id="question_image_pick" required />
                            </Col>
                        </FormGroup>

                        {answerOptions.map(answerOption => (

                            <div key={answerOption.id}>

                                <FormGroup row className="mx-0">
                                    <Label sm={2}>Answer</Label>

                                    <Col sm={10} xl={7}>
                                        <Input type="text" name="answerText" value={answerOption.answerText}
                                            onChange={event => handleAnswerChangeInput(answerOption.id, event)} id="exampleanswer" placeholder="Answer here ..." required />
                                    </Col>

                                    <Col sm={6} xl={2} className="my-3 my-sm-2 d-sm-flex justify-content-around">
                                        <CustomInput type="checkbox" name="isCorrect" value={answerOption.isCorrect}
                                            onChange={event => handleAnswerChangeInput(answerOption.id, event)} id={answerOption.id} label="Is Correct?" required />
                                    </Col>

                                    <Col sm={6} xl={1} className="my-3 my-sm-2">
                                        <Button className="px-2 py-1" disabled={answerOptions.length === 1} color="danger" onClick={() => handleRemoveFields(answerOption.id)}> - </Button>{' '}
                                        <Button className="px-2 py-1" color="danger" onClick={handleAddFields}> + </Button>{' '}
                                    </Col>

                                    <Label sm={2}>Rationale</Label>

                                    <Col sm={10} xl={7}>
                                        <Input type="textarea" name="explanations" placeholder="Rationales or explanations ..." minLength="5" maxLength="1000" onChange={event => handleAnswerChangeInput(answerOption.id, event)} value={answerOption.explanations} />
                                    </Col>

                                </FormGroup>

                            </div>

                        ))}

                        <FormGroup check row className="mx-0 pl-3">
                            <Col sm={{ size: 10, offset: 2 }} className="pl-0">
                                <Button className="btn btn-info btn-sm" type="submit" onClick={handleSubmit}>Add New</Button>
                            </Col>
                        </FormGroup>

                    </Form>
                    <ChallengeQuestions oneChQuiz={oneChQuiz} deleteChQuestion={deleteChQuestion} />
                </> :
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
    errors: state.errorReducer,
    successful: state.successReducer,
    oneChQuiz: state.challengeQuizesReducer.oneChQuiz
})

export default connect(mapStateToProps, { addChQuestion, deleteChQuestion, getOneChQuiz, clearErrors, clearSuccess })(EditChallengeQuiz)