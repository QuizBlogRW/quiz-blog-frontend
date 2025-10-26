import UpdateModal from '@/utils/UpdateModal'
import { updateFaculty } from '@/redux/slices/facultiesSlice'
import { notify } from '@/utils/notifyToast'

const EditFacultyModal = ({ idToUpdate, editTitle }) => {
    const initialData = { idToUpdate, title: editTitle || '', years: [] }

    const renderForm = (formState, setFormState, firstInputRef) => {
        const onChange = (e) => setFormState({ ...formState, [e.target.name]: e.target.value })
        const handleSelectYears = (e) => {
            const yearsnbr = []
            for (let i = 1; i <= e.target.value; i++) yearsnbr.push(`Year ${i}`)
            setFormState({ ...formState, years: yearsnbr })
        }

        return (
            <div>
                <div className="mb-2">
                    <label><strong>Title</strong></label>
                    <input ref={firstInputRef} value={formState.title} type="text" name="title" id="title" className="form-control mb-3" onChange={onChange} required />
                </div>

                <div className="mb-2">
                    <label><strong>Learning years</strong></label>
                    <select name="selectYear" className="form-control" onChange={handleSelectYears}>
                        <option>-- Select --</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                        <option value={6}>6</option>
                    </select>
                </div>
            </div>
        )
    }

    const submitFn = (formState) => {
        const { idToUpdate, title, years } = formState
        if (!title || title.length < 3 || !years || years.length < 1) {
            notify('Insufficient info!', 'error')
            throw new Error('validation')
        }
        if (title.length > 70) {
            notify('Title is too long!', 'error')
            throw new Error('validation')
        }
        return (dispatch) => dispatch(updateFaculty({ idToUpdate, title, years }))
    }
    return (
        <UpdateModal
            title="Edit Faculty"
            submitFn={submitFn}
            renderForm={renderForm}
            initialData={initialData}

        />
    )
}

export default EditFacultyModal