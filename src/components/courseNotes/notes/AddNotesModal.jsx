import React, { useState, useContext } from 'react'
import { createNotes } from '../../../redux/slices/notesSlice'
import AddIcon from '../../../images/plus.svg'
import { clearErrors } from '../../../redux/slices/errorSlice'
import { clearSuccess } from '../../../redux/slices/successSlice'
import { useDispatch } from 'react-redux'
import { Button, Modal, ModalBody, Form, FormGroup, Label, NavLink, Input } from 'reactstrap'
import { currentUserContext } from '../../../appContexts'
import Notification from '../../../utils/Notification'

const AddNotesModal = ({ chapter }) => {

    // Redux
    const dispatch = useDispatch()

    // context
    const currentUser = useContext(currentUserContext)

    const [notesState, setNotesState] = useState({
        title: '',
        description: '',
        notes_file: ''
    })
    const [progress, setProgress] = useState()

    // Errors state on form
    const [errorsState, setErrorsState] = useState([])

    //properties of the modal
    const [modal, setModal] = useState(false)

    //showing and hiding modal
    const toggle = () => setModal(!modal)

    const onChangeHandler = e => {
        setErrorsState([])
        dispatch(clearErrors())
        dispatch(clearSuccess())
        setNotesState({ ...notesState, [e.target.name]: e.target.value })
    }

    const onFileHandler = (e) => {
        setErrorsState([])
        dispatch(clearErrors())
        dispatch(clearSuccess())
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

        // Create new Notes object
        formData.append('title', title)
        formData.append('description', description)
        formData.append('notes_file', notes_file)
        formData.append('chapter', chapter._id)
        formData.append('course', chapter.course._id)
        formData.append('courseCategory', chapter.courseCategory)
        formData.append('uploaded_by', currentUser ? currentUser._id : null)

        const onUploadProgress = (data) => {
            //Set the progress value to show the progress bar
            setProgress(Math.round((100 * data.loaded) / data.total))
        }

        // Attempt to create
        dispatch(createNotes(formData, onUploadProgress))

        setNotesState({
            title: '',
            description: '',
            notes_file: ''
        })
    }

    return (
        <div>
            <NavLink onClick={toggle} className="text-success p-0">
                <img src={AddIcon} alt="" width="10" height="10" className="mb-1" />
                &nbsp;Add Notes
            </NavLink>

            <Modal isOpen={modal} toggle={toggle} className="resources-modal">
                <div className="d-flex justify-content-between align-items-center p-2" style={{ backgroundColor: "#157A6E", color: "#fff" }}>
                    Add New Notes
                    <Button className="btn-danger text-uppercase text-red" style={{ padding: "0.1rem 0.3rem", fontSize: ".6rem", fontWeight: "bold" }} onClick={toggle}>
                        X
                    </Button>
                </div>

                <ModalBody>
                    <Notification errorsState={errorsState} progress={progress} initFn="createNotes" />
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
                            <Input bsSize="sm" type="file" accept=".pdf, .doc, .docx, .ppt, .pptx" name="notes_file" onChange={onFileHandler} label="Pick a file ..." id="notes_file_pick" required />

                            <Button color="success" style={{ marginTop: '2rem' }} block >Add</Button>

                        </FormGroup>
                    </Form>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default AddNotesModal