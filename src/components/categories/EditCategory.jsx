import React, { useState, useContext } from 'react'
import { Button, Modal, ModalBody, Form, FormGroup, Label, Input, NavLink, Alert } from 'reactstrap'
import { updateCategory } from '../../redux/slices/categoriesSlice'
import EditIcon from '../../images/edit.svg'
import { authContext } from '../../appContexts'
import { useDispatch } from "react-redux"

const EditCategory = ({ categoryToEdit, courseCategories }) => {

    // redux
    const dispatch = useDispatch()

    // context
    const auth = useContext(authContext)

    const [categoryState, setCategoryState] = useState({
        catID: categoryToEdit._id,
        name: categoryToEdit.title,
        description: categoryToEdit.description,
        oldCourseCatID: categoryToEdit.courseCategory._id,
        courseCategory: categoryToEdit.courseCategory._id
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
        setErrorsState([])
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
        dispatch(updateCategory(updatedCategory))
    }
    return (
        <div>
            <NavLink onClick={toggle} className="text-dark p-0">
                <img src={EditIcon} onClick={toggle} alt="" width="16" height="16" className="mx-2" />
            </NavLink>

            <Modal isOpen={modal} toggle={toggle}>
                <div className="d-flex justify-content-between align-items-center p-2" style={{ backgroundColor: "#157A6E", color: "#fff" }}>
                    Edit Category
                    <Button className="btn-danger text-uppercase text-red" style={{ padding: "0.1rem 0.3rem", fontSize: ".6rem", fontWeight: "bold" }} onClick={toggle}>
                        X
                    </Button>
                </div>

                <ModalBody>
                    {/* Error frontend*/}
                    {errorsState.length > 0 ?
                        errorsState.map(err =>
                            <Alert color="danger" isOpen={visible} toggle={onDismiss} key={Math.floor(Math.random() * 1000)} className='border border-warning'>
                                {err}
                            </Alert>) :
                        null
                    }

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
        </div>
    )
}

export default EditCategory