import { useSelector } from 'react-redux';
import UpdateModal from '@/utils/UpdateModal';
import { updatePostCategory } from '@/redux/slices/postCategoriesSlice';
import { notify } from '@/utils/notifyToast';

const EditBPCategory = ({ categoryToEdit }) => {

  const { user } = useSelector(state => state.users);

  const initialUpdateData = {
    pCID: categoryToEdit && categoryToEdit._id,
    title: categoryToEdit && categoryToEdit.title || '',
    description: categoryToEdit && categoryToEdit.description || '',
    creator: categoryToEdit && categoryToEdit.creator || user?._id
  };

  const renderForm = (formState, setFormState, firstInputRef) => {
    const onChange = (e) => setFormState({ ...formState, [e.target.name]: e.target.value });

    return (
      <div>
        <div className="mb-2">
          <label><strong>Title</strong></label>
          <input ref={firstInputRef} type="text" name="title" placeholder="Category title ..." className="form-control mb-3" onChange={onChange} value={formState.title} />
        </div>

        <div className="mb-2">
          <label><strong>Description</strong></label>
          <input type="text" name="description" placeholder="Category description ..." className="form-control mb-3" onChange={onChange} value={formState.description} />
        </div>
      </div>
    );
  };

  const submitFn = (formState) => {
    const { pCID, title, description } = formState;

    // VALIDATE
    if (!title || title.length < 4 || !description || description.length < 4) {
      notify('Insufficient info!', 'error');
      throw new Error('validation');
    }
    if (title.length > 50) {
      notify('Title is too long!', 'error');
      throw new Error('validation');
    }
    if (description.length > 100) {
      notify('Description is too long!', 'error');
      throw new Error('validation');
    }

    const updatedCategory = {
      idToUpdate: pCID,
      title,
      description,
      creator: user?._id
    };

    return (dispatch) => dispatch(updatePostCategory(updatedCategory));
  };

  return (
    <UpdateModal
      title="Edit Post Category"
      submitFn={submitFn}
      renderForm={renderForm}
      initialUpdateData={initialUpdateData}
    />
  );
};

export default EditBPCategory;
