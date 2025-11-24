import { useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, Form, FormGroup, Input, ButtonGroup, Alert } from 'reactstrap';

const ReviewForm = ({ isOpen, toggle, onSubmit, quiz, score, user }) => {
    const [rating, setRating] = useState(-1);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    const handleRatingChange = (value) => setRating(value);
    const handleCommentChange = (event) => setComment(event.target.value);

    const handleSubmit = () => {
        if (rating === -1) {
            setError('Please select a rating');
            return;
        }

        onSubmit({ rating, comment, quiz, score, user });
        toggle();

        // Reset form
        setRating(-1);
        setComment('');
        setError('');
    };

    const getColorByRating = (value) => {
        if (value === 0) return 'danger';
        if (value >= 5) return 'success';
        return 'warning';
    };

    const renderRatingButtons = () => {
        return Array.from({ length: 11 }, (_, i) => (
            <Button
                key={i}
                color={rating === i ? getColorByRating(i) : 'white'}
                onClick={() => handleRatingChange(i)}
                className="border border-secondary rounded-circle m-1 shadow-sm"
                size="sm"
            >
                {i}
            </Button>
        ));
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle} backdrop={false} centered>
            {/* Header */}
            <div
                className="d-flex justify-content-between align-items-center p-2"
                style={{ backgroundColor: 'var(--brand)', color: '#fff', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
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
                    <FormGroup className="d-flex justify-content-center flex-wrap">
                        <ButtonGroup size="sm" className="flex-wrap justify-content-center">
                            {renderRatingButtons()}
                        </ButtonGroup>
                    </FormGroup>

                    <FormGroup className="mt-3">
                        <Input
                            bsSize="sm"
                            type="textarea"
                            id="comment"
                            value={comment}
                            onChange={handleCommentChange}
                            placeholder="Any suggestions for improvement?"
                            style={{
                                borderColor:
                                    rating === 0 ? '#dc3545' :
                                        rating >= 5 ? '#28a745' :
                                            rating > 0 ? '#ffc107' : '#ced4da',
                                borderRadius: 8,
                                padding: '0.5rem'
                            }}
                        />
                    </FormGroup>
                </Form>
            </ModalBody>

            {/* Footer */}
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

export default ReviewForm;
