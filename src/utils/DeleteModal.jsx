import { useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import trash from '@/images/trash.svg';
import { useDispatch } from 'react-redux';
import { notify } from './notifyToast';

const DeleteModal = ({ delID, delTitle, deleteFn, deleteFnName }) => {
  const dispatch = useDispatch();

  //properties of the modal
  const [modal, setModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  //showing and hiding modal
  const toggle = () => setModal(!modal);

  const onDelete = async (e) => {
    e && e.preventDefault();
    try {
      setSubmitting(true);
      const result = await dispatch(deleteFn(delID));
      setSubmitting(false);

      // Only close modal & show success if fulfilled
      if (result.type.endsWith('/fulfilled')) {
        setModal(false);
        notify(`Deleting ${delTitle} successful!`, 'success');
        if (deleteFnName === 'deleteQuestion') {
          window.history.back();
        } else if (
          deleteFnName === 'deleteQuiz' ||
          deleteFnName === 'deleteCategory'
        ) {
          setTimeout(() => window.location.reload(), 3000);
        }
      } else {
        console.error('Deletion failed: ', result?.error?.message);
      }
    } catch (err) {
      setSubmitting(false);
      console.error('AddModal submit error', err);
    }
  };

  return (
    <>
      <Button
        color="warning"
        onClick={toggle}
        className="text-success p-1 mx-1 mx-md-3 d-inline-flex align-items-center"
        aria-label={delTitle}
      >
        <img src={trash} alt="trash" width="16" height="16" />
      </Button>
      <Modal
        centered
        fullscreen="md"
        size="md"
        isOpen={modal}
        toggle={toggle}
        style={{ boxShadow: 'none' }}
        className="delete-modal"
      >
        <div className="modal-header-text d-flex justify-content-between align-items-center p-2">
          <span className="h6 mb-0 text-white">{delTitle}</span>
          <Button
            className="cat-close-btn text-uppercase"
            onClick={toggle}
            aria-label="Close dialog"
          >
            Close
          </Button>
        </div>

        <form onSubmit={onDelete}>
          <ModalBody
            className="text-center my-4"
            style={{ backgroundColor: '#f8d7da', fontSize: '.8rem' }}
          >
            Delete <u>{delTitle}</u> permanently?
          </ModalBody>

          <ModalFooter className="justify-content-around pb-0">
            <Button color="danger" type="submit" disabled={submitting}>
              {submitting ? 'Deleting...' : 'Delete'}
            </Button>
            <Button
              color="warning"
              outline
              onClick={toggle}
              className="text-success"
            >
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
};

export default DeleteModal;
