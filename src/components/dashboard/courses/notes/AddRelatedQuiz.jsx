import { useEffect } from 'react';
import AddModal from '@/utils/AddModal';
import { getQuizzesByNotes } from '@/redux/slices/quizzesSlice';
import { addNotesQuizzes } from '@/redux/slices/notesSlice';
import { useSelector, useDispatch } from 'react-redux';
import AddIcon from '@/images/plus.svg';

// TODO: Wrong, needs to push quizzes IDs into specific Notes Model
const AddRelatedQuiz = ({ noteID }) => {

    const dispatch = useDispatch();
    const notesQuizzes = useSelector(state => state.quizzes.notesQuizzes);

    const initialState = {
        quizID: ''
    };

    useEffect(() => {
        if (noteID) {
            dispatch(getQuizzesByNotes(noteID));
        }
    }, [noteID, dispatch]);

    const renderForm = (formState, setFormState, firstInputRef) => {
        const onChange = (e) => setFormState({ ...formState, quizID: e.target.value });
        return (
            <div>
                <div className="mb-2">
                    <label><strong>Quiz Title</strong></label>
                    <select ref={firstInputRef} name="quizID" className="form-control mb-3" onChange={onChange} value={formState.quizID || ''}>
                        <option value="">Select a quiz</option>
                        {notesQuizzes && notesQuizzes.map(quiz =>
                            <option key={quiz._id} value={quiz._id}>
                                {quiz.title}
                            </option>)}
                    </select>
                </div>
            </div>
        );
    };

    const submitFn = (formState) => {
        const payload = { noteID, quizzesState: formState.quizID };
        return (dispatch) => dispatch(addNotesQuizzes(payload));
    };

    const validate = (formState) => {
        if (!formState.quizID) throw new Error('validation');
        return true;
    };

    const submitWrapper = async (formState) => {
        validate(formState);
        return submitFn(formState);
    };
    return (
        <AddModal
            title={<><img src={AddIcon} alt="" width="10" height="10" className="mb-1" />&nbsp; Quizzes</>}
            submitFn={submitWrapper}
            renderForm={renderForm}
            initialState={initialState}

            triggerText={null}
        />
    );
};

export default AddRelatedQuiz;