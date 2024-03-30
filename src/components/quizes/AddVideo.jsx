import React, { useState } from 'react'
import { Button, Modal, ModalBody, Form, FormGroup, Label, Input, NavLink } from 'reactstrap'
import { clearErrors } from '../../redux/slices/errorSlice'
import { clearSuccess } from '../../redux/slices/successSlice'
import { addVidLink } from '../../redux/slices/quizesSlice'
import { addFaqVidLink } from '../../redux/slices/faqsSlice'
import { useDispatch } from 'react-redux'
import Notification from '../../utils/Notification'

const AddVideo = ({ isFromFaqs, faqID, quizID }) => {

    // Redux
    const dispatch = useDispatch()

    const [vidLinkState, setVidLinkState] = useState({
        vtitle: '',
        vlink: ''
    })

    // Errors state on form
    const [errorsState, setErrorsState] = useState([])

    //properties of the modal
    const [modal, setModal] = useState(false)

    //showing and hiding modal
    const toggle = () => setModal(!modal)

    const onChangeHandler = e => {
        dispatch(clearErrors())
        dispatch(clearSuccess())
        setVidLinkState({ ...vidLinkState, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = e => {
        e.preventDefault()

        const { vtitle, vlink } = vidLinkState

        // VALIDATE
        if (vtitle.length < 4 || vlink.length < 4) {
            setErrorsState(['Insufficient info!'])
            return
        }
        else if (vtitle.length > 200) {
            setErrorsState(['Title is too long!'])
            return
        }
        else if (vlink.length > 1000) {
            setErrorsState(['Link is too long!'])
            return
        }

        // Create new object
        const newVidLink = {
            vtitle,
            vlink
        }

        // Attempt to create
        isFromFaqs ?
            dispatch(addFaqVidLink(newVidLink, faqID)) :
            dispatch(addVidLink(newVidLink, quizID))

        setVidLinkState({
            vtitle: '',
            vlink: ''
        })
    }

    return (
        <div>
            <NavLink onClick={toggle} className="text-success p-1 border rounded  border-warning">
                <b>+</b>Video
            </NavLink>

            <Modal isOpen={modal} toggle={toggle}>

                <div className="d-flex justify-content-between align-items-center p-2" style={{ backgroundColor: "#157A6E", color: "#fff" }}>
                    Add a YouTube Video Link
                    <Button className="btn-danger text-uppercase text-red" style={{ padding: "0.1rem 0.3rem", fontSize: ".6rem", fontWeight: "bold" }} onClick={toggle}>
                        X
                    </Button>
                </div>

                <ModalBody>
                    <Notification errorsState={errorsState} progress={null} initFn="addVidLink" />

                    <Form onSubmit={onSubmitHandler}>

                        <FormGroup>

                            <Label for="vtitle">
                                <strong>Title</strong>
                            </Label>

                            <Input type="text" name="vtitle" placeholder="Video Title ..." className="mb-3" onChange={onChangeHandler} value={vidLinkState.vtitle} />

                            <Label for="vlink">
                                <strong>Link</strong>
                            </Label>

                            <Input type="text" name="vlink" placeholder="Video link ..." className="mb-3" onChange={onChangeHandler} value={vidLinkState.vlink} />

                            <Button color="success" style={{ marginTop: '2rem' }} block >Add Link</Button>

                        </FormGroup>

                    </Form>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default AddVideo