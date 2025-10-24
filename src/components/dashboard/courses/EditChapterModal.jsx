import UpdateModal from '@/utils/UpdateModal'
import { updateChapter, getChapters } from '@/redux/slices/chaptersSlice'
import { notify } from '@/utils/notifyToast'
import EditIcon from '@/images/edit.svg'
import { useDispatch } from 'react-redux'

const EditChapterModal = ({ idToUpdate, editTitle, editDesc }) => {
    const initialData = {
        idToUpdate,
        name: editTitle || '',
        description: editDesc || ''
    }

    const renderForm = (formState, setFormState, firstInputRef) => {
        const onChange = (e) => setFormState({ ...formState, [e.target.name]: e.target.value })
        return (
            <div>
                <div className="mb-2">
                    <label><strong>Title</strong></label>
                    <input ref={firstInputRef} type="text" name="name" placeholder="Chapter title ..." className="form-control mb-3" onChange={onChange} value={formState.name} />
                </div>
                <div className="mb-2">
                    <label><strong>Description</strong></label>
                    <input type="text" name="description" placeholder="Chapter description ..." className="form-control mb-3" onChange={onChange} value={formState.description} />
                </div>
            </div>
        )
    }

    const submitFn = (formState) => {
        const { idToUpdate, name, description } = formState
        if (!name || name.length < 4 || !description || description.length < 4) {
            notify('Insufficient info!', 'error')
            throw new Error('validation')
        }
        if (name.length > 80) {
            notify('Title is too long!', 'error')
            throw new Error('validation')
        }
        if (description.length > 200) {
            notify('Description is too long!', 'error')
            throw new Error('validation')
        }

        const updatedChapter = { idToUpdate, title: name, description }
        return (dispatch) => dispatch(updateChapter(updatedChapter))
    }

    const dispatch = useDispatch()
    const onSuccess = () => {
        notify('Chapter updated', 'success')
        dispatch(getChapters())
    }

    return (
        <UpdateModal
            title="Edit chapter"
            submitFn={submitFn}
            renderForm={renderForm}
            initialData={initialData}
            onSuccess={onSuccess}
        />
    )
}

export default EditChapterModal