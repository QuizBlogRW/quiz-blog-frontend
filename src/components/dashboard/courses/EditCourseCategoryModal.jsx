import UpdateModal from '@/utils/UpdateModal';
import { updateCourseCategory } from '@/redux/slices/courseCategoriesSlice';
import { notify } from '@/utils/notifyToast';

const EditCourseCategoryModal = ({ idToUpdate, editTitle, editDesc }) => {
    const initialData = {
        idToUpdate,
        name: editTitle || '',
        description: editDesc || ''
    };

    const renderForm = (formState, setFormState, firstInputRef) => {
        const onChange = (e) => setFormState({ ...formState, [e.target.name]: e.target.value });
        return (
            <div>
                <div className="mb-2">
                    <label><strong>Title</strong></label>
                    <input ref={firstInputRef} type="text" name="name" placeholder="Course title ..." className="form-control mb-3" onChange={onChange} value={formState.name} />
                </div>
                <div className="mb-2">
                    <label><strong>Description</strong></label>
                    <input type="text" name="description" placeholder="Course description ..." className="form-control mb-3" onChange={onChange} value={formState.description} />
                </div>
            </div>
        );
    };

    const submitFn = (formState) => {
        const { idToUpdate, name, description } = formState;
        if (!name || name.length < 4 || !description || description.length < 4) {
            notify('Insufficient info!', 'error');
            throw new Error('validation');
        }
        if (name.length > 80) {
            notify('Title is too long!', 'error');
            throw new Error('validation');
        }
        if (description.length > 200) {
            notify('Description is too long!', 'error');
            throw new Error('validation');
        }

        const updatedCourse = { idToUpdate, title: name, description };
        // previous code passed setProgress; keep simple dispatch here
        return (dispatch) => dispatch(updateCourseCategory(updatedCourse));
    };
    return (
        <UpdateModal
            title="Edit Course"
            submitFn={submitFn}
            renderForm={renderForm}
            initialData={initialData}

        />
    );
};

export default EditCourseCategoryModal;