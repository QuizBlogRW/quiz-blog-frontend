import React, { useState } from 'react'
import { Button, Modal, ModalBody, Form, FormGroup, Label, Input, NavLink } from 'reactstrap'
import { clearErrors } from '../../redux/slices/errorSlice'
import { clearSuccess } from '../../redux/slices/successSlice'
import { updateLevel } from '../../redux/slices/levelsSlice'
import { useDispatch } from 'react-redux'
import EditIcon from '../../images/edit.svg'
import Notification from '../../utils/Notification'

const EditLevelModal = ({ idToUpdate, editTitle }) => {

    // Redux
    const dispatch = useDispatch()

    const [levelState, setLevelState] = useState({
        idToUpdate,
        title: editTitle
    })

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
        setLevelState({ ...levelState, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = e => {
        e.preventDefault()

        const { idToUpdate, title } = levelState

        // VALIDATE
        if (title.length < 3) {
            setErrorsState(['Insufficient info!'])
            return
        }
        else if (title.length > 70) {
            setErrorsState(['Title is too long!'])
            return
        }

        // update level object
        const updatedLev = {
            idToUpdate,
            title
        }

        // Attempt to create
        dispatch(updateLevel(updatedLev))
    }

    return (<div>
        <NavLink onClick={toggle} className="text-dark p-0">
            <img src={EditIcon} alt="" width="14" height="14" />
        </NavLink>
        <Modal
            isOpen={modal}
            toggle={toggle}
        >
            <div className="d-flex justify-content-between align-items-center p-2" style={{ backgroundColor: "#157A6E", color: "#fff" }}>
                Edit Level
                <Button className="btn-danger text-uppercase text-red" style={{ padding: "0.1rem 0.3rem", fontSize: ".6rem", fontWeight: "bold" }} onClick={toggle}>
                    X
                </Button>
            </div>

            <ModalBody>
                <Notification errorsState={errorsState} progress={null} initFn="updateLevel" />

                <Form onSubmit={onSubmitHandler}>

                    <FormGroup>

                        <Label for="name">
                            <strong>Title</strong>
                        </Label>

                        <Input value={levelState.title} type="text" name="title" id="title" className="mb-3" onChange={onChangeHandler} required />

                        <Button color="success" style={{ marginTop: '2rem' }} block >Update</Button>

                    </FormGroup>

                </Form>
            </ModalBody>
        </Modal>
    </div>
    )
}

export default EditLevelModal