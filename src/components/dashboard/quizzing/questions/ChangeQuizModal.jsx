import { useEffect, useState } from 'react'
import { updateQuestion } from '@/redux/slices/questionsSlice'
import { getQuizzesByCategory } from '@/redux/slices/quizzesSlice'
import { useSelector, useDispatch } from 'react-redux'
import UpdateModal from '@/utils/UpdateModal'
import { notify } from '@/utils/notifyToast'


const ChangeQuizModal = ({ questionID, oldQuizID, questionCatID }) => {

    // Redux
    const dispatch = useDispatch()
    const categoryQuizzes = useSelector(state => state.quizzes.categoryQuizzes)
    const { user, isLoading } = useSelector(state => state.auth)

    const initialData = { questionID, newQuizID: '' }

    useEffect(() => {
        if (questionCatID) dispatch(getQuizzesByCategory(questionCatID))
    }, [questionCatID, dispatch])

    const renderForm = (formState, setFormState, firstInputRef) => {
        const onChange = e => setFormState({ ...formState, [e.target.name]: e.target.value })
        return (
            <div>
                <label><strong>Quiz Title</strong></label>
                <select name="newQuizID" className="form-control mb-3" onChange={onChange} value={formState.newQuizID || ''}>
                    {!formState.newQuizID ? <option>-- Select a quiz--</option> : null}
                    {categoryQuizzes && categoryQuizzes.map(quiz => quiz._id !== oldQuizID && (
                        <option key={quiz._1d || quiz._id} value={quiz._id}>{quiz.title}</option>
                    ))}
                </select>
            </div>
        )
    }

    const submitFn = (formState) => {
        const formData = new FormData()
        formData.append('newQuiz', formState.newQuizID)
        formData.append('oldQuizID', oldQuizID)
        formData.append('last_updated_by', isLoading === false ? user._id : null)

        return (dispatch) => dispatch(updateQuestion({ questionID: formState.questionID, formData }))
    }

    const onSuccess = () => {
        notify('Question updated', 'success')
    }

    return (
        <UpdateModal
            title="Change Quiz"
            submitFn={submitFn}
            renderForm={renderForm}
            initialData={initialData}
            onSuccess={onSuccess}
            afterSuccess="reload"
        />
    )
}

export default ChangeQuizModal