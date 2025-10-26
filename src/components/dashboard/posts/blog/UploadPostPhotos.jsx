import AddModal from '@/utils/AddModal';
import { createImageUpload } from '@/redux/slices/imageUploadsSlice';
import { useSelector } from 'react-redux';
import { notify } from '@/utils/notifyToast';
import { Input } from 'reactstrap';

const UploadPostPhotos = () => {
  const { user } = useSelector((state) => state.auth);

  const initialState = {
    imageTitle: '',
    uploadImage: null,
    owner: user?._id,
  };

  const renderForm = (formState, setFormState) => {
    const onChange = (e) =>
      setFormState({ ...formState, [e.target.name]: e.target.value });

    const onFile = (e) =>
      setFormState({ ...formState, uploadImage: e.target.files[0] });

    return (
      <div>
        <div className="mb-2">
          <label>
            <strong className="text-success">Image name</strong>
          </label>
          <input
            type="text"
            name="imageTitle"
            placeholder="Image title ..."
            className="form-control mb-3"
            onChange={onChange}
            value={formState.imageTitle || ''}
          />
        </div>

        <div className="mb-2">
          <label>
            <strong className="text-success">Image</strong>&nbsp;
            <small className="text-info">.jpg, .png, .jpeg, .svg</small>
          </label>

          <Input
            bsSize="sm"
            type="file"
            accept=".jpg, .png, .jpeg, .svg"
            name="uploadImage"
            onChange={onFile}
            id="uploadImage_pick"
          />
        </div>
      </div>
    );
  };

  const validateAndNotify = (formState) => {
    const { imageTitle, uploadImage } = formState;
    if (!imageTitle || imageTitle.length < 4) {
      notify('Insufficient info!', 'error');
      throw new Error('validation');
    } else if (imageTitle.length > 70) {
      notify('Image title is too long!', 'error');
      throw new Error('validation');
    }

    if (!uploadImage) {
      notify('Please pick an image to upload', 'error');
      throw new Error('validation');
    }

    return true;
  };

  const submitWrapper = (formState) => {
    // synchronous validation first
    validateAndNotify(formState);

    const fd = new FormData();
    fd.append('imageTitle', formState.imageTitle);
    fd.append('uploadImage', formState.uploadImage);
    fd.append('owner', formState.owner);

    // return a thunk that AddModal will dispatch
    return (dispatch) => dispatch(createImageUpload(fd));
  };

  return (
    <AddModal
      title="Upload an Image"
      submitFn={submitWrapper}
      renderForm={renderForm}
      initialState={initialState}
      triggerText={'Image'}
    />
  );
};

export default UploadPostPhotos;
