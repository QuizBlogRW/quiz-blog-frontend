import React, { useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, NavLink, Alert, Progress } from 'reactstrap'
import { connect } from 'react-redux'
import DeleteIcon from '../../images/remove.svg'
import { deleteCategory } from '../../redux/categories/categories.actions'
import { clearErrors } from '../../redux/error/error.actions'
import { clearSuccess } from '../../redux/success/success.actions'

const DeleteCategory = ({ deleteCategory, catID, catTitle, errors, successful }) => {

    // progress
    const [progress, setProgress] = useState(false);

    // Alert
    const [visible, setVisible] = useState(true);
    const onDismiss = () => setVisible(false);

    //properties of the modal
    const [modal, setModal] = useState(false)

    //showing and hiding modal
    const toggle = () => setModal(!modal)

    const onDeleteHandler = e => {
        e.preventDefault()
        // Display the progress bar
        setProgress(true)
        // Attempt to delete
        deleteCategory(catID)
    }

    return (
        <>
            <NavLink onClick={toggle} className="text-dark p-0">
                <img src={DeleteIcon} alt="" width="16" height="16" />
            </NavLink>

            <Modal centered fullscreen="md" size="sm" isOpen={modal} toggle={toggle} style={{ boxShadow: "none" }} className="delete-modal">
                <ModalHeader toggle={toggle} tag="strong" className="text-center text-danger">
                    DELETE CATEGORY
                </ModalHeader>

                {/* Error backend */}
                <div className='my-2 mx-1'>
                    {errors.id ?
                        <Alert isOpen={visible} toggle={onDismiss} color='danger' className='border border-warning'>
                            <small>{errors.msg && errors.msg}</small>
                        </Alert> :
                        successful.id ?
                            <Alert color='success' isOpen={visible} toggle={onDismiss} className='border border-warning'>
                                <small>{successful.msg && successful.msg}</small>
                            </Alert> : null
                    }

                    {(progress && !successful.id && !errors.id) ? <Progress animated color="warning" value={100} /> : null}
                </div>

                <ModalBody className="text-center">
                    Delete <u>{catTitle}</u> category permanently?
                </ModalBody>

                <ModalFooter className="justify-content-around">
                    <Button color="danger" onClick={onDeleteHandler} >
                        Confirm
                    </Button>
                    <Button color="success" outline onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </>
    )
}

// Map the question to state props
const mapStateToProps = state => ({
    errors: state.errorReducer,
    successful: state.successReducer
});

export default connect(mapStateToProps, { deleteCategory, clearErrors, clearSuccess })(DeleteCategory)