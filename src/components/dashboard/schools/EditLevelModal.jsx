import UpdateModal from '@/utils/UpdateModal';
import { updateLevel } from '@/redux/slices/levelsSlice';
import { notify } from '@/utils/notifyToast';

const EditLevelModal = ({ idToUpdate, editTitle }) => {
    const initialData = { idToUpdate, title: editTitle || '' };

    const renderForm = (formState, setFormState, firstInputRef) => {
        const onChange = (e) => setFormState({ ...formState, [e.target.name]: e.target.value });
        return (
            <div>
                <div className="mb-2">
                    <label><strong>Title</strong></label>
                    <input ref={firstInputRef} value={formState.title} type="text" name="title" id="title" className="form-control mb-3" onChange={onChange} required />
                </div>
            </div>
        );
    };

    const submitFn = (formState) => {
        const { idToUpdate, title } = formState;
        if (!title || title.length < 3) {
            notify('Insufficient info!', 'error');
            throw new Error('validation');
        }
        if (title.length > 70) {
            notify('Title is too long!', 'error');
            throw new Error('validation');
        }
        return (dispatch) => dispatch(updateLevel({ idToUpdate, title }));
    };

    return (
        <UpdateModal
            title="Edit Level"
            submitFn={submitFn}
            renderForm={renderForm}
            initialData={initialData}

        />
    );
};

export default EditLevelModal;