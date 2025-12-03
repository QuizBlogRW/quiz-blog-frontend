import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { createComment } from '@/redux/slices/questionsCommentsSlice';
import { notify } from '@/utils/notifyToast';

const AddComment = ({ question, quiz, fromSingleQuestion }) => {

    const dispatch = useDispatch();
    const [comment, setComment] = useState('');
    const { user } = useSelector(state => state.users);

    const onChangeHandler = (e) => setComment(e.target.value);

    const onSubmitHandler = (e) => {
        e.preventDefault();

        if (comment.length < 4) {
            notify('Insufficient info!', 'error');
            return;
        }

        if (comment.length > 1000) {
            notify('Comment is too long!', 'error');
            return;
        }

        const newComment = {
            sender: user._id,
            question,
            quiz,
            comment,
        };

        dispatch(createComment(newComment, fromSingleQuestion));
        setComment('');
    };

    return (
        <Form onSubmit={onSubmitHandler} className="p-2 p-md-3">
            <FormGroup>
                <Label className="fw-bold text-secondary">Add a comment</Label>
                <Input
                    type="textarea"
                    rows="3"
                    name="comment"
                    placeholder="Write something..."
                    className="mb-2 shadow-sm"
                    minLength="4"
                    maxLength="1000"
                    onChange={onChangeHandler}
                    value={comment}
                    style={{ backgroundColor: '#fafafa' }}
                />

                <div className="d-flex justify-content-end mt-3">
                    <Button
                        color="success"
                        className="px-4 fw-bold"
                        disabled={!comment.trim()}
                    >
                        Send
                    </Button>
                </div>
            </FormGroup>
        </Form>
    );
};

export default AddComment;
