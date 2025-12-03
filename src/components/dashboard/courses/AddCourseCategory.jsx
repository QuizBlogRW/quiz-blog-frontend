import AddModal from '@/utils/AddModal';
import { createCourseCategory } from '@/redux/slices/courseCategoriesSlice';
import { useSelector } from 'react-redux';
import validators from '@/utils/validators';
import { Input } from 'reactstrap';

const AddCourseCategory = () => {
    const { user, isLoading } = useSelector(state => state.users);

    return (
        <AddModal
            title="Add New Course Category"
            triggerText="Course Category"
            initialState={{ title: '', description: '' }}
            submitFn={data => {
                const { title, description } = data;
                const res = validators.validateTitleDesc(title, description, { minTitle: 4, minDesc: 4, maxTitle: 70, maxDesc: 120 });
                if (!res.ok) return Promise.reject(new Error('validation'));
                return createCourseCategory({ title, description, created_by: isLoading === false ? user._id : null });
            }}
            renderForm={(state, setState, firstInputRef) => (
                <>
                    <Input ref={firstInputRef} type="text" name="title" id="title" placeholder="Course category title ..." className="mb-3" onChange={e => setState({ ...state, title: e.target.value })} value={state.title || ''} />
                    <Input type="text" name="description" id="description" placeholder="Course category description ..." className="mb-3" onChange={e => setState({ ...state, description: e.target.value })} value={state.description || ''} />
                </>
            )}
        />
    );
};

export default AddCourseCategory;