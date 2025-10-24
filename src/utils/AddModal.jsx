import { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  NavLink,
} from "reactstrap";
import plus from "@/images/plus.svg";
import { useDispatch } from "react-redux";

/**
 * AddModal
 * Props:
 * - title: string - modal title shown in header
 * - submitFn: function - redux action creator or async function to call with formData
 * - renderForm: (formState, setFormState) => ReactNode - render prop that returns the form UI
 * - initialState: object - initial form state (optional)
 * - onSuccess: function - optional callback after successful submit
 */
const AddModal = ({
  title = "Add",
  submitFn,
  renderForm,
  initialState = {},
  onSuccess,
  triggerText = null,
}) => {
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formState, setFormState] = useState(initialState);

  const toggle = () => setModal(!modal);

  const runSubmit = async (data) => {
    if (!submitFn) return null;

    // If submitFn is a function that returns another function (thunk), dispatch it.
    // Otherwise, if submitFn is a plain function returning a Promise, call it directly.
    try {
      const maybeResult = submitFn(data);
      // If the returned value is a function, assume it's a thunk and dispatch it.
      if (typeof maybeResult === "function") {
        return await dispatch(maybeResult);
      }

      // If dispatching the submitFn directly is needed (some action creators expect dispatch(submitFn(data)))
      // try dispatching and if it returns a Promise use it; fall back to calling the function result.
      const dispatched = dispatch(submitFn(data));
      if (dispatched && typeof dispatched.then === "function") {
        return await dispatched;
      }

      // If we reached here and maybeResult is a Promise, await it; otherwise return maybeResult.
      if (maybeResult && typeof maybeResult.then === "function")
        return await maybeResult;
      return maybeResult;
    } catch (err) {
      // rethrow to be handled by caller
      throw err;
    }
  };

  const onSubmit = async (e) => {
    e && e.preventDefault();
    try {
      setSubmitting(true);
      const result = await runSubmit(formState);
      setSubmitting(false);
      setModal(false);
      onSuccess && onSuccess(result);
    } catch (err) {
      setSubmitting(false);
      // keep modal open to show errors; the caller can handle error state inside renderForm
      console.error("AddModal submit error", err);
    }
  };

  return (
    <>
      <Button color="link" onClick={toggle} className="text-success p-0 mx-2 d-inline-flex align-items-center" aria-label={triggerText || title}>
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
        <div className="edit-picture-header d-flex justify-content-between align-items-center p-2">
          <span className="h6 mb-0 text-white">{title}</span>
          <Button
            className="cat-close-btn text-uppercase"
            onClick={toggle}
            aria-label="Close edit picture dialog"
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
            <Button color="secondary" outline onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
};

export default AddModal;
