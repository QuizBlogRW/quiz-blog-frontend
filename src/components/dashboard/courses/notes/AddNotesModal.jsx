import { useCallback, useMemo } from 'react';
import { Label, Input, FormGroup, FormText } from 'reactstrap';
import { useSelector } from 'react-redux';
import AddModal from '@/utils/AddModal';
import { createNotes } from '@/redux/slices/notesSlice';
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

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

// Validation helper
const validateFile = (file) => {
    if (!file) {
        return { ok: false, message: 'Please select a file to upload.' };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        return {
            ok: false,
            message: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
        };
    }

    // Check file type
    const fileExtension = `.${file.name.split('.').pop().toLowerCase()}`;
    if (!ACCEPTED_FILE_TYPES.extensions.includes(fileExtension)) {
        return {
            ok: false,
            message: `Invalid file type. Accepted formats: ${ACCEPTED_FILE_TYPES.displayText}`,
        };
    }

    return { ok: true };
};

// Notes Form Component
const NotesForm = ({ state, setState, firstInputRef }) => {
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
            setState((prev) => ({ ...prev, notes_file: file }));
        },
        [setState]
    );

    const fileInputId = useMemo(() => `notes-file-${Date.now()}`, []);

    return (
        <div className="notes-form">
            <FormGroup>
                <Label for="notesTitle" className="fw-bold">
                    Title <span className="text-danger">*</span>
                </Label>
                <Input
                    innerRef={firstInputRef}
                    id="notesTitle"
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
                </FormText>
            </FormGroup>

            <FormGroup>
                <Label for="notesDescription" className="fw-bold">
                    Description <span className="text-danger">*</span>
                </Label>
                <Input
                    id="notesDescription"
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
                </FormText>
            </FormGroup>

            <FormGroup>
                <Label for={fileInputId} className="fw-bold">
                    Upload File <span className="text-danger">*</span>
                </Label>
                <Input
                    id={fileInputId}
                    type="file"
                    name="notes_file"
                    accept={ACCEPTED_FILE_TYPES.extensions.join(',')}
                    onChange={handleFileChange}
                    required
                    aria-required="true"
                    aria-describedby="notesFileHelp"
                />
                <FormText id="notesFileHelp" color="muted">
                    Accepted formats: {ACCEPTED_FILE_TYPES.displayText}
                    <br />
                    Maximum file size: {MAX_FILE_SIZE / 1024 / 1024}MB
                </FormText>
                {state.notes_file && (
                    <FormText color="success" className="mt-2">
                        ✓ Selected: {state.notes_file.name} (
                        {(state.notes_file.size / 1024).toFixed(2)} KB)
                    </FormText>
                )}
            </FormGroup>
        </div>
    );
};

// Main Component
const AddNotesModal = ({ chapter }) => {
    const { user } = useSelector((state) => state.users);

    // Initial form state
    const initialState = useMemo(
        () => ({
            title: '',
            description: '',
            notes_file: null,
        }),
        []
    );

    // Validate chapter data
    const isChapterValid = useMemo(() => {
        return (
            chapter?._id &&
            chapter?.course?._id &&
            chapter?.courseCategory?._id
        );
    }, [chapter]);

    // Build FormData from form state
    const buildFormData = useCallback(
        (formState) => {
            const formData = new FormData();

            formData.append('title', formState.title.trim());
            formData.append('description', formState.description.trim());
            formData.append('notes_file', formState.notes_file);
            formData.append('chapter', chapter._id);
            formData.append('course', chapter.course._id);
            formData.append('courseCategory', chapter.courseCategory._id);

            if (user?._id) {
                formData.append('uploaded_by', user._id);
            }

            return formData;
        },
        [chapter, user?._id]
    );

    // Submit handler
    const handleSubmit = useCallback(
        (formState) => {
            // Validate chapter data
            if (!isChapterValid) {
                notify('Invalid chapter data. Please try again.', 'error');
                return Promise.reject(new Error('Invalid chapter'));
            }

            const { title, description, notes_file } = formState;

            // Validate title and description
            const validation = validators.validateTitleDesc(
                title,
                description,
                VALIDATION_CONFIG
            );

            if (!validation.ok) {
                notify(
                    'Please check your title and description meet the requirements.',
                    'error'
                );
                return Promise.reject(new Error('validation'));
            }

            // Validate file
            const fileValidation = validateFile(notes_file);
            if (!fileValidation.ok) {
                notify(fileValidation.message, 'error');
                return Promise.reject(new Error('validation'));
            }

            // Build and submit form data
            const formData = buildFormData(formState);

            // Return thunk to dispatch
            return (dispatch) => {
                return dispatch(createNotes(formData))
                    .unwrap()
                    .then(() => {
                        notify('Notes uploaded successfully!', 'success');
                    })
                    .catch((error) => {
                        console.error('Upload error:', error);
                        notify('Failed to upload notes. Please try again.', 'error');
                        throw error;
                    });
            };
        },
        [isChapterValid, buildFormData]
    );

    // Don't render if chapter is invalid
    if (!isChapterValid) {
        console.warn('AddNotesModal: Invalid chapter data', chapter);
        return null;
    }

    return (
        <AddModal
            title="Add Notes"
            triggerText="Notes"
            submitFn={handleSubmit}
            renderForm={(state, setState, ref) => (
                <NotesForm state={state} setState={setState} firstInputRef={ref} />
            )}
            initialState={initialState}
            submitButtonText="Upload Notes"
        />
    );
};

export default AddNotesModal;