import { useCallback, useMemo, useState } from 'react';
import { FormGroup, Label, Input, FormText, Alert } from 'reactstrap';
import UpdateModal from '@/utils/UpdateModal';
import { updateNotes } from '@/redux/slices/notesSlice';
import validators from '@/utils/validators';
import { notify } from '@/utils/notifyToast';

// Constants
const VALIDATION_CONFIG = {
  minTitle: 4,
  minDesc: 4,
  maxTitle: 80,
  maxDesc: 200,
};

const ACCEPTED_FILE_TYPES = {
  extensions: ['.pdf', '.doc', '.docx', '.ppt', '.pptx'],
  mimeTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ],
  displayText: '.pdf, .doc, .docx, .ppt, .pptx',
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// File validation helper
const validateFile = (file) => {
  if (!file) return { ok: true }; // File is optional for updates

  if (file.size > MAX_FILE_SIZE) {
    return {
      ok: false,
      message: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
    };
  }

  const fileExtension = `.${file.name.split('.').pop().toLowerCase()}`;
  if (!ACCEPTED_FILE_TYPES.extensions.includes(fileExtension)) {
    return {
      ok: false,
      message: `Invalid file type. Accepted formats: ${ACCEPTED_FILE_TYPES.displayText}`,
    };
  }

  return { ok: true };
};

// Edit Notes Form Component
const EditNotesForm = ({ state, setState, firstInputRef, currentFile }) => {
  const [showFileWarning, setShowFileWarning] = useState(false);

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setState((prev) => ({ ...prev, [name]: value }));
    },
    [setState]
  );

  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files?.[0] || null;

      if (file && currentFile) {
        setShowFileWarning(true);
      }

      setState((prev) => ({ ...prev, notes_file: file }));
    },
    [setState, currentFile]
  );

  const clearFile = useCallback(() => {
    setState((prev) => ({ ...prev, notes_file: null }));
    setShowFileWarning(false);
  }, [setState]);

  const fileInputId = useMemo(() => `edit-notes-file-${Date.now()}`, []);

  return (
    <div className="edit-notes-form">
      <FormGroup>
        <Label for="editNotesTitle" className="fw-bold">
          Title <span className="text-danger">*</span>
        </Label>
        <Input
          innerRef={firstInputRef}
          id="editNotesTitle"
          type="text"
          name="title"
          placeholder="Enter notes title"
          value={state.title || ''}
          onChange={handleInputChange}
          maxLength={VALIDATION_CONFIG.maxTitle}
          required
          aria-required="true"
        />
        <FormText color="muted">
          {state.title?.length || 0}/{VALIDATION_CONFIG.maxTitle} characters
          {state.title?.length < VALIDATION_CONFIG.minTitle && (
            <span className="text-warning ms-2">
              (minimum {VALIDATION_CONFIG.minTitle} characters)
            </span>
          )}
        </FormText>
      </FormGroup>

      <FormGroup>
        <Label for="editNotesDescription" className="fw-bold">
          Description <span className="text-danger">*</span>
        </Label>
        <Input
          id="editNotesDescription"
          type="textarea"
          name="description"
          placeholder="Enter notes description"
          value={state.description || ''}
          onChange={handleInputChange}
          maxLength={VALIDATION_CONFIG.maxDesc}
          rows="4"
          required
          aria-required="true"
        />
        <FormText color="muted">
          {state.description?.length || 0}/{VALIDATION_CONFIG.maxDesc} characters
          {state.description?.length < VALIDATION_CONFIG.minDesc && (
            <span className="text-warning ms-2">
              (minimum {VALIDATION_CONFIG.minDesc} characters)
            </span>
          )}
        </FormText>
      </FormGroup>

      <FormGroup>
        <Label for={fileInputId} className="fw-bold">
          Replace File <span className="text-muted">(optional)</span>
        </Label>

        {currentFile && (
          <Alert color="info" className="mb-2">
            <small>
              <strong>Current file:</strong> {currentFile}
            </small>
          </Alert>
        )}

        {showFileWarning && (
          <Alert color="warning" className="mb-2" isOpen={showFileWarning} toggle={() => setShowFileWarning(false)}>
            <small>
              ⚠️ Uploading a new file will replace the existing file.
            </small>
          </Alert>
        )}

        <Input
          id={fileInputId}
          type="file"
          name="notes_file"
          accept={ACCEPTED_FILE_TYPES.extensions.join(',')}
          onChange={handleFileChange}
          aria-describedby="editNotesFileHelp"
        />
        <FormText id="editNotesFileHelp" color="muted">
          Accepted formats: {ACCEPTED_FILE_TYPES.displayText}
          <br />
          Maximum file size: {MAX_FILE_SIZE / 1024 / 1024}MB
          <br />
          Leave empty to keep the current file
        </FormText>

        {state.notes_file && (
          <div className="mt-2">
            <FormText color="success">
              ✓ New file selected: {state.notes_file.name} (
              {(state.notes_file.size / 1024).toFixed(2)} KB)
            </FormText>
            <button
              type="button"
              className="btn btn-sm btn-link text-danger p-0 ms-2"
              onClick={clearFile}
              aria-label="Clear selected file"
            >
              Remove
            </button>
          </div>
        )}
      </FormGroup>
    </div>
  );
};

