import { useState, useEffect, useRef } from "react";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import edit from "@/images/edit.svg";
import { useDispatch } from "react-redux";
import { notify } from "@/utils/notifyToast";

/**
 * UpdateModal
 * Props:
 * - title: string - modal title shown in header
 * - submitFn: function - redux action creator or async function to call with formData
 * - renderForm: (formState, setFormState) => ReactNode - render prop that returns the form UI
 * - initialData: object - object to prefill the form (required for updates)
 */
const UpdateModal = ({
  title = "Update",
  submitFn,
  renderForm,
  initialData = {},
  children, // optional custom trigger element
  triggerText = null,
}) => {
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formState, setFormState] = useState(initialData);
  const [error, setError] = useState(null);
  const firstInputRef = useRef(null);
  const modalBodySelector = ".update-modal .modal-body";

  useEffect(() => {
    setFormState(initialData);
  }, [initialData]);

  useEffect(() => {
    if (modal) {
      setError(null);
      // focus first input if provided via renderForm using ref prop
      setTimeout(() => {
        if (
          firstInputRef.current &&
          typeof firstInputRef.current.focus === "function"
        ) {
          firstInputRef.current.focus();
          return;
        }

        // fallback: find first focusable element in modal body and focus it
        try {
          const body = document.querySelector(modalBodySelector);
          if (body) {
            const focusable = body.querySelector(
              "input, select, textarea, button"
            );
            if (focusable && typeof focusable.focus === "function")
              focusable.focus();
          }
        } catch (e) {
          // ignore DOM errors in non-browser envs
        }
      }, 50);
    } else {
      // reset form when closing to avoid stale state
      setFormState(initialData);
      setSubmitting(false);
      setError(null);
    }
  }, [modal, initialData]);

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
      {children ? (
        <span onClick={toggle} className="update-modal-trigger">
          {children}
        </span>
      ) : (
        <Button
          color="warning"
          onClick={toggle}
          className="text-success p-1 mx-1 mx-md-3 d-inline-flex align-items-center"
          aria-label={title}
        >
          <img src={edit} alt="edit" width="16" height="16" />
          {triggerText ? <span className="ms-1">{triggerText}</span> : null}
        </Button>
      )}

      <Modal
        centered
        size="md"
        isOpen={modal}
        toggle={toggle}
        className="update-modal"
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
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {typeof renderForm === "function"
              ? renderForm(formState, setFormState, firstInputRef)
              : null}
          </ModalBody>

          <ModalFooter className="justify-content-around pb-0">
            <Button color="success" type="submit" disabled={submitting}>
              {submitting ? "Updating..." : "Update"}
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

export default UpdateModal;
