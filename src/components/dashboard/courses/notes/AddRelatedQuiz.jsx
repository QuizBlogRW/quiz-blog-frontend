import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AddModal from '@/utils/AddModal';
import { getQuizzesByCourseCategory } from '@/redux/slices/quizzesSlice';
import { addQuizToNotes } from '@/redux/slices/notesSlice';
import AddIcon from '@/images/plus.svg';

const AddRelatedQuiz = ({ note }) => {

    const dispatch = useDispatch();
    const { isLoading, ccQuizzes } = useSelector((state) => state.quizzes);

    // Filter out quizzes that have already been added to the note
    const filteredQuizzes = note?.quizes ? ccQuizzes.filter((q) => !note?.quizes?.includes(q._id)) : ccQuizzes;

    // Form state
    const initialState = { quizID: '' };

    // Fetch quizzes for the course category
    useEffect(() => {
        if (note?.courseCategory?._id) {
            dispatch(getQuizzesByCourseCategory(note?.courseCategory?._id));
        }
    }, [dispatch, note]);


    // Render form
    const renderForm = (formState, setFormState, firstInputRef) => {
        const onChange = (e) => setFormState({ ...formState, quizID: e.target.value });

        return (
            <div>
                <div className="mb-2">
                    <label>
                        <strong>Quiz</strong>
                    </label>
                    {isLoading ? <em>Loading ...</em> :
                        <select
                            ref={firstInputRef}
                            name="quizID"
                            className="form-control mb-3"
                            value={formState.quizID}
                            onChange={onChange}
                        >
                            <option value="">Select a quiz</option>
                            {filteredQuizzes?.map((quiz) => (
                                <option key={quiz._id} value={quiz._id}>
                                    {quiz.title}
                                </option>
                            ))}
                        </select>}
                </div>
            </div>
        );
    };

    // Validation like AddQuiz
    const validate = (formState) => {
        if (!formState.quizID) {
            throw new Error('Please select a quiz');
        }
        return true;
    };

    const submitWrapper = (formState) => {
        validate(formState);
        return addQuizToNotes({ noteID: note._id, quizID: formState.quizID });
    };

    return (
        <AddModal
            title={
                <>
                    <img src={AddIcon} alt="" width="10" height="10" className="mb-1" />
                    &nbsp; Add Quiz
                </>
            }
            triggerText="Quiz"
            initialState={initialState}
            submitFn={submitWrapper}
            renderForm={renderForm}
        />
    );
};

export default AddRelatedQuiz;
