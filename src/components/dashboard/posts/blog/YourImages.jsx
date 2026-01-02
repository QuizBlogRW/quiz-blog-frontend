import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Col,
  Row,
  Card,
  CardBody,
  Alert,
  Button,
  Badge,
  Spinner,
  UncontrolledTooltip,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import {
  getImageUploadsByOwner,
  deleteImageUpload,
} from '@/redux/slices/imageUploadsSlice';
import DeleteModal from '@/utils/DeleteModal';
import ImageWithFallback from '@/utils/ImageWithFallback';
import { notify } from '@/utils/notifyToast';
import './yourimages.css';

// Copy notification component
const CopyNotification = ({ show, imageName }) => {
  if (!show) return null;

  return (
    <Alert color="success" className="mb-3 text-center fade-in">
      <i className="fa fa-check-circle me-2"></i>
      <strong>{imageName}</strong> URL copied to clipboard!
    </Alert>
  );
};

// Individual Image Card Component
const ImageCard = ({ image, onCopy, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      await onDelete(image._id);
    } finally {
      setIsDeleting(false);
    }
  }, [image._id, onDelete]);

  const cardId = `image-card-${image._id}`;

  return (
    <Col sm="12" md="6" className="mb-3">
      <Card className="h-100 image-card shadow-sm">
        <div className="position-relative">
          {/* Delete button */}
          <div className="position-absolute top-0 end-0 p-2" style={{ zIndex: 10 }}>
            <DeleteModal
              deleteFnName="deleteImageUpload"
              deleteFn={handleDelete}
              delID={image._id}
              delTitle={image.imageTitle}
              disabled={isDeleting}
              triggerButtonProps={{
                color: 'danger',
                size: 'sm',
                className: 'rounded-circle',
              }}
            />
          </div>

          {/* Image */}
          <div className="image-container" style={{ height: '160px', overflow: 'hidden' }}>
            <ImageWithFallback
              src={image.uploadImage}
              alt={image.imageTitle}
              className="w-100 h-100"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>

        <CardBody className="p-2">
          {/* Image title */}
          <div className="mb-2">
            <small className="text-muted d-block text-truncate" title={image.imageTitle}>
              {image.imageTitle}
            </small>
          </div>

          {/* Copy URL button */}
          <Button
            id={cardId}
            color="info"
            size="sm"
            block
            onClick={() => onCopy(image)}
            className="d-flex align-items-center justify-content-center"
          >
            <i className="fa fa-copy"></i>
            &nbsp;
            Copy URL
          </Button>

          <UncontrolledTooltip placement="top" target={cardId}>
            Click to copy image URL
          </UncontrolledTooltip>
        </CardBody>
      </Card>
    </Col>
  );
};

// Main Component
const YourImages = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const { imageUploadsByOwner, isLoading, error } = useSelector(
    (state) => state.imageUploads
  );

  // Local state
  const [copiedImageId, setCopiedImageId] = useState(null);

  // Check if user is valid
  const isUserValid = useMemo(() => user?._id, [user?._id]);

  // Fetch images on mount
  useEffect(() => {
    if (isUserValid) {
      dispatch(getImageUploadsByOwner(user._id));
    }
  }, [dispatch, isUserValid, user?._id]);

  // Handle copy to clipboard
  const handleCopy = useCallback(async (image) => {
    if (!image?.uploadImage) {
      notify('No image URL to copy', 'error');
      return;
    }

    try {
      await navigator.clipboard.writeText(image.uploadImage);

      // Show success feedback
      setCopiedImageId(image._id);
      notify(`${image.imageTitle} URL copied!`, 'success');

      // Clear copied state after 3 seconds
      setTimeout(() => {
        setCopiedImageId(null);
      }, 3000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      notify('Failed to copy URL. Please try again.', 'error');
    }
  }, []);

  // Handle delete
  const handleDelete = useCallback(
    async (imageId) => {
      try {
        const result = await dispatch(deleteImageUpload(imageId));

        if (deleteImageUpload.fulfilled.match(result)) {
          notify('Image deleted successfully!', 'success');

          // Refresh the list
          if (isUserValid) {
            dispatch(getImageUploadsByOwner(user._id));
          }
        } else {
          notify('Failed to delete image. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Error deleting image:', error);
        notify('An error occurred while deleting the image.', 'error');
      }
    },
    [dispatch, isUserValid, user?._id]
  );

  // Get statistics
  const imageCount = useMemo(
    () => imageUploadsByOwner?.length || 0,
    [imageUploadsByOwner]
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="text-center py-4">
        <Spinner color="primary" />
        <p className="text-muted mt-2">Loading your images...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert color="danger" className="m-3">
        <h5>Error Loading Images</h5>
        <p>{error.message || 'Failed to load images. Please try again.'}</p>
        <Button
          color="danger"
          size="sm"
          onClick={() => dispatch(getImageUploadsByOwner(user._id))}
        >
          Retry
        </Button>
      </Alert>
    );
  }

  // No user state
  if (!isUserValid) {
    return (
      <Alert color="warning" className="m-3">
        Please log in to view your images.
      </Alert>
    );
  }

  return (
    <div className="your-images-container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">
          Your Images
          {imageCount > 0 && (
            <Badge color="primary" className="ms-2">
              {imageCount}
            </Badge>
          )}
        </h5>
        {imageCount > 0 && (
          <Button
            color="link"
            size="sm"
            onClick={() => dispatch(getImageUploadsByOwner(user._id))}
            title="Refresh"
          >
            <i className="fa fa-refresh"></i>
          </Button>
        )}
      </div>

      {/* Copy notification */}
      <CopyNotification
        show={!!copiedImageId}
        imageName={
          imageUploadsByOwner?.find((img) => img._id === copiedImageId)?.imageTitle
        }
      />

      {/* Images grid */}
      <Row>
        {imageCount === 0 ? (
          <Col>
            <Alert color="info" className="text-center">
              <i className="fa fa-image fa-3x mb-3 d-block text-muted"></i>
              <h5>No Images Yet</h5>
              <p className="mb-0">
                Upload your first image using the upload form above.
              </p>
            </Alert>
          </Col>
        ) : (
          imageUploadsByOwner.map((image) => (
            <ImageCard
              key={image._id}
              image={image}
              onCopy={handleCopy}
              onDelete={handleDelete}
            />
          ))
        )}
      </Row>
    </div>
  );
};

export default YourImages;
