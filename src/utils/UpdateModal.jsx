import { useState, useEffect, useRef } from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, NavLink } from 'reactstrap'
import edit from '@/images/edit.svg'
import { useDispatch } from 'react-redux'

/**
 * UpdateModal
 * Props:
 * - title: string - modal title shown in header
 * - submitFn: function - redux action creator or async function to call with formData
 * - renderForm: (formState, setFormState) => ReactNode - render prop that returns the form UI
 * - initialData: object - object to prefill the form (required for updates)
 * - onSuccess: function - optional callback after successful submit
 * - afterSuccess: 'reload' | 'back' | null - optional post-success action
 */
const UpdateModal = ({
  title = 'Update',
  submitFn,
  renderForm,
  initialData = {},
  onSuccess,
  afterSuccess = null,
  children, // optional custom trigger element
}) => {
  const dispatch = useDispatch()
  const [modal, setModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formState, setFormState] = useState(initialData)
  const [error, setError] = useState(null)
  const firstInputRef = useRef(null)
  const modalBodySelector = '.update-modal .modal-body'

  useEffect(() => {
    setFormState(initialData)
  }, [initialData])

  useEffect(() => {
    if (modal) {
      setError(null)
      // focus first input if provided via renderForm using ref prop
      setTimeout(() => {
        if (firstInputRef.current && typeof firstInputRef.current.focus === 'function') {
          firstInputRef.current.focus()
          return
        }

        // fallback: find first focusable element in modal body and focus it
        try {
          const body = document.querySelector(modalBodySelector)
          if (body) {
            const focusable = body.querySelector('input, select, textarea, button')
            if (focusable && typeof focusable.focus === 'function') focusable.focus()
          }
        } catch (e) {
          // ignore DOM errors in non-browser envs
        }
      }, 50)
    } else {
      // reset form when closing to avoid stale state
      setFormState(initialData)
      setSubmitting(false)
      setError(null)
    }
  }, [modal, initialData])

  const toggle = () => setModal(!modal)

  const runSubmit = async data => {
    if (!submitFn) return null

    try {
      // submitFn can be:
      // - an action creator that returns a thunk (function)
      // - a thunk function directly
      // - an async function that returns a promise
      const maybe = submitFn(data)

      // If it's a function (thunk), dispatch it
      if (typeof maybe === 'function') {
        const dispatched = dispatch(maybe)
        if (dispatched && typeof dispatched.then === 'function') return await dispatched
        return dispatched
      }

      // If submitFn returned a promise
      if (maybe && typeof maybe.then === 'function') return await maybe

      // If submitFn is an action object, dispatch it and return
      const dispatched = dispatch(maybe)
      if (dispatched && typeof dispatched.then === 'function') return await dispatched
      return dispatched
    } catch (err) {
      throw err
    }
  }

  const onSubmit = async e => {
    e && e.preventDefault()
    try {
      setSubmitting(true)
      const result = await runSubmit(formState)
      setSubmitting(false)
      setModal(false)
      onSuccess && onSuccess(result)

      if (afterSuccess === 'back') window.history.back()
      if (afterSuccess === 'reload') window.location.reload()
    } catch (err) {
      setSubmitting(false)
      console.error('UpdateModal submit error', err)
      // normalize error display
      const msg = (err && (err.message || err.msg || err.error)) || String(err)
      setError(msg)
    }
  }

  return (
    <>
      {children
        ? <span onClick={toggle} className="update-modal-trigger">{children}</span>
        : (
          <Button color="link" onClick={toggle} className="text-dark p-0 mx-2 d-inline-flex align-items-center" aria-label={title}>
            <img src={edit} alt="edit" width="16" height="16" />
          </Button>
        )}

      <Modal centered size="md" isOpen={modal} toggle={toggle} className="update-modal">
        <ModalHeader toggle={toggle}>{title}</ModalHeader>

        <form onSubmit={onSubmit}>
          <ModalBody>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {typeof renderForm === 'function'
              ? renderForm(formState, setFormState, firstInputRef)
              : null}
          </ModalBody>

          <ModalFooter className="justify-content-around pb-0">
            <Button color="primary" type="submit" disabled={submitting}>
              {submitting ? 'Updating...' : 'Update'}
            </Button>
            <Button color="secondary" outline onClick={toggle}>Cancel</Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  )
}

export default UpdateModal
