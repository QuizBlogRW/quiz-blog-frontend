import React, { useState, useContext } from 'react'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, NavLink, Alert, Progress } from 'reactstrap'
import LoginModal from '../auth/LoginModal'
import { clearErrors } from '../../redux/error/error.actions'
import { clearSuccess } from '../../redux/success/success.actions'
import { connect } from 'react-redux'
import { updateCategory } from '../../redux/categories/categories.actions'
import EditIcon from '../../images/edit.svg'
import Webmaster from '../webmaster/Webmaster'
import SpinningBubbles from '../rLoading/SpinningBubbles'
import { authContext } from '../../appContexts'

const EditCategory = ({ categoryToEdit, courseCategories, errors, successful, clearErrors, clearSuccess, updateCategory }) => {

    // context
    const auth = useContext(authContext)

    const [categoryState, setCategoryState] = useState({
        catID: categoryToEdit._id,
        name: categoryToEdit.title,
        description: categoryToEdit.description,
        oldCourseCatID: categoryToEdit.courseCategory._id,
        courseCategory: categoryToEdit.courseCategory._id
    })

    // progress
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

    const onChangeHandler = e => {
        setErrorsState([])
        clearErrors()
        clearSuccess()
        setCategoryState({ ...categoryState, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = e => {
        e.preventDefault()

        const { catID, name, description, oldCourseCatID, courseCategory } = categoryState

        // VALIDATE
        if (name.length < 4 || description.length < 4) {
            setErrorsState(['Insufficient info!'])
            return
        }
        else if (name.length > 50) {
            setErrorsState(['Title is too long!'])
            return
        }
        else if (description.length > 100) {
            setErrorsState(['Description is too long!'])
            return
        }

        // Create new Category object
        const updatedCategory = {
            catID,
            title: name,
            description,
            oldCourseCatID,
            courseCategory,
            last_updated_by: auth.isLoading ? null : auth.user._id
        }

        // Attempt to update
        updateCategory(updatedCategory)

        // Display the progress bar
        setProgress(true)
    }
    return (
        auth.isAuthenticated ?

            auth.user.role !== 'Visitor' ?

                <div>
                    <NavLink onClick={toggle} className="text-dark p-0">
                        <img src={EditIcon} alt="" width="16" height="16" />
                    </NavLink>

                    <Modal isOpen={modal} toggle={toggle}>
                        <ModalHeader toggle={toggle} className="bg-primary text-white">
                            Edit Category
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

                            <Form onSubmit={onSubmitHandler}>

                                <FormGroup>

                                    <Label for="name">
                                        <strong>Title</strong>
                                    </Label>

                                    <Input type="text" name="name" id="name" placeholder="Category name ..." className="mb-3" onChange={onChangeHandler} value={categoryState.name} />

                                    <Label for="description">
                                        <strong>Description</strong>
                                    </Label>

                                    <Input type="text" name="description" id="description" placeholder="Category description ..." className="mb-3" onChange={onChangeHandler} value={categoryState.description} />

                                    <Label for="courseCategory">
                                        <strong>Course Category</strong>
                                    </Label>

                                    <Input type="select" name="courseCategory" placeholder="Category title..." className="mb-3" onChange={onChangeHandler} value={categoryState.courseCategory}>
                                        {courseCategories && courseCategories.map(courseCategory =>
                                            <option key={courseCategory._id} value={courseCategory._id}>
                                                {courseCategory.title}
                                            </option>
                                        )}
                                    </Input>

                                    <Button color="success" style={{ marginTop: '2rem' }} block>
                                        Update
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

// Map the question to state props
const mapStateToProps = state => ({
    errors: state.errorReducer,
    successful: state.successReducer
})

export default connect(mapStateToProps, { updateCategory, clearErrors, clearSuccess })(EditCategory)