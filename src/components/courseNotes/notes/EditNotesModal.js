import React, { useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, CustomInput, NavLink, Alert, Progress } from 'reactstrap'
import LoginModal from '../../auth/LoginModal'
import Webmaster from '../../webmaster/Webmaster'
import { clearErrors } from '../../../redux/error/error.actions'
import { clearSuccess } from '../../../redux/success/success.actions'
import { connect } from 'react-redux'
import { updateNotes } from '../../../redux/notes/notes.actions'
import EditIcon from '../../../images/edit.svg'
import SpinningBubbles from '../../rLoading/SpinningBubbles'

const EditNotesModal = ({ idToUpdate, editTitle, editDesc, auth, updateNotes, errors, successful, clearErrors, clearSuccess }) => {

    const [notesState, setNotesState] = useState({
        idToUpdate,
        name: editTitle,
        description: editDesc,
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
        const { idToUpdate, name, description, notes_file } = notesState

        // VALIDATE
        if (name.length < 4 || description.length < 4) {
            setErrorsState(['Insufficient info!'])
            return
        }
        else if (name.length > 80) {
            setErrorsState(['Title is too long!'])
            return
        }
        else if (description.length > 200) {
            setErrorsState(['Description is too long!'])
            return
        }

        // Create Notes object
        formData.append('title', name)
        formData.append('description', description)
        formData.append('notes_file', notes_file)

        const onUploadProgress = (data) => {
            //Set the progress value to show the progress bar
            setProgress(Math.round((100 * data.loaded) / data.total))
        }

        // Attempt to update
        updateNotes(formData, idToUpdate, onUploadProgress)
    }

    return (
        auth.isAuthenticated ?

            auth.user.role !== 'Visitor' ?

                <div>
                    <NavLink onClick={toggle} className="text-dark p-0">
                        <img src={EditIcon} alt="" width="16" height="16" />
                    </NavLink>

                    <Modal
                        // Set it to the state of modal true or false
                        isOpen={modal}
                        toggle={toggle}
                    >

                        <ModalHeader toggle={toggle} className="bg-primary text-white">Edit Notes</ModalHeader>

                        <ModalBody>

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

                            <Form onSubmit={onSubmitHandler}>

                                <FormGroup>

                                    <Label for="name">
                                        <strong>Title</strong>
                                    </Label>

                                    <Input type="text" name="name" id="name" placeholder="Notes title ..." className="mb-3" onChange={onChangeHandler} value={notesState.name} />

                                    <Label for="description">
                                        <strong>Description</strong>
                                    </Label>

                                    <Input type="text" name="description" id="description" placeholder="Notes description ..." className="mb-3" onChange={onChangeHandler} value={notesState.description} />

                                    <Label for="notes_file" className="my-2">
                                        <strong>Upload</strong>&nbsp;
                                        <small className="text-info">.pdf, .doc, .docx, .ppt, .pptx</small>
                                    </Label>

                                    <CustomInput bsSize="sm" type="file" accept=".pdf, .doc, .docx, .ppt, .pptx" name="notes_file" onChange={onFileHandler} label="Pick a file ..." id="notes_file_pick" />

                                    <Button color="success" style={{ marginTop: '2rem' }} block>
                                        Update
                                    </Button>

                                </FormGroup>

                            </Form>
                        </ModalBody>
                    </Modal>
                </div> :

                <Webmaster auth={auth} /> :

            // If not authenticated or loading
            <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
                {
                    auth.isLoading ?
                        <SpinningBubbles /> :
                        <LoginModal
                            textContent={'Login first'}
                            textColor={'text-danger font-weight-bolder my-5 border rounded'}
                            isAuthenticated={auth.isAuthenticated} />
                }
            </div>
    )
}

// Map the question to state props
const mapStateToProps = state => ({
    errors: state.errorReducer,
    successful: state.successReducer
})


export default connect(mapStateToProps, { updateNotes, clearErrors, clearSuccess })(EditNotesModal)