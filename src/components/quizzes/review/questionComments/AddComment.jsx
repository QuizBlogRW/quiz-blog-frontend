import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form, FormGroup, Input } from 'reactstrap'
import { createComment } from '@/redux/slices/questionsCommentsSlice'
import { notify } from '@/utils/notifyToast'

const AddComment = ({ question, quiz, fromSingleQuestion }) => {

    const dispatch = useDispatch()
    const [comment, setComment] = useState('')
    const { user } = useSelector(state => state.auth)
    const onChangeHandler = (e) => setComment(e.target.value)

    const onSubmitHandler = e => {
        e.preventDefault()

        // VALIDATE
        if (comment.length < 4) {
            notify('Insufficient info!', 'error')
            return
        }

        if (comment.length > 1000) {
            notify('Comment is too long!', 'error')
            return
        }

        // Create new question object
        const newComment = {
            sender: user._id,
            question,
            quiz,
            comment,
        }

        // Attempt to create
        dispatch(createComment(newComment, fromSingleQuestion))
        setComment('')
    }

    return (
        <>
            <Form onSubmit={onSubmitHandler}>
                <FormGroup>
                    <Input type="textarea" rows="3" name="comment" placeholder="Your comment ..." className="mb-3" minLength="4" maxLength="1000" onChange={onChangeHandler} value={comment} />
                    <Button color="success" style={{ marginTop: '0.5rem', width: '50%', marginLeft: '25%' }}>Send</Button>
                </FormGroup>
            </Form>
        </>)

}

export default AddComment
