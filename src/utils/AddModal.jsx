import { useState } from "react";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { notify } from "@/utils/notifyToast";
import { useDispatch } from "react-redux";
import plus from "@/images/plus.svg";

/**
 * AddModal
 * Props:
 * - title: string - modal title shown in header
 * - submitFn: function - redux action creator or async function to call with formData
 * - renderForm: (formState, setFormState) => ReactNode - render prop that returns the form UI
 * - initialState: object - initial form state (optional)
 */
const AddModal = ({
  title = "Add",
  submitFn,
  renderForm,
  initialState = {},
  triggerText = null,
}) => {
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formState, setFormState] = useState(initialState);

  const toggle = () => setModal(!modal);

  const runSubmit = async (data) => {
    if (!submitFn) return null;

    try {
      const maybeResult = submitFn(data);
      // If the returned value is a function, assume it's a thunk and dispatch it.
      if (typeof maybeResult === "function") {
        return await dispatch(maybeResult);
      } else {
        throw new Error(
          "submitFn must return a function (thunk) when used with AddModal"
        );
      }
    } catch (err) {
      throw err;
    }
  };

  const onSubmit = async (e) => {
    e && e.preventDefault();
    try {
      setSubmitting(true);
      const result = await runSubmit(formState);
      setSubmitting(false);

      // Only close modal & show success if fulfilled
      if (result.type.endsWith("/fulfilled")) {
        setModal(false);
        notify("Created successfully", "success");

        if (deleteFnName === "deleteQuestion") {
          window.history.back();
        } else if (deleteFnName === "deleteCategory") {
          setTimeout(() => window.location.reload(), 3000);
        }
      } else {
        console.error("Submission failed: ", result?.error?.message);
      }
    } catch (err) {
      setSubmitting(false);
      console.error("AddModal submit error", err);
    }
  };

  return (
    <>
      <Button
        color="warning"
        onClick={toggle}
        className="text-success p-1 mx-1 mx-md-3 d-inline-flex align-items-center"
        aria-label={triggerText || title}
      >
        <img src={plus} alt="add" width="16" height="16" />
        {triggerText ? <span className="ms-1">{triggerText}</span> : null}
      </Button>

      <Modal
        centered
        size="md"
        isOpen={modal}
        toggle={toggle}
        className="add-modal"
      >
        <div className="modal-header-text d-flex justify-content-between align-items-center p-2">
          <span className="h6 mb-0 text-white">{title}</span>
          <Button
            className="cat-close-btn text-uppercase"
            onClick={toggle}
            aria-label="Close dialog"
          >
            Close
          </Button>
        </div>

        <form onSubmit={onSubmit}>
          <ModalBody>
            {typeof renderForm === "function"
              ? renderForm(formState, setFormState)
              : null}
          </ModalBody>

          <ModalFooter className="justify-content-around pb-0">
            <Button color="success" type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save"}
            </Button>
            <Button color="warning" outline onClick={toggle} className="text-success">
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
};

export default AddModal;
