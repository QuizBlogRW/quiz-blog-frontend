import React, { useState } from 'react'
import { Button, Form, FormGroup, Input, Alert, Progress } from 'reactstrap'
import { connect } from 'react-redux'
import { createComment } from '../../../../redux/questionComments/questionComments.actions'

const AddComment = ({ createComment, currentUser, question, quiz, errors, successful, fromSingleQuestion }) => {

    const [comment, setComment] = useState('')
    const userId = currentUser && currentUser._id

    // progress
    const [progress, setProgress] = useState(false)

    // Alert
    const [visible, setVisible] = useState(true)
    const onDismiss = () => setVisible(false)

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
        createComment(newComment, fromSingleQuestion)
        setComment('')
        
        // Display the progress bar
        setProgress(true)
    }

    return (

        <>
            {/* Error frontend*/}
            {errorsState.length > 0 ?
                errorsState.map(err =>
                    <Alert color="danger" isOpen={visible} toggle={onDismiss} key={Math.floor(Math.random() * 1000)} className='border border-warning'>
                        {err}
                    </Alert>) :
                null
            }

            {/* Error backend */}
            {errors.id ?
                <Alert isOpen={visible} toggle={onDismiss} color='danger'>
                    <small>{errors.msg && errors.msg.msg}</small>
                </Alert> :

                successful.id ?
                    <Alert color='success' isOpen={visible} toggle={onDismiss} className='border border-warning'>
                        <small>{successful.msg && successful.msg}</small>
                    </Alert> : null
            }

            {(progress && !successful.id && !errors.id) ? <Progress animated color="warning" value={100} className='mb-2' /> : null}

            <Form onSubmit={onSubmitHandler}>
                <FormGroup>
                    <Input type="textarea" rows="3" name="comment" placeholder="Your comment ..." className="mb-3" minLength="4" maxLength="1000" onChange={onChangeHandler} />
                    <Button color="success" style={{ marginTop: '1rem' }}>Send</Button>
                </FormGroup>
            </Form>
        </>)
}

const mapStateToProps = state => ({
    errors: state.errorReducer,
    successful: state.successReducer
})

export default connect(mapStateToProps, { createComment })(AddComment)