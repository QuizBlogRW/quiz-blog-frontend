import { Button, Modal, ModalBody } from 'reactstrap';

const ConfirmModal = ({ isOpen, toggleModal, handleClick, actionName }) => {
    return (

        <Modal isOpen={isOpen} toggle={toggleModal} centered>
            <div className="d-flex justify-content-between align-items-center p-2 fw-bold" style={{ color: 'var(--brand)' }}>
                <span>Are you sure you want to {actionName}?</span>
                <Button
                    color="danger"
                    size="sm"
                    onClick={toggleModal}
                    style={{ padding: '0.2rem 0.5rem', fontSize: '.7rem' }}
                    aria-label="Close  modal"
                >
                    X
                </Button>
            </div>

            <ModalBody className="d-flex justify-content-around mt-3">
                <Button color="danger" onClick={handleClick}>
                    {actionName}
                </Button>
                <Button color="primary" style={{ backgroundColor: 'var(--brand)' }} onClick={toggleModal}>
                    Cancel
                </Button>
            </ModalBody>
        </Modal>
    );
};

export default ConfirmModal;
