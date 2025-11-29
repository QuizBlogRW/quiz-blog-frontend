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

const RatingQuiz = ({ isOpen, toggle, onSubmit, quiz, score, user }) => {
    const [rating, setRating] = useState(-1);
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const ONE_HOUR = 60 * 60 * 1000;

    // --- Load existing feedback from localStorage ---
    useEffect(() => {
        if (!score) return;

        const stored = localStorage.getItem(score);
        if (stored) {
            const data = JSON.parse(stored);

            // Remove if older than 1 hour
            if (Date.now() - data.timestamp > ONE_HOUR) {
                localStorage.removeItem(score);
            } else {
                setRating(data.rating);
                setComment(data.comment);
                setSubmitted(true);
            }
        }
    }, [score]);

    // --- Helpers -------------------------------------------------------
    const validate = () => {
        if (rating === -1) {
            setError("Please select a rating");
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        // Save to localStorage
        const data = {
            rating,
            comment,
            timestamp: Date.now(),
        };
        localStorage.setItem(score, JSON.stringify(data));

        onSubmit({ rating, comment, quiz, score, user });
        setSubmitted(true);
        toggle();

        // Reset
        setRating(-1);
        setComment("");
        setError("");
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
                    onClick={() => setRating(i)}
                    className="border border-secondary rounded-circle m-1 m-lg-2 shadow-sm"
                    size="sm"
                >
                    {i}
                </Button>
            )),
        [rating]
    );

    // --- UI ------------------------------------------------------------
    if (submitted) {
        return (
            <Alert color="success" className="text-center m-3">
                ✅ You already submitted feedback for this quiz.
            </Alert>
        );
    }

    return (
        <Modal isOpen={isOpen} toggle={toggle} backdrop={false} centered>
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
                <Button color="danger" size="sm" outline onClick={toggle}>
                    X
                </Button>
            </div>

            {/* Error */}
            {error && (
                <Alert color="danger" className="text-center my-3 mx-3">
                    {error}
                </Alert>
            )}

            <ModalBody>
                <Form>
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
                <Button color="success" onClick={handleSubmit} outline size="sm" className="m-1">
                    Submit
                </Button>
                <Button color="danger" onClick={toggle} outline size="sm" className="m-1">
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default RatingQuiz;
