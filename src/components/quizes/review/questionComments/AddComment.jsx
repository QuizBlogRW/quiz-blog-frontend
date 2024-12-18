import React, { useState } from 'react'
import { Button, Form, FormGroup, Input } from 'reactstrap'
import { createComment } from '../../../../redux/slices/questionCommentsSlice'
import { useDispatch } from 'react-redux'

const AddComment = ({ question, quiz, fromSingleQuestion }) => {

    const dispatch = useDispatch()

    const [comment, setComment] = useState('')
    const currentUser = useSelector(state => state.auth && state.auth.user)
    const userId = currentUser && currentUser._id


    const onChangeHandler = (e) => {
        setComment(e.target.value)
    }

    const onSubmitHandler = e => {
        e.preventDefault()

        // VALIDATE
        if (comment.length < 4) {
            notify('Insufficient info!')
            return
        }

        else if (comment > 1000) {
            notify('Comment is too long!')
            return
        }

        // Create new question object
        const newComment = {
            sender: userId,
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
                    <Input type="textarea" rows="3" name="comment" placeholder="Your comment ..." className="mb-3" minLength="4" maxLength="1000" onChange={onChangeHandler} />
                    <Button color="success" style={{ marginTop: '0.5rem', width: '50%', marginLeft: '25%' }}>Send</Button>
                </FormGroup>
            </Form>
        </>)
}

export default AddComment