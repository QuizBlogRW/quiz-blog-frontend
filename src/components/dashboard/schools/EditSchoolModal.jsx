import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import UpdateModal from '@/utils/UpdateModal'
import { getOneSchool, updateSchool } from '@/redux/slices/schoolsSlice'
import { notify } from '@/utils/notifyToast'
import EditIcon from '@/images/edit.svg'

const EditSchoolModal = ({ idToUpdate }) => {
    const dispatch = useDispatch()
    const oneSchool = useSelector(state => state.schools.oneSchool)

    useEffect(() => { dispatch(getOneSchool(idToUpdate)) }, [dispatch, idToUpdate])

    const initialData = { title: oneSchool ? oneSchool.title : '' }

    const renderForm = (formState, setFormState, firstInputRef) => {
        const onChange = (e) => setFormState({ ...formState, [e.target.name]: e.target.value })
        return (
            <div>
                <div className="mb-2">
                    <label><strong>Title</strong></label>
                    <input ref={firstInputRef} value={formState.title} type="text" name="title" id="title" className="form-control mb-3" onChange={onChange} required />
                </div>
            </div>
        )
    }

    const submitFn = (formState) => {
        const { title } = formState
        if (!title || title.length < 3) {
            notify('Insufficient info!', 'error')
            throw new Error('validation')
        }
        if (title.length > 70) {
            notify('Title is too long!', 'error')
            throw new Error('validation')
        }
        return (dispatch) => dispatch(updateSchool({ idToUpdate, title }))
    }

    const onSuccess = () => notify('School updated', 'success')

    return (
        <UpdateModal
            title="Edit School"
            submitFn={submitFn}
            renderForm={renderForm}
            initialData={initialData}
            onSuccess={onSuccess}
        />
    )
}

export default EditSchoolModal