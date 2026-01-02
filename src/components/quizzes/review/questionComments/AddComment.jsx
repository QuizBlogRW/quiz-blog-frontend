import { useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, FormGroup, Input, Label, Progress, Alert } from 'reactstrap';
import { createComment } from '@/redux/slices/questionsCommentsSlice';
import { notify } from '@/utils/notifyToast';

const AddComment = ({ question, quiz, fromSingleQuestion = false }) => {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.users);

    const [comment, setComment] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    // Character limits
    const MIN_LENGTH = 4;
    const MAX_LENGTH = 1000;

    // Calculate character count and validation
    const commentStats = useMemo(() => {

        const length = comment.trim().length;
        const percentage = (length / MAX_LENGTH) * 100;
        const remaining = MAX_LENGTH - length;
        const isValid = length >= MIN_LENGTH && length <= MAX_LENGTH;
        const isTooShort = length > 0 && length < MIN_LENGTH;
        const isTooLong = length > MAX_LENGTH;

        return {
            length,
            percentage,
            remaining,
            isValid,
            isTooShort,
            isTooLong,
        };
    }, [comment]);

    // Get progress bar color
    const getProgressColor = useCallback(() => {
        if (commentStats.percentage < 50) return 'success';
        if (commentStats.percentage < 80) return 'warning';
        if (commentStats.percentage < 100) return 'danger';
        return 'danger';
    }, [commentStats.percentage]);

    // Handle input change
    const onChangeHandler = useCallback((e) => {
        const value = e.target.value;
        // Allow typing even beyond max, but we'll prevent submission
        setComment(value);
    }, []);

    // Handle focus
    const handleFocus = useCallback(() => {
        setIsFocused(true);
    }, []);

    const handleBlur = useCallback(() => {
        if (comment.trim().length === 0) {
            setIsFocused(false);
        }
    }, [comment]);


    // Handle form submission
    const onSubmitHandler = useCallback(
        async (e) => {
            e.preventDefault();

            // Validation
            if (!isAuthenticated) {
                notify('Please log in to comment', 'error');
                return;
            }

            const trimmedComment = comment.trim();

            if (trimmedComment.length < MIN_LENGTH) {
                notify(`Comment must be at least ${MIN_LENGTH} characters`, 'error');
                return;
            }

            if (trimmedComment.length > MAX_LENGTH) {
                notify(`Comment must not exceed ${MAX_LENGTH} characters`, 'error');
                return;
            }

            const newComment = {
                sender: user._id,
                question,
                quiz,
                comment: trimmedComment,
            };

            try {
                const result = await dispatch(
                    createComment(newComment, fromSingleQuestion)
                ).unwrap();

                if (result) {
                    setComment('');
                    notify('Comment posted successfully!', 'success');
                }
            } catch (error) {
                console.error('Failed to post comment:', error);
                notify(
                    error?.message || 'Failed to post comment. Please try again.',
                    'error'
                );
            }
        },
        [
            comment,
            isAuthenticated,
            user,
            question,
            quiz,
            fromSingleQuestion,
            dispatch,
        ]
    );

    // Guard: Not authenticated
    if (!isAuthenticated) {
        return (
            <Alert color="info" className="mb-0">
                <div className="d-flex align-items-center">
                    <i className="fa fa-info-circle fa-2x me-3"></i>
                    <div>
                        <strong className="d-block mb-1">Login Required</strong>
                        <small>Please log in to post comments and join the discussion.</small>
                    </div>
                </div>
            </Alert>
        );
    }

    return (
        <Form onSubmit={onSubmitHandler}>
            <FormGroup>
                {/* Label with user info */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <Label className="fw-bold text-dark mb-0">
                        <i className="fa fa-user-circle me-2 text-primary"></i>
                        Commenting as <span className="text-primary">{user.name}</span>
                    </Label>
                    {isFocused && (
                        <small className="text-muted">
                            <i className="fa fa-keyboard me-1"></i>
                            Markdown supported
                        </small>
                    )}
                </div>

                {/* Textarea */}
                <Input
                    type="textarea"
                    rows={isFocused ? "5" : "3"}
                    name="comment"
                    placeholder="Share your thoughts, ask a question, or help others understand better..."
                    className="mb-2 shadow-sm"
                    onChange={onChangeHandler}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    value={comment}
                    style={{
                        backgroundColor: isFocused ? '#fff' : '#fafafa',
                        borderColor: commentStats.isTooLong ? '#dc3545' : '#dee2e6',
                        transition: 'all 0.2s ease-in-out',
                        fontSize: '0.95rem',
                        lineHeight: '1.5',
                    }}
                />

                {/* Character count and progress */}
                {(isFocused || comment.length > 0) && (
                    <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <small
                                className={`fw-semibold ${commentStats.isTooShort
                                        ? 'text-warning'
                                        : commentStats.isTooLong
                                            ? 'text-danger'
                                            : commentStats.isValid
                                                ? 'text-success'
                                                : 'text-muted'
                                    }`}
                            >
                                {commentStats.isTooShort && (
                                    <>
                                        <i className="fa fa-exclamation-triangle me-1"></i>
                                        Needs {MIN_LENGTH - commentStats.length} more characters
                                    </>
                                )}
                                {commentStats.isTooLong && (
                                    <>
                                        <i className="fa fa-exclamation-circle me-1"></i>
                                        {commentStats.length - MAX_LENGTH} characters over limit
                                    </>
                                )}
                                {commentStats.isValid && (
                                    <>
                                        <i className="fa fa-check-circle me-1"></i>
                                        Good to go!
                                    </>
                                )}
                                {commentStats.length === 0 && (
                                    <>
                                        <i className="fa fa-info-circle me-1"></i>
                                        Minimum {MIN_LENGTH} characters
                                    </>
                                )}
                            </small>
                            <small className="text-muted">
                                {commentStats.length} / {MAX_LENGTH}
                            </small>
                        </div>
                        <Progress
                            value={commentStats.percentage}
                            color={getProgressColor()}
                            style={{ height: '4px' }}
                        />
                    </div>
                )}

                {/* Validation messages */}
                {commentStats.isTooLong && (
                    <Alert color="danger" className="py-2 mb-3">
                        <small>
                            <i className="fa fa-exclamation-circle me-2"></i>
                            Your comment is too long. Please shorten it by{' '}
                            {commentStats.length - MAX_LENGTH} characters.
                        </small>
                    </Alert>
                )}

                {/* Action buttons */}
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        {comment.length > 0 && (
                            <Button
                                color="secondary"
                                outline
                                size="sm"
                                onClick={() => setComment('')}
                                className="me-2"
                            >
                                <i className="fa fa-times me-1"></i>
                                Clear
                            </Button>
                        )}
                    </div>

                    <Button
                        color="success"
                        className="px-4 fw-bold"
                        disabled={!commentStats.isValid}
                        type="submit"
                    >
                        {(
                            <>
                                <i className="fa fa-paper-plane me-2"></i>
                                Post Comment
                            </>
                        )}
                    </Button>
                </div>
            </FormGroup>

            {/* Help text */}
            {isFocused && (
                <small className="text-muted d-block mt-2">
                    <i className="fa fa-lightbulb me-1"></i>
                    <strong>Tip:</strong> Be respectful and constructive. Your comments help others learn!
                </small>
            )}
        </Form>
    );
};

export default AddComment;
