import UpdateModal from '@/utils/UpdateModal';
import { updateFaq } from '@/redux/slices/faqsSlice';
import { notify } from '@/utils/notifyToast';

const EditFaq = ({ faqToEdit }) => {

  const initialData = {
    faqID: faqToEdit._id,
    title: faqToEdit.title || '',
    answer: faqToEdit.answer || '',
  };

  const validate = (title, answer) => {
    if (!title || title.length < 4)
      return notify('Title must be at least 4 characters!', 'error');

    if (!answer || answer.length < 4)
      return notify('Answer must be at least 4 characters!', 'error');

    if (title.length > 200)
      return notify('Title is too long (max 200 chars)!', 'error');

    if (answer.length > 1000)
      return notify('Answer is too long (max 1000 chars)!', 'error');

    return true;
  };

  const renderForm = (formState, setFormState, firstInputRef) => {
    const update = (e) =>
      setFormState({ ...formState, [e.target.name]: e.target.value });

    return (
      <>
        <div className="mb-3">
          <label className="fw-bold">Title</label>
          <input
            ref={firstInputRef}
            type="text"
            name="title"
            className="form-control mb-3"
            placeholder="FAQ title..."
            value={formState.title}
            onChange={update}
            maxLength={200}
          />
        </div>

        <div className="mb-3">
          <label className="fw-bold">Answer</label>
          <textarea
            name="answer"
            className="form-control mb-3"
            placeholder="FAQ answer..."
            value={formState.answer}
            onChange={update}
            rows={4}
            maxLength={1000}
          />
        </div>
      </>
    );
  };

  const submitFn = (formState) => {
    const { faqID, title, answer } = formState;

    if (!validate(title, answer)) {
      throw new Error('validation');
    }

    return (dispatch) =>
      dispatch(updateFaq({ faqID, title, answer }));
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
