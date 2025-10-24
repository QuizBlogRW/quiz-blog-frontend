import { createNotes, getNotesByChapter } from '@/redux/slices/notesSlice'
import AddIcon from '@/images/plus.svg'
import AddModal from '@/utils/AddModal'
import { useSelector } from 'react-redux'
import { notify } from '@/utils/notifyToast'
import { useDispatch } from 'react-redux'

const AddNotesModal = ({ chapter }) => {

    const { user } = useSelector(state => state.auth)

    const initialState = {
        title: '',
        description: '',
        notes_file: null
    }

    const renderForm = (formState, setFormState, firstInputRef) => {
        const onChange = (e) => setFormState({ ...formState, [e.target.name]: e.target.value })
        const onFile = (e) => setFormState({ ...formState, notes_file: e.target.files[0] })

        return (
            <div>
                <div className="mb-2">
                    <label><strong>Title</strong></label>
                    <input ref={firstInputRef} type="text" name="title" placeholder="Notes name ..." className="form-control mb-3" value={formState.title} onChange={onChange} />
                </div>

                <div className="mb-2">
                    <label><strong>Description</strong></label>
                    <input type="text" name="description" placeholder="Notes description ..." className="form-control mb-3" value={formState.description} onChange={onChange} />
                </div>

                <div className="mb-2">
                    <label className="my-2"><strong>Upload</strong>&nbsp;<small className="text-success">.pdf, .doc, .docx, .ppt, .pptx</small></label>
                    <input type="file" accept=".pdf, .doc, .docx, .ppt, .pptx" name="notes_file" onChange={onFile} className="form-control" />
                </div>
            </div>
        )
    }

    const submitFn = (formState) => {
        const { title, description, notes_file } = formState

        // Build formData
        const formData = new FormData()
        formData.append('title', title)
        formData.append('description', description)
        if (notes_file) formData.append('notes_file', notes_file)
        if (!chapter) return Promise.reject(new Error('Chapter required'))
        formData.append('chapter', chapter._id)
        formData.append('course', chapter.course._id)
        formData.append('courseCategory', chapter.courseCategory)
        formData.append('uploaded_by', user ? user._id : null)

        // Many action creators for multipart accept formData directly; return a thunk to dispatch
        return (dispatch) => dispatch(createNotes(formData))
    }

    const validate = (formState) => {
        const { title, description, notes_file } = formState
        if (!title || title.length < 4 || !description || description.length < 4) {
            notify('Insufficient info!', 'error')
            throw new Error('validation')
        }
        if (title.length > 80) {
            notify('Title is too long!', 'error')
            throw new Error('validation')
        }
        if (!chapter) {
            notify('The chapter is required!', 'error')
            throw new Error('validation')
        }
        if (!notes_file) {
            notify('The file is required!', 'error')
            throw new Error('validation')
        }
        if (description.length > 200) {
            notify('Description is too long!', 'error')
            throw new Error('validation')
        }
        return true
    }

    const submitWrapper = async (formState) => {
        validate(formState)
        return submitFn(formState)
    }

    const dispatch = useDispatch()
    const onSuccess = () => {
        notify('Notes added', 'success')
        // Refresh notes list for this chapter
        if (chapter && chapter._id) dispatch(getNotesByChapter(chapter._id))
    }

    return (
        <AddModal
            title={<><img src={AddIcon} alt="" width="10" height="10" className="mb-1" />&nbsp;Add Notes</>}
            submitFn={submitWrapper}
            renderForm={renderForm}
            initialState={initialState}
            onSuccess={onSuccess}
            triggerText={null}
        />
    )
}

export default AddNotesModal
