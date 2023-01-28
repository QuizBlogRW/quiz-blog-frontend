import React, { useState, useContext } from 'react'
import { connect } from 'react-redux'
import { createNotes } from '../../../redux/notes/notes.actions'
import LoginModal from '../../auth/LoginModal'
import Webmaster from '../../webmaster/Webmaster'
import AddIcon from '../../../images/plus.svg'
import { clearErrors } from '../../../redux/error/error.actions'
import { clearSuccess } from '../../../redux/success/success.actions'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, NavLink, Alert, CustomInput, Progress } from 'reactstrap'
import SpinningBubbles from '../../rLoading/SpinningBubbles'
import { authContext } from '../../../appContexts'

const AddNotesModal = ({ chapter, createNotes, errors, successful, clearErrors, clearSuccess }) => {

    // context
    const auth = useContext(authContext)

    const [notesState, setNotesState] = useState({
        title: '',
        description: '',
        notes_file: ''
    })
    const [progress, setProgress] = useState()

    // Alert
    const [visible, setVisible] = useState(true)
    const onDismiss = () => setVisible(false)

    // Errors state on form
    const [errorsState, setErrorsState] = useState([])

    //properties of the modal
    const [modal, setModal] = useState(false)

    //showing and hiding modal
    const toggle = () => setModal(!modal)

    const onChangeHandler = e => {
        setErrorsState([])
        clearErrors()
        clearSuccess()
        setNotesState({ ...notesState, [e.target.name]: e.target.value })
    }

    const onFileHandler = (e) => {
        setErrorsState([])
        clearErrors()
        clearSuccess()
        setNotesState({ ...notesState, notes_file: e.target.files[0] })
    }

    const onSubmitHandler = e => {
        e.preventDefault()

        const formData = new FormData()
        const { title, description, notes_file } = notesState

        // VALIDATE
        if (title.length < 4 || description.length < 4) {
            setErrorsState(['Insufficient info!'])
            return
        }
        else if (title.length > 80) {
            setErrorsState(['Title is too long!'])
            return
        }
        else if (!chapter) {
            setErrorsState(['The chapter is required!'])
            return
        }
        else if (!notes_file) {
            setErrorsState(['The file is required!'])
            return
        }
        else if (description.length > 200) {
            setErrorsState(['Description is too long!'])
            return
        }

        else if (errors.id === "CREATE_NOTE_FAIL") {
            setErrorsState([errors.msg])
            return
        }

        // Create new Notes object
        formData.append('title', title)
        formData.append('description', description)
        formData.append('notes_file', notes_file)
        formData.append('chapter', chapter._id)
        formData.append('course', chapter.course._id)
        formData.append('courseCategory', chapter.courseCategory)
        formData.append('uploaded_by', auth.user ? auth.user._id : null)

        const onUploadProgress = (data) => {
            //Set the progress value to show the progress bar
            setProgress(Math.round((100 * data.loaded) / data.total))
        }

        // Attempt to create
        createNotes(formData, onUploadProgress)

        setNotesState({
            title: '',
            description: '',
            notes_file: ''
        })
    }
    console.log(auth)
    return (
        auth.isAuthenticated ?

            auth.user.role !== 'Visitor' ?

                <div>
                    <NavLink onClick={toggle} className="text-success p-0">
                        <img src={AddIcon} alt="" width="10" height="10" className="mb-1" />
                        &nbsp;Add Notes
                    </NavLink>

                    <Modal isOpen={modal} toggle={toggle} className="resources-modal">

                        <ModalHeader toggle={toggle} className="bg-primary text-white">
                            Add New Notes
                        </ModalHeader>

                        <ModalBody>

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

                            {progress &&
                                <div className={`${errors.id || successful.msg ? 'd-none' : ''} text-center text-danger font-weight-bolder`}>
                                    {progress - 1}%
                                    <Progress animated color="info" value={progress - 1} className='mb-2' />
                                </div>}

                            <Form onSubmit={onSubmitHandler} encType='multipart/form-data'>

                                <FormGroup>

                                    <Label for="name">
                                        <strong>Title</strong>
                                    </Label>
                                    <Input type="text" name="title" id="name" placeholder="Notes name ..." className="mb-3" value={notesState.title} onChange={onChangeHandler} />

                                    <Label for="description">
                                        <strong>Description</strong>
                                    </Label>
                                    <Input type="text" name="description" id="description" placeholder="Notes description ..." className="mb-3" value={notesState.description} onChange={onChangeHandler} />

                                    <Label for="notes_file" className="my-2">
                                        <strong>Upload</strong>&nbsp;
                                        <small className="text-info">.pdf, .doc, .docx, .ppt, .pptx</small>
                                    </Label>
                                    <CustomInput bsSize="sm" type="file" accept=".pdf, .doc, .docx, .ppt, .pptx" name="notes_file" onChange={onFileHandler} label="Pick a file ..." id="notes_file_pick" required />

                                    <Button color="success" style={{ marginTop: '2rem' }} block >Add</Button>

                                </FormGroup>

                            </Form>
                        </ModalBody>
                    </Modal>
                </div> :

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
    successful: state.successReducer
})

export default connect(mapStateToProps, { createNotes, clearErrors, clearSuccess })(AddNotesModal)