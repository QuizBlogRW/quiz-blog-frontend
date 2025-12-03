import AddModal from '@/utils/AddModal';
import { Input } from 'reactstrap';
import { useSelector } from 'react-redux';
import { createFq } from '@/redux/slices/faqsSlice';
import validators from '@/utils/validators';

const CreateFaq = () => {
    const { user } = useSelector((state) => state.users);

    const initialState = {
        title: '',
        answer: '',
        created_by: user?._id || null,
    };

    const submitFn = async (data) => {
        const { title, answer } = data;

        const res = validators.validateTitleDesc(title, answer, {
            minTitle: 4,
            maxTitle: 200,
            minDesc: 4,
            maxDesc: 1000,
        });

        if (!res.ok) {
            return Promise.reject(new Error('validation'));
        }

        return createFq(data);
    };

    const renderForm = (state, setState, firstInputRef) => {
        const updateField = (e) =>
            setState({ ...state, [e.target.name]: e.target.value });

        return (
            <>
                <Input
                    innerRef={firstInputRef}
                    type="text"
                    name="title"
                    placeholder="FAQ title..."
                    className="mb-3"
                    value={state.title}
                    onChange={updateField}
                    maxLength={200}
                />

                <Input
                    type="textarea"
                    name="answer"
                    placeholder="FAQ answer..."
                    className="mb-3"
                    value={state.answer}
                    onChange={updateField}
                    minLength={4}
                    maxLength={1000}
                    style={{ minHeight: '120px' }}
                />
            </>
        );
    };

    return (
        <AddModal
            title="Create a FAQ"
            triggerText="FAQ"
            initialState={initialState}
            submitFn={submitFn}
            renderForm={renderForm}
        />
    );
};

export default CreateFaq;