// Main Component
const EditNotesModal = ({
  idToUpdate,
  editTitle,
  editDesc,
  currentFileName = null
}) => {
  // Validate required props
  if (!idToUpdate) {
    console.error('EditNotesModal: idToUpdate is required');
    return null;
  }

  // Initial form data
  const initialUpdateData = useMemo(
    () => ({
      idToUpdate,
      title: editTitle || '',
      description: editDesc || '',
      notes_file: null,
    }),
    [idToUpdate, editTitle, editDesc]
  );

  // Build FormData from form state
  const buildFormData = useCallback((formState) => {
    const formData = new FormData();

    formData.append('title', formState.title.trim());
    formData.append('description', formState.description.trim());

    // Only append file if a new one was selected
    if (formState.notes_file) {
      formData.append('notes_file', formState.notes_file);
    }

    return formData;
  }, []);

  // Submit handler with validation
  const handleSubmit = useCallback(
    (formState) => {
      const { title, description, notes_file } = formState;

      // Validate title and description using the validators utility
      const validation = validators.validateTitleDesc(
        title,
        description,
        VALIDATION_CONFIG
      );

      if (!validation.ok) {
        notify(
          'Please ensure title and description meet the requirements.',
          'error'
        );
        return Promise.reject(new Error('validation'));
      }

      // Validate file if provided
      if (notes_file) {
        const fileValidation = validateFile(notes_file);
        if (!fileValidation.ok) {
          notify(fileValidation.message, 'error');
          return Promise.reject(new Error('validation'));
        }
      }

      // Build form data
      const formData = buildFormData(formState);

      // Return thunk to dispatch
      return (dispatch) => {
        return dispatch(updateNotes({ idToUpdate, formData }))
          .unwrap()
          .then(() => {
            notify('Notes updated successfully!', 'success');
          })
          .catch((error) => {
            console.error('Update error:', error);
            notify(
              error?.message || 'Failed to update notes. Please try again.',
              'error'
            );
            throw error;
          });
      };
    },
    [idToUpdate, buildFormData]
  );

  return (
    <UpdateModal
      title="Edit Notes"
      submitFn={handleSubmit}
      renderForm={(state, setState, ref) => (
        <EditNotesForm
          state={state}
          setState={setState}
          firstInputRef={ref}
          currentFile={currentFileName}
        />
      )}
      initialUpdateData={initialUpdateData}
      submitButtonText="Update Notes"
      triggerText="Edit"
    />
  );
};

export default EditNotesModal;
