import UpdateModal from '@/utils/UpdateModal'
import { updateNotes } from '@/redux/slices/notesSlice'
import { notify } from '@/utils/notifyToast'
import EditIcon from '@/images/edit.svg'

// TODO: Needs to be fixed to edit a notes
const EditNotesModal = ({ idToUpdate, editTitle, editDesc }) => {
    const initialData = { idToUpdate, title: editTitle || '', description: editDesc || '', notes_file: null }

    const renderForm = (formState, setFormState, firstInputRef) => {
        const onChange = (e) => setFormState({ ...formState, [e.target.name]: e.target.value })
        const onFile = (e) => setFormState({ ...formState, notes_file: e.target.files[0] })
        return (
            <div>
                <div className="mb-2">
                    <label><strong>Title</strong></label>
                    <input ref={firstInputRef} type="text" name="title" placeholder="Notes title ..." className="form-control mb-3" onChange={onChange} value={formState.title} />
                </div>
                <div className="mb-2">
                    <label><strong>Description</strong></label>
                    <input type="text" name="description" placeholder="Notes description ..." className="form-control mb-3" onChange={onChange} value={formState.description} />
                </div>
                <div className="mb-2">
                    <label className="my-2"><strong>Upload</strong>&nbsp;<small className="text-success">.pdf, .doc, .docx, .ppt, .pptx</small></label>
                    <input bsSize="sm" type="file" accept=".pdf, .doc, .docx, .ppt, .pptx" name="notes_file" onChange={onFile} className="form-control" />
                </div>
            </div>
        )
    }

    const submitFn = (formState) => {
        const formData = new FormData()
        const { title, description, notes_file } = formState
        if (!title || title.length < 4 || !description || description.length < 4) {
            notify('Insufficient info!', 'error')
            throw new Error('validation')
        }
        if (title.length > 80) {
            notify('Title is too long!', 'error')
            throw new Error('validation')
        }
        if (description.length > 200) {
            notify('Description is too long!', 'error')
            throw new Error('validation')
        }

        formData.append('title', title)
        formData.append('description', description)
        if (notes_file) formData.append('notes_file', notes_file)

        return (dispatch) => dispatch(updateNotes({ idToUpdate, formData }))
    }

    const onSuccess = () => notify('Notes updated', 'success')

    return (
        <UpdateModal
            title="Edit Notes"
            submitFn={submitFn}
            renderForm={renderForm}
            initialData={initialData}
            onSuccess={onSuccess}
        />
    )
}

export default EditNotesModal