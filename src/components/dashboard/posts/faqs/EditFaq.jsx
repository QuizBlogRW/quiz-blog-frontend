import UpdateModal from '@/utils/UpdateModal';
import { updateFaq } from '@/redux/slices/faqsSlice';
import { notify } from '@/utils/notifyToast';

const EditFaq = ({ faqToEdit }) => {
  const initialData = {
    faqID: faqToEdit._id,
    title: faqToEdit.title || '',
    answer: faqToEdit.answer || '',
  };

  const renderForm = (formState, setFormState, firstInputRef) => {
    const onChange = (e) =>
      setFormState({ ...formState, [e.target.name]: e.target.value });
    return (
      <div>
        <div className="mb-3">
          <label>
            <strong>Title</strong>
          </label>
          <input
            ref={firstInputRef}
            type="text"
            name="title"
            placeholder="FAQ title ..."
            className="form-control mb-3"
            onChange={onChange}
            value={formState.title}
          />
        </div>

        <div className="mb-3">
          <label>
            <strong>Answer</strong>
          </label>
          <input
            type="text"
            name="answer"
            placeholder="FAQ answer ..."
            className="form-control mb-3"
            onChange={onChange}
            value={formState.answer}
          />
        </div>
      </div>
    );
  };

  const submitFn = (formState) => {
    const { faqID, title, answer } = formState;
    if (!title || title.length < 4 || !answer || answer.length < 4) {
      notify('Insufficient info!', 'error');
      throw new Error('validation');
    }
    if (title.length > 50) {
      notify('Title is too long!', 'error');
      throw new Error('validation');
    }
    if (answer.length > 100) {
      notify('Answer is too long!', 'error');
      throw new Error('validation');
    }

    return (dispatch) => dispatch(updateFaq({ faqID, title, answer }));
  };
  return (
    <UpdateModal
      title="Edit FAQ"
      submitFn={submitFn}
      renderForm={renderForm}
      initialData={initialData}
    />
  );
};

export default EditFaq;
