import { useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FormGroup, Label, Input, FormText, Spinner, Alert } from 'reactstrap';
import AddModal from '@/utils/AddModal';
import { getQuizzesByCourseCategory } from '@/redux/slices/quizzesSlice';
import { addQuizToNotes } from '@/redux/slices/notesSlice';
import { notify } from '@/utils/notifyToast';
import AddIcon from '@/images/plus.svg';

// Quiz Selection Form Component
const QuizSelectionForm = ({
    state,
    setState,
    firstInputRef,
    availableQuizzes,
    isLoading,
    hasQuizzes
}) => {
    const handleChange = useCallback(
        (e) => {
            setState((prev) => ({ ...prev, quizID: e.target.value }));
        },
        [setState]
    );

    const selectId = useMemo(() => `quiz-select-${Date.now()}`, []);

    return (
        <div className="quiz-selection-form">
            <FormGroup>
                <Label for={selectId} className="fw-bold">
                    Select Quiz <span className="text-danger">*</span>
                </Label>

                {isLoading ? (
                    <div className="d-flex align-items-center gap-2 py-3">
                        <Spinner size="sm" color="primary" />
                        <span className="text-muted">Loading available quizzes...</span>
                    </div>
                ) : !hasQuizzes ? (
                    <Alert color="info" className="mb-0">
                        <small>
                            No quizzes available for this course category yet.
                        </small>
                    </Alert>
                ) : availableQuizzes.length === 0 ? (
                    <Alert color="success" className="mb-0">
                        <small>
                            ✓ All available quizzes have been added to this note.
                        </small>
                    </Alert>
                ) : (
                    <>
                        <Input
                            innerRef={firstInputRef}
                            type="select"
                            id={selectId}
                            name="quizID"
                            value={state.quizID || ''}
                            onChange={handleChange}
                            required
                            aria-required="true"
                            aria-describedby="quizSelectHelp"
                        >
                            <option value="">-- Select a quiz --</option>
                            {availableQuizzes.map((quiz) => (
                                <option key={quiz._id} value={quiz._id}>
                                    {quiz.title}
                                </option>
                            ))}
                        </Input>
                        <FormText id="quizSelectHelp" color="muted">
                            Choose a quiz to associate with this note.
                            {availableQuizzes.length > 0 && (
                                <> ({availableQuizzes.length} available)</>
                            )}
                        </FormText>
                    </>
                )}
            </FormGroup>
        </div>
    );
};

// Main Component
const AddRelatedQuiz = ({ note }) => {
    const dispatch = useDispatch();
    const { isLoading, ccQuizzes } = useSelector((state) => state.quizzes);

    // Validate note prop
    const isNoteValid = useMemo(() => {
        return note?._id && note?.courseCategory?._id;
    }, [note]);

    // Get already added quiz IDs
    const addedQuizIds = useMemo(() => {
        return new Set(note?.quizes || []);
    }, [note?.quizes]);

    // Filter out quizzes already added to this note
    const availableQuizzes = useMemo(() => {
        if (!ccQuizzes || !Array.isArray(ccQuizzes)) return [];
        return ccQuizzes.filter((quiz) => !addedQuizIds.has(quiz._id));
    }, [ccQuizzes, addedQuizIds]);

    const hasQuizzes = useMemo(() => {
        return ccQuizzes && ccQuizzes.length > 0;
    }, [ccQuizzes]);

    // Initial form state
    const initialState = useMemo(() => ({ quizID: '' }), []);

    // Fetch quizzes for the course category
    useEffect(() => {
        if (isNoteValid && note.courseCategory._id) {
            dispatch(getQuizzesByCourseCategory(note.courseCategory._id));
        }
    }, [dispatch, isNoteValid, note?.courseCategory?._id]);

    // Validate quiz selection
    const validateQuizSelection = useCallback((quizID) => {
        if (!quizID || quizID === '') {
            return {
                ok: false,
                message: 'Please select a quiz to add.',
            };
        }

        // Check if quiz exists in available quizzes
        const quizExists = availableQuizzes.some((q) => q._id === quizID);
        if (!quizExists) {
            return {
                ok: false,
                message: 'Selected quiz is not available.',
            };
        }

        return { ok: true };
    }, [availableQuizzes]);

    // Submit handler
    const handleSubmit = useCallback(
        (formState) => {
            // Validate note
            if (!isNoteValid) {
                notify('Invalid note data. Please try again.', 'error');
                return Promise.reject(new Error('Invalid note'));
            }

            // Validate quiz selection
            const validation = validateQuizSelection(formState.quizID);
            if (!validation.ok) {
                notify(validation.message, 'error');
                return Promise.reject(new Error('validation'));
            }

            // Add quiz to note
            return (dispatch) => {
                return dispatch(
                    addQuizToNotes({
                        noteID: note._id,
                        quizID: formState.quizID
                    })
                )
                    .unwrap()
                    .then(() => {
                        notify('Quiz added successfully!', 'success');
                    })
                    .catch((error) => {
                        console.error('Add quiz error:', error);
                        notify(
                            error?.message || 'Failed to add quiz. Please try again.',
                            'error'
                        );
                        throw error;
                    });
            };
        },
        [isNoteValid, note?._id, validateQuizSelection]
    );

    // Don't render if note is invalid
    if (!isNoteValid) {
        console.warn('AddRelatedQuiz: Invalid note data', note);
        return null;
    }

    // Don't render if all quizzes are already added (after loading)
    const shouldShowButton = !isLoading && (hasQuizzes && availableQuizzes.length > 0);

    return shouldShowButton ? (
        <AddModal
            title={
                <span className="d-flex align-items-center gap-2">
                    <img
                        src={AddIcon}
                        alt=""
                        width="16"
                        height="16"
                        aria-hidden="true"
                    />
                    Add Related Quiz
                </span>
            }
            triggerText="Quiz"
            triggerButtonProps={{
                size: 'sm',
                color: 'primary',
                outline: true,
            }}
            initialState={initialState}
            submitFn={handleSubmit}
            renderForm={(state, setState, ref) => (
                <QuizSelectionForm
                    state={state}
                    setState={setState}
                    firstInputRef={ref}
                    availableQuizzes={availableQuizzes}
                    isLoading={isLoading}
                    hasQuizzes={hasQuizzes}
                />
            )}
            submitButtonText="Add Quiz"
        />
    ) : null;
};

export default AddRelatedQuiz;
