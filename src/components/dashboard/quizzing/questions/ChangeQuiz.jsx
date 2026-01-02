import { useEffect } from 'react';
import { updateQuestion } from '@/redux/slices/questionsSlice';
import { getQuizzesByCategory } from '@/redux/slices/quizzesSlice';
import { useSelector, useDispatch } from 'react-redux';
import UpdateModal from '@/utils/UpdateModal';
import QBLoading from '@/utils/rLoading/QBLoadingSM';

const ChangeQuiz = ({ questionID, oldQuizID, questionCatID }) => {
  const dispatch = useDispatch();
  const { isLoading, categoryQuizzes } = useSelector((state) => state.quizzes);
  const { user } = useSelector((state) => state.users);

  const initialUpdateData = { questionID, newQuizID: '' };

  useEffect(() => {
    if (questionCatID) dispatch(getQuizzesByCategory(questionCatID));
  }, [questionCatID, dispatch]);

  const renderForm = (formState, setFormState, firstInputRef) => {
    const onChange = (e) =>
      setFormState({ ...formState, [e.target.name]: e.target.value });
    return (
      <>
        <label>
          <strong>Quiz Title</strong>
        </label>

        {isLoading ? (
          <QBLoading />
        ) : (
          <select
            name="newQuizID"
            className="form-control mb-3"
            onChange={onChange}
            value={formState.newQuizID || ''}
          >
            {!formState.newQuizID ? <option>-- Select a quiz--</option> : null}
            {categoryQuizzes &&
              categoryQuizzes.map(
                (quiz) =>
                  quiz._id !== oldQuizID && (
                    <option key={quiz._id || quiz._id} value={quiz._id}>
                      {quiz.title}
                    </option>
                  )
              )}
          </select>
        )}
      </>
    );
  };

  const submitFn = (formState) => {
    const formData = new FormData();
    formData.append('newQuiz', formState.newQuizID);
    formData.append('oldQuizID', oldQuizID);
    formData.append('last_updated_by', user._id ? user._id : null);
    return (dispatch) =>
      dispatch(updateQuestion({ questionID: formState.questionID, formData }));
  };

  return (
    <UpdateModal
      title="Change Quiz"
      submitFn={submitFn}
      renderForm={renderForm}
      initialUpdateData={initialUpdateData}
      triggerText="Change Quiz"
    />
  );
};

export default ChangeQuiz;
