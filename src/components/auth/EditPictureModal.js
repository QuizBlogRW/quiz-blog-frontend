import React, { useState } from 'react'
import { connect } from 'react-redux'
import LoginModal from './LoginModal'
import uploadimage from '../../images/uploadimage.svg'
import { updateProfileImage } from '../../redux/auth/auth.actions'
import { clearErrors } from '../../redux/error/error.actions'
import { clearSuccess } from '../../redux/success/success.actions'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Alert, CustomInput, Progress, UncontrolledTooltip } from 'reactstrap'
import SpinningBubbles from '../rLoading/SpinningBubbles'

const EditPictureModal = ({ auth, updateProfileImage, errors, successful, clearErrors, clearSuccess }) => {

  const uId = auth && auth.user._id
  const userImage = auth && auth.user.image

  const [profileImageState, setProfileImageState] = useState()
  const [progress, setProgress] = useState(false)

  // Alert
  const [visible, setVisible] = useState(true)
  const onDismiss = () => setVisible(false)

  // Errors state on form
  const [errorsState, setErrorsState] = useState([])

  //properties of the modal
  const [modal, setModal] = useState(false)

  //showing and hiding modal
  const toggle = () => setModal(!modal)

  const onFileHandler = (e) => {
    setErrorsState([])
    clearErrors()
    clearSuccess()
    setProfileImageState(e.target.files[0])
  }

  const onSubmitHandler = e => {
    e.preventDefault()

    const formData = new FormData()

    // VALIDATE
    if (!profileImageState) {
      setErrorsState(['The image is required!'])
      return
    }

    // upload profile image
    formData.append('profile_image', profileImageState)

    // Attempt to upload
    updateProfileImage(formData, uId)
    // Display the progress bar
    setProgress(true)
  }

  return (
    auth.isAuthenticated ?

      <>
        <span className='upload-image' onClick={toggle}>
          <img src={userImage || uploadimage} alt='Profile illustration' id="UncontrolledTooltipExample" />

          <UncontrolledTooltip placement="bottom" target="UncontrolledTooltipExample" >
            Click to update profile image
          </UncontrolledTooltip>
        </span>

        <Modal isOpen={modal} toggle={toggle} className="resources-modal">

          <ModalHeader toggle={toggle} className="bg-primary text-white">
            Update profile picture
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
              <Alert isOpen={visible} toggle={onDismiss} color='danger' className='border border-warning'>
                <small>{errors.msg && errors.msg}</small>
              </Alert> :
              successful.id ?
                <Alert color='success' isOpen={visible} toggle={onDismiss} className='border border-warning'>
                  <small>{successful.msg && successful.msg}</small>
                </Alert> : null
            }

            {(progress && !successful.id && !errors.id) ? <Progress animated color="warning" value={100} className='mb-2' /> : null}

            <Form onSubmit={onSubmitHandler} encType='multipart/form-data'>
              <FormGroup>

                <Label for="profile_image" className="my-2">
                  <strong>Upload Image</strong>&nbsp;
                  <small className="text-info"> (.jpg, .jpeg, .png, .svg)</small>
                </Label>

                <CustomInput bsSize="sm" type="file" accept=".jpg, .jpeg, .png, .svg" name="profile_image" onChange={onFileHandler} label="Choose an image to upload ..." id="profile_image_pick" />

                <Button color="success" style={{ marginTop: '2rem' }} block >Upload</Button>

              </FormGroup>

            </Form>
          </ModalBody>
        </Modal>
      </> :

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

export default connect(mapStateToProps, { updateProfileImage, clearErrors, clearSuccess })(EditPictureModal)