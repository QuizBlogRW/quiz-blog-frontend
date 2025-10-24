import { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  UncontrolledTooltip,
} from "reactstrap";
import uploadimage from "@/images/uploadimage.svg";
import { updateProfileImage } from "@/redux/slices/authSlice";
import { useSelector, useDispatch } from "react-redux";
import ImageWithFallback from "@/utils/ImageWithFallback";
import { notify } from "@/utils/notifyToast";

const EditPictureModal = ({ bgColor, clr }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userImage = user && user.image;
  const [profileImageState, setProfileImageState] = useState();
  const [profilePreview, setProfilePreview] = useState(null);
  const [validationMessage, setValidationMessage] = useState("");

  //properties of the modal
  const [modal, setModal] = useState(false);

  //showing and hiding modal
  const toggle = () => setModal(!modal);

  const onFileHandler = (e) => {
    if (user) {
      // Check if user is not null
      const file = e.target.files[0];
      if (!file) return;

      // simple client-side validation
      const allowed = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml"];
      if (!allowed.includes(file.type)) {
        setValidationMessage("Unsupported file type. Use jpg, png, or svg.");
        notify("Unsupported file type. Use jpg, png, or svg.", "error");
        setProfileImageState(undefined);
        setProfilePreview(null);
        return;
      }

      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        setValidationMessage("File too large. Max 2MB.");
        notify("File too large. Max 2MB.", "error");
        setProfileImageState(undefined);
        setProfilePreview(null);
        return;
      }

      setValidationMessage("");
      setProfileImageState(file);
      const url = URL.createObjectURL(file);
      setProfilePreview(url);
    }
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();

    // VALIDATE
    if (!profileImageState) {
      setValidationMessage("Please choose an image to upload");
      notify("The image is required!", "error");
      return;
    }

    // upload profile image
    formData.append("profile_image", profileImageState);

    // Attempt to upload
    dispatch(updateProfileImage({ formData, uId: user?._id }));
  };

  return (
    <>
      <span
        className="upload-image upload-image-button"
        onClick={toggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") toggle();
        }}
        aria-label="Open edit profile image dialog"
      >
        <ImageWithFallback
          src={userImage}
          fallbackSrc={uploadimage}
          alt="profile image"
          id="profileTootTip"
        />

        <UncontrolledTooltip placement="bottom" target="profileTootTip">
          Click to update profile image
        </UncontrolledTooltip>
      </span>

      <Modal
        isOpen={modal}
        toggle={toggle}
        className="resources-modal"
        aria-modal
      >
        <div className="edit-picture-header d-flex justify-content-between align-items-center p-2 border border-warning border-2 rounded">
          <span className="h6 mb-0 text-white fw-bolder">
            Update profile picture
          </span>
          <Button
            className="cat-close-btn text-uppercase"
            onClick={toggle}
            aria-label="Close edit picture dialog"
          >
            Close
          </Button>
        </div>

        <ModalBody>
          <Form onSubmit={onSubmitHandler} encType="multipart/form-data">
            <FormGroup>
              <Label for="profile_image" className="my-2">
                <strong>Upload picture</strong>&nbsp;
                <small className="text-muted">
                  {" "}
                  (.jpg, .jpeg, .png, .svg) — max 2MB
                </small>
              </Label>

              {/* Preview */}
              <div className="mb-2">
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Selected preview"
                    className="img-fluid rounded"
                    style={{ maxHeight: "160px" }}
                  />
                ) : (
                  <div className="text-muted">
                    Current image will be used if you don't select another.
                  </div>
                )}
              </div>

              <Input
                bsSize="sm"
                type="file"
                accept=".jpg, .jpeg, .png, .svg"
                name="profile_image"
                onChange={onFileHandler}
                label="Choose an image to upload ..."
                id="profile_image_pick"
                className="pb-2"
                aria-describedby="profileUploadHelp"
              />
              <small id="profileUploadHelp" className="form-text text-muted">
                Choose a square image for best results.
              </small>

              {validationMessage && (
                <div
                  className="text-danger mt-2"
                  role="alert"
                  aria-live="assertive"
                >
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
