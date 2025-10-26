import { useSelector } from 'react-redux';
import UpdateModal from '@/utils/UpdateModal';
import { updateQuiz } from '@/redux/slices/quizzesSlice';
import { notify } from '@/utils/notifyToast';

const EditQuiz = ({ quizToEdit }) => {

    const categories = useSelector(state => state.categories);
    const { user, isLoading } = useSelector(state => state.auth);

    const initialData = {
        quizID: quizToEdit._id,
        name: quizToEdit.title || '',
        description: quizToEdit.description || '',
        oldCategoryID: quizToEdit.category && quizToEdit.category._id || null,
        category: quizToEdit.category && quizToEdit.category._id || null,
    };

    const renderForm = (formState, setFormState, firstInputRef) => {
        const onChange = (e) => setFormState({ ...formState, [e.target.name]: e.target.value });
        return (
            <div>
                <div className="mb-2">
                    <label><strong>Title</strong></label>
                    <input ref={firstInputRef} type="text" name="name" placeholder="Quiz name ..." className="form-control mb-3" onChange={onChange} value={formState.name} />
                </div>

                <div className="mb-2">
                    <label><strong>Description</strong></label>
                    <input type="text" name="description" placeholder="Category description ..." className="form-control mb-3" onChange={onChange} value={formState.description} />
                </div>

                <div className="mb-2">
                    <select name="category" className="form-control mb-3" onChange={onChange} value={formState.category}>
                        {categories && categories.allcategories && categories.allcategories.map(category => (
                            <option key={category._id} value={category._id}>{category.title}</option>
                        ))}
                    </select>
                </div>
            </div>
        );
    };

    const submitFn = (formState) => {
        const { quizID, name, description, category, oldCategoryID } = formState;
        if (!name || name.length < 4 || !description || description.length < 4) {
            notify('Insufficient info!', 'error');
            throw new Error('validation');
        }
        if (name.length > 70) {
            notify('Title is too long!', 'error');
            throw new Error('validation');
        }
        if (description.length > 120) {
            notify('Description is too long!', 'error');
            throw new Error('validation');
        }

        const updatedQuiz = {
            quizID,
            title: name,
            description,
            last_updated_by: isLoading ? null : user._id,
            category,
            oldCategoryID
        };

        return (dispatch) => dispatch(updateQuiz(updatedQuiz));
    };

    return (
        <UpdateModal
            title="Edit Quiz"
            submitFn={submitFn}
            renderForm={renderForm}
            initialData={initialData}
        >
            {/* trigger image retained via UpdateModal's button; keep behavior consistent */}
        </UpdateModal>
    );
};

export default EditQuiz;