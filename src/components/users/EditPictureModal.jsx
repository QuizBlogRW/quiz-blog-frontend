import { useState, useEffect, useRef } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  UncontrolledTooltip,
} from 'reactstrap';
import uploadimage from '@/images/uploadimage.svg';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfileImage } from '@/redux/slices/usersSlice';
import ImageWithFallback from '@/utils/ImageWithFallback';
import { notify } from '@/utils/notifyToast';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];

const EditPictureModal = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const userImage = user?.image;

  const [modalOpen, setModalOpen] = useState(false);
  const [fileData, setFileData] = useState({ file: null, preview: null });
  const [validationMessage, setValidationMessage] = useState('');

  const wrapperRef = useRef(null);

  const toggleModal = () => setModalOpen((prev) => !prev);

  // Clean up preview URL on unmount or file change
  useEffect(() => {
    return () => {
      if (fileData.preview) URL.revokeObjectURL(fileData.preview);
    };
  }, [fileData.preview]);

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) return 'Unsupported file type. Use jpg, png, or svg.';
    if (file.size > MAX_FILE_SIZE) return 'File too large. Max 2MB.';
    return '';
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setValidationMessage(error);
      notify(error, 'error');
      setFileData({ file: null, preview: null });
      return;
    }

    setValidationMessage('');
    setFileData({ file, preview: URL.createObjectURL(file) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fileData.file) {
      setValidationMessage('Please choose an image to upload.');
      notify('The image is required!', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', fileData.file);

    dispatch(updateProfileImage({ formData, id: user?._id }));
    toggleModal();
  };

  return (
    <>
      {/* Profile image button */}
      <span
        className="upload-image upload-image-button"
        onClick={toggleModal}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleModal()}
        aria-label="Open edit profile image dialog"
        ref={wrapperRef}
      >
        <ImageWithFallback src={userImage} fallbackSrc={uploadimage} alt="profile image" id="profileTooltip" />
        <UncontrolledTooltip placement="bottom" target="profileTooltip">
          Click to update profile image
        </UncontrolledTooltip>
      </span>

      {/* Modal */}
      <Modal isOpen={modalOpen} toggle={toggleModal} className="resources-modal" aria-modal>
        <div className="modal-header-text d-flex justify-content-between align-items-center p-2 border border-warning border-2 rounded">
          <span className="h6 mb-0 text-white fw-bolder">Update profile picture</span>
          <Button className="cat-close-btn text-uppercase" onClick={toggleModal} aria-label="Close dialog">
            Close
          </Button>
        </div>

        <ModalBody>
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <FormGroup>
              <Label for="profilePicture" className="my-2">
                <strong>Upload picture</strong>&nbsp;
                <small className="text-muted">(.jpg, .jpeg, .png, .svg) — max 2MB</small>
              </Label>

              {/* Preview */}
              <div className="mb-2">
                {fileData.preview ? (
                  <img src={fileData.preview} alt="Selected preview" className="img-fluid rounded" style={{ maxHeight: '160px' }} />
                ) : (
                  <div className="text-muted">Current image will be used if you don&apos;t select another.</div>
                )}
              </div>

              <Input
                bsSize="sm"
                type="file"
                accept=".jpg,.jpeg,.png,.svg"
                name="profilePicture"
                id="profilePicture"
                className="pb-2"
                onChange={handleFileChange}
                aria-describedby="profileUploadHelp"
              />
              <small id="profileUploadHelp" className="form-text text-muted">
                Choose a square image for best results.
              </small>

              {validationMessage && (
                <div className="text-danger mt-2" role="alert" aria-live="assertive">
                  {validationMessage}
                </div>
              )}

              <Button className="btn-upload-brand mt-3" block type="submit">
                Upload
              </Button>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default EditPictureModal;
