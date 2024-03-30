import React, { useState } from 'react'
import { Button, Form, FormGroup, Label, Input, Alert, Progress } from 'reactstrap'
import { clearErrors } from '../../../redux/slices/errorSlice'
import { clearSuccess } from '../../../redux/slices/successSlice'
import { createImageUpload } from '../../../redux/slices/imageUploadsSlice'
import { useSelector, useDispatch } from "react-redux"

const UploadPostPhotos = ({ currentUser }) => {

    const errors = useSelector(state => state.error)
    const successful = useSelector(state => state.success)

    const dispatch = useDispatch()

    const [imageDetailsState, setImageDetailsState] = useState({
        imageTitle: '',
        owner: currentUser._id
    })

    const [uploadImage, setUploadImage] = useState('')
    const [progress, setProgress] = useState()

    // Alert
    const [visible, setVisible] = useState(true)
    const onDismiss = () => setVisible(false)

    // Errors state on form
    const [errorsState, setErrorsState] = useState([])

    const onChangeHandler = e => {
        dispatch(clearErrors())
        dispatch(clearSuccess())
        setImageDetailsState({ ...imageDetailsState, [e.target.name]: e.target.value })
    }

    const onFileHandler = (e) => {
        setErrorsState([])
        dispatch(clearErrors())
        dispatch(clearSuccess())
        setUploadImage(e.target.files[0])
    }

    const onSubmitHandler = e => {
        e.preventDefault()

        const formData = new FormData()
        const { imageTitle, owner } = imageDetailsState

        // VALIDATE
        if (imageTitle.length < 4) {
            setErrorsState(['Insufficient info!'])
            return
        }
        else if (imageTitle.length > 70) {
            setErrorsState(['Image title is too long!'])
            return
        }

        // Create new BP object
        formData.append('imageTitle', imageTitle)
        formData.append('uploadImage', uploadImage)
        formData.append('owner', owner)

        const onUploadProgress = (data) => {
            //Set the progress value to show the progress bar
            setProgress(Math.round((100 * data.loaded) / data.total))
        }

        // Attempt to create
        dispatch(createImageUpload(formData, onUploadProgress))

        // Reset form fields
        setImageDetailsState({
            imageTitle: ''
        })
        setUploadImage('')
    }

    return (
        <div>

            {progress &&
                <div className={`${errors.id || successful.msg ? 'd-inline' : ''} text-center text-danger fw-bolder`}>
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

                <Label for="imageTitle">
                    <strong className='text-success'>Image name</strong>
                </Label>

                <Input type="text" name="imageTitle" placeholder="Image title ..." className="mb-3" onChange={onChangeHandler} value={imageDetailsState.imageTitle || ''} required />

                <FormGroup>
                    <Label for="uploadImage">
                        <strong className='text-success'>Image</strong>&nbsp;
                        <small className="text-info">.jpg, .png, .jpeg, .svg</small>
                    </Label>

                    <Input bsSize="sm" type="file" accept=".jpg, .png, .jpeg, .svg" name="uploadImage" onChange={onFileHandler} label="Pick an image ..." id="uploadImage_pick" required />

                    <Button color="success" style={{ marginBottom: '3rem', marginTop: '.8rem' }} block >Upload</Button>
                </FormGroup>
            </Form >
        </div>
    )
}

export default UploadPostPhotos