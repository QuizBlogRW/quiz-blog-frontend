import { useSelector } from 'react-redux';
import UpdateModal from '@/utils/UpdateModal';
import { updateQuiz } from '@/redux/slices/quizzesSlice';
import { notify } from '@/utils/notifyToast';

const EditQuiz = ({ quizToEdit }) => {

    const { allcategories } = useSelector((state) => state.categories) || {};
    const { user, isLoading } = useSelector((state) => state.users);

    const initialData = {
        quizID: quizToEdit._id,
        name: quizToEdit.title || '',
        description: quizToEdit.description || '',
        oldCategoryID: quizToEdit.category?._id ?? null,
        category: quizToEdit.category?._id ?? null,
    };

    const renderForm = (formState, setFormState, firstInputRef) => {

        const onChange = (e) => {
            const { name, value } = e.target;
            setFormState((prev) => ({ ...prev, [name]: value }));
        };

        return (
            <div>
                <div className="mb-3">
                    <label><strong>Title</strong></label>
                    <input
                        ref={firstInputRef}
                        type="text"
                        name="name"
                        placeholder="Quiz name ..."
                        className="form-control"
                        onChange={onChange}
                        value={formState.name}
                    />
                </div>

                {formState.description && <div className="mb-3">
                    <label><strong>Description</strong></label>
                    <input
                        type="text"
                        name="description"
                        placeholder="Quiz description ..."
                        className="form-control"
                        onChange={onChange}
                        value={formState.description}
                    />
                </div>}

                <div className="mb-3">
                    <label><strong>Category</strong></label>
                    <select
                        name="category"
                        className="form-control"
                        onChange={onChange}
                        value={formState.category}
                    >
                        {allcategories?.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.title}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        );
    };

    const submitFn = (formState) => {
        const { quizID, name, description, category, oldCategoryID } = formState;

        // Validation
        if (!name || name.length < 4 || !description || description.length < 4) {
            notify('Insufficient info!', 'error');
            return null;
        }
        if (name.length > 70) {
            notify('Title is too long!', 'error');
            return null;
        }
        if (description.length > 120) {
            notify('Description is too long!', 'error');
            return null;
        }

        const updatedQuiz = {
            quizID,
            title: name,
            description,
            category,
            oldCategoryID,
            last_updated_by: isLoading ? null : user?._id,
        };

        return (dispatch) => dispatch(updateQuiz(updatedQuiz));
    };

    return (
        <UpdateModal
            title="Edit Quiz"
            submitFn={submitFn}
            renderForm={renderForm}
            initialData={initialData}
        />
    );
};

export default EditQuiz;
