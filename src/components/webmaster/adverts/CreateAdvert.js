import React, { useState, useContext } from 'react'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, NavLink, CustomInput } from 'reactstrap'
import LoginModal from '../../auth/LoginModal'
import { clearErrors } from '../../../redux/error/error.actions'
import { clearSuccess } from '../../../redux/success/success.actions'
import { connect } from 'react-redux'
import { createAdvert } from '../../../redux/adverts/adverts.actions'
import Webmaster from '../Webmaster'
import SpinningBubbles from '../../rLoading/SpinningBubbles'
import Notification from '../../categories/Notification'
import { authContext } from '../../../appContexts'

const CreateAdvert = ({ clearErrors, clearSuccess, createAdvert }) => {

    // context
    const auth = useContext(authContext)

    const [advertState, setAdvertState] = useState({
        caption: '',
        phone: '',
        owner: '',
        email: '',
        advert_image: '',
    })

    // progress
    const [progress, setProgress] = useState(false)

    // Errors state on form
    const [errorsState, setErrorsState] = useState([])

    //properties of the modal
    const [modal, setModal] = useState(false)

    //showing and hiding modal
    const toggle = () => setModal(!modal)

    const onChangeHandler = e => {
        // Remove errors
        setErrorsState([])
        clearErrors()
        clearSuccess()
        // Add data
        setAdvertState({ ...advertState, [e.target.name]: e.target.value })
    }

    const onFileHandler = (e) => {
        setErrorsState([])
        clearErrors()
        clearSuccess()
        setAdvertState({ ...advertState, advert_image: e.target.files[0] })
    }

    const onSubmitHandler = e => {
        e.preventDefault()

        const { caption, phone, owner, email, advert_image } = advertState

        const formData = new FormData()

        // VALIDATE
        if (caption.length < 4 || phone.length < 4 || owner.length < 4 || email.length < 4) {
            setErrorsState(['Insufficient info!'])
            return
        }

        // Create new Notes object
        formData.append('caption', caption)
        formData.append('phone', phone)
        formData.append('owner', owner)
        formData.append('email', email)
        formData.append('advert_image', advert_image)

        const onUploadProgress = (data) => {
            //Set the progress value to show the progress bar
            setProgress(Math.round((100 * data.loaded) / data.total))
        }

        // Attempt to create
        createAdvert(formData, onUploadProgress)

        // Reset the form
        setAdvertState({
            caption: '',
            phone: '',
            owner: '',
            email: '',
            advert_image: '',
        })

        // Display the progress bar
        setProgress(true)
    }

    return (
        auth.isAuthenticated ?

            auth.user.role !== 'Visitor' ?

                <div>
                    <NavLink onClick={toggle} className="text-success p-0"><b>+</b> Create Advert</NavLink>

                    <Modal isOpen={modal} toggle={toggle}>
                        <ModalHeader toggle={toggle} className="bg-primary text-white">
                            Create Advert
                        </ModalHeader>

                        <ModalBody>

                            <Notification errorsState={errorsState} progress={progress} />

                            <Form onSubmit={onSubmitHandler}>

                                <FormGroup>

                                    <Label for="name">
                                        <strong>Caption</strong>
                                    </Label>

                                    <Input type="text" name="caption" placeholder="Advert caption ..." className="mb-3" onChange={onChangeHandler} value={advertState.caption} />

                                    <Label for="owner">
                                        <strong>Owner</strong>
                                    </Label>

                                    <Input type="text" name="owner" placeholder="Advert owner ..." className="mb-3" onChange={onChangeHandler} value={advertState.owner} />

                                    <Label for="email">
                                        <strong>Email</strong>
                                    </Label>

                                    <Input type="text" name="email" placeholder="Email ..." className="mb-3" onChange={onChangeHandler} value={advertState.email} />


                                    <Label for="phone">
                                        <strong>Phone</strong>
                                    </Label>

                                    <Input type="text" name="phone" placeholder="Phone ..." className="mb-3" onChange={onChangeHandler} value={advertState.phone} />

                                    <Label for="advert_image">
                                        <strong>Image</strong>
                                        <small className="text-info"> (.jpg, .jpeg, .png, .svg)</small>
                                    </Label>

                                    <CustomInput bsSize="sm" type="file" accept=".jpg, .jpeg, .png, .svg" name="advert_image" onChange={onFileHandler} label="Choose an image to upload ..." id="advert_image_pick" />

                                    <Button color="success" style={{ marginTop: '2rem' }} block >
                                        Create
                                    </Button>

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


export default connect(null, { createAdvert, clearErrors, clearSuccess })(CreateAdvert)