import React, { useState, useContext } from 'react'
import { Button, Form, FormGroup, Input } from 'reactstrap'
import { createComment } from '../../../../redux/slices/questionCommentsSlice'
import { useDispatch } from 'react-redux'
import Notification from '../../../../utils/Notification'
import { currentUserContext } from '../../../../appContexts'

const AddComment = ({ question, quiz, fromSingleQuestion }) => {

    const dispatch = useDispatch()

    const [comment, setComment] = useState('')
    const currentUser = useContext(currentUserContext)
    const userId = currentUser && currentUser._id

    // Errors state on form
    const [errorsState, setErrorsState] = useState([])

    const onChangeHandler = (e) => {
        setErrorsState([])
        setComment(e.target.value)
    }

    const onSubmitHandler = e => {
        e.preventDefault()

        // VALIDATE
        if (comment.length < 4) {
            setErrorsState(['Insufficient info!'])
            return
        }

        else if (comment > 1000) {
            setErrorsState(['Comment is too long!'])
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
                <Notification errorsState={errorsState} progress={null} initFn="createComment" />
                <FormGroup>
                    <Input type="textarea" rows="3" name="comment" placeholder="Your comment ..." className="mb-3" minLength="4" maxLength="1000" onChange={onChangeHandler} />
                    <Button color="success" style={{ marginTop: '0.5rem', width: '50%', marginLeft: '25%' }}>Send</Button>
                </FormGroup>
            </Form>
        </>)
}

export default AddComment