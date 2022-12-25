import React, { useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, NavLink, Alert } from 'reactstrap'
import { connect } from 'react-redux'
import { clearErrors } from '../../redux/error/error.actions'
import { clearSuccess } from '../../redux/success/success.actions'
import { addVidLink } from '../../redux/quizes/quizes.actions'
import { addFaqVidLink } from '../../redux/faqs/faqs.actions'

const AddVideo = ({ addVidLink, addFaqVidLink, isFromFaqs, faqID, quizID, errors, successful, clearErrors, clearSuccess }) => {

    const [vidLinkState, setVidLinkState] = useState({
        vtitle: '',
        vlink: ''
    })

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
            addFaqVidLink(newVidLink, faqID) :
            addVidLink(newVidLink, quizID)

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

                <ModalHeader toggle={toggle} className="bg-primary text-white">
                    Add a YouTube Video Link
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

// Map  state props
const mapStateToProps = state => ({
    errors: state.errorReducer,
    successful: state.successReducer
})

export default connect(mapStateToProps, { addVidLink, addFaqVidLink, clearErrors, clearSuccess })(AddVideo)