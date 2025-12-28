import { useState, useMemo, useEffect } from "react";
import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Input,
    ButtonGroup,
    Alert,
} from "reactstrap";
import { notify } from '@/utils/notifyToast';
import { saveFeedback } from "@/redux/slices/feedbacksSlice";
import { useDispatch } from "react-redux";

const RatingQuiz = ({ isOpen, toggle, quiz, score, user }) => {

    const [rating, setRating] = useState(-1);
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dispatch = useDispatch();

    const ONE_HOUR = 60 * 60 * 1000;

    // Use consistent key format: quiz-feedback-{quizId}-{userId}
    const feedbackKey = `quiz-feedback-${quiz}-${user}`;

    // --- Load existing feedback from localStorage ---
    useEffect(() => {
        if (!quiz || !user) return;

        const stored = localStorage.getItem(feedbackKey);
        if (!stored) return;

        try {
            const data = JSON.parse(stored);

            // If feedback is still valid (less than 1 hour old)
            if (Date.now() - data.timestamp <= ONE_HOUR) {
                setRating(data.rating);
                setComment(data.comment);

                // Auto-close modal if already submitted
                if (isOpen) {
                    setTimeout(toggle, 2000);
                }
            } else {
                // Expired → remove and allow new submission
                localStorage.removeItem(feedbackKey);
            }
        } catch {
            localStorage.removeItem(feedbackKey);
        }
    }, [quiz, user, feedbackKey, isOpen, toggle]);

    // --- Helpers -------------------------------------------------------
    const validate = () => {
        if (rating === -1) {
            setError("Please select a rating");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validate() || isSubmitting) return;

        setIsSubmitting(true);
        setError("");

        try {
            await dispatch(
                saveFeedback({ rating, comment, quiz, score, user })
            ).unwrap();

            // Save with timestamp to prevent duplicates
            const feedbackData = {
                rating,
                comment,
                timestamp: Date.now(),
                quizId: quiz,
                scoreId: score,
            };

            localStorage.setItem(feedbackKey, JSON.stringify(feedbackData));

            notify("Thank you for your feedback!", "success");

            // Close modal after short delay
            setTimeout(() => {
                toggle();
                // Reset form
                setRating(-1);
                setComment("");
            }, 1000);

        } catch (err) {
            console.error("Feedback submission error:", err);
            setError("Failed to submit feedback. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const borderColor = useMemo(() => {
        if (rating === 0) return "#dc3545";
        if (rating >= 5) return "#28a745";
        if (rating > 0) return "#ffc107";
        return "#ced4da";
    }, [rating]);

    const ratingColor = (value) => {
        if (value === 0) return "danger";
        if (value >= 5) return "success";
        return "warning";
    };

    const ratingButtons = useMemo(
        () =>
            Array.from({ length: 11 }, (_, i) => (
                <Button
                    key={i}
                    color={rating === i ? ratingColor(i) : "white"}
                    onClick={() => {
                        setRating(i);
                        setError("");
                    }}
                    className="border border-secondary rounded-circle m-1 shadow-sm"
                    size="sm"
                    disabled={isSubmitting}
                >
                    {i}
                </Button>
            )),
        [rating, isSubmitting]
    );

    // --- UI ------------------------------------------------------------
    return (
        <Modal isOpen={isOpen} toggle={toggle} backdrop="static" centered>
            {/* Header */}
            <div
                className="d-flex justify-content-between align-items-center p-2"
                style={{
                    backgroundColor: "var(--brand)",
                    color: "#fff",
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                }}
            >
                <span className="fw-bold">Please give us your feedback</span>
                <Button
                    color="danger"
                    size="sm"
                    outline
                    onClick={toggle}
                    disabled={isSubmitting}
                >
                    X
                </Button>
            </div>

            {/* Error */}
            {error && (
                <Alert color="danger" className="text-center my-3 mx-3">
                    {error}
                </Alert>
            )}

            <ModalBody className="p-2">
                <Form className="p-1">
                    <h6 className="text-center mb-3 fw-bold">How would you rate this quiz?</h6>

                    {/* Rating buttons */}
                    <FormGroup className="d-flex justify-content-center flex-wrap">
                        <ButtonGroup size="sm" className="flex-wrap justify-content-center">
                            {ratingButtons}
                        </ButtonGroup>
                    </FormGroup>

                    {/* Comment */}
                    <FormGroup className="mt-3">
                        <Input
                            bsSize="sm"
                            type="textarea"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Any suggestions for improvement?"
                            disabled={isSubmitting}
                            style={{
                                borderColor,
                                borderRadius: 8,
                                padding: "0.5rem",
                            }}
                        />
                    </FormGroup>
                </Form>
            </ModalBody>

            <ModalFooter className="d-flex justify-content-center flex-wrap">
                <Button
                    color="success"
                    onClick={handleSubmit}
                    outline
                    size="sm"
                    className="m-1"
                    disabled={rating === -1 || isSubmitting}
                >
                    {isSubmitting ? "Submitting..." : "Submit"}
                </Button>

                <Button
                    color="danger"
                    onClick={toggle}
                    outline
                    size="sm"
                    className="m-1"
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default RatingQuiz;
