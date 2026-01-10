import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button, Form, FormGroup, Label, Input, Row, Col, Alert, Breadcrumb, BreadcrumbItem, FormText, Card, CardBody, Spinner } from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateBlogPost, getOneBlogPost } from '@/redux/slices';
import { getPostCategories } from '@/redux/slices/postCategoriesSlice';
import TipTapEditor from './TipTapEditor';
import UploadPostPhotos from './UploadPostPhotos';
import YourImages from './YourImages';
import { notify } from '@/utils/notifyToast';
import NotAuthenticated from '@/components/users/NotAuthenticated';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Constants
const VALIDATION_CONFIG = {
  minTitle: 4,
  maxTitle: 70,
  minContent: 80,
  maxContent: 50000,
};

const ACCEPTED_IMAGE_TYPES = {
  extensions: ['.jpg', '.jpeg', '.png', '.svg', '.webp'],
  mimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'],
  displayText: '.jpg, .jpeg, .png, .svg, .webp',
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const DEFAULT_BG_COLORS = [
  { value: '#f8f9fa', label: 'Light Gray' },
  { value: '#ffffff', label: 'White' },
  { value: '#e3f2fd', label: 'Light Blue' },
  { value: '#f3e5f5', label: 'Light Purple' },
  { value: '#e8f5e9', label: 'Light Green' },
  { value: '#fff3e0', label: 'Light Orange' },
];

// Validation helpers
const validateImage = (file) => {
  if (!file) {
    return { ok: true }; // Image is optional on edit
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return {
      ok: false,
      message: `Image size must be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB.`,
    };
  }

  const fileExtension = `.${file.name.split('.').pop().toLowerCase()}`;
  if (!ACCEPTED_IMAGE_TYPES.extensions.includes(fileExtension)) {
    return {
      ok: false,
      message: `Invalid file type. Accepted formats: ${ACCEPTED_IMAGE_TYPES.displayText}`,
    };
  }

  return { ok: true };
};

const validateBlogPost = (formData) => {
  const { title, content } = formData;

  if (!title || title.trim().length < VALIDATION_CONFIG.minTitle) {
    return {
      ok: false,
      message: `Title must be at least ${VALIDATION_CONFIG.minTitle} characters.`,
    };
  }

  if (title.trim().length > VALIDATION_CONFIG.maxTitle) {
    return {
      ok: false,
      message: `Title must not exceed ${VALIDATION_CONFIG.maxTitle} characters.`,
    };
  }

  const textContent = content.replace(/<[^>]*>/g, '').trim();

  if (!content || textContent.length < VALIDATION_CONFIG.minContent) {
    return {
      ok: false,
      message: `Content must be at least ${VALIDATION_CONFIG.minContent} characters.`,
    };
  }

  if (content.length > VALIDATION_CONFIG.maxContent) {
    return {
      ok: false,
      message: `Content must not exceed ${VALIDATION_CONFIG.maxContent} characters.`,
    };
  }

  return { ok: true };
};

export const detectContentType = (content = '') => {
  if (!content.trim()) return 'empty';
  if (/<\/?[a-z][\s\S]*>/i.test(content)) {
    return 'html';
  }
  return 'markdown';
};

export const normalizeForEditor = (raw = '') => {
  if (!raw.trim()) return '';

  const type = detectContentType(raw);

  if (type === 'html') {
    return DOMPurify.sanitize(raw);
  }

  const html = marked.parse(raw);
  return DOMPurify.sanitize(html);
};

// Image Preview Component
const ImagePreview = ({ file, currentImage, onRemove }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  // Show new preview or current image
  const imageToShow = previewUrl || currentImage;

  if (!imageToShow) return null;

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <small className="text-success">
          {file ? (
            <>✓ New image: {file.name} ({(file.size / 1024).toFixed(2)} KB)</>
          ) : (
            <>Current image</>
          )}
        </small>
        <Button color="danger" size="sm" outline onClick={onRemove}>
          Remove {file ? 'New' : 'Current'} Image
        </Button>
      </div>
      <img
        src={imageToShow}
        alt="Post preview"
        className="img-thumbnail"
        style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }}
      />
    </div>
  );
};

// Main Component
const EditBlogPost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bPSlug } = useParams();

  // Redux state
  const { oneBlogPost, isLoading: isBlogPostLoading } = useSelector(
    (state) => state.blogPosts
  );
  const { allPostCategories, isLoading: isCategoriesLoading } = useSelector(
    (state) => state.postCategories
  );
  const { user, isAuthenticated, isLoading: isUserLoading } = useSelector(
    (state) => state.users
  );

  // Local state
  const [formState, setFormState] = useState({
    blogPostID: '',
    title: '',
    postCategory: '',
    bgColor: '',
    content: '',
  });
  const [newImage, setNewImage] = useState(null);
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Check if user is authorized to edit
  const isAuthorized = useMemo(() => {
    if (!user || !oneBlogPost) return false;

    const isAdmin = user.role?.includes('Admin');
    const isCreator = user._id === oneBlogPost.creator?._id;

    return isAdmin || isCreator;
  }, [user, oneBlogPost]);

  // Fetch blog post and categories
  useEffect(() => {
    if (bPSlug) {
      dispatch(getOneBlogPost(bPSlug));
    }
    dispatch(getPostCategories());
  }, [bPSlug, dispatch]);

  useEffect(() => {
    if (oneBlogPost) {
      const normalizedContent = normalizeForEditor(oneBlogPost.markdown);
      setFormState({
        blogPostID: oneBlogPost._id || '',
        title: oneBlogPost.title || '',
        postCategory: oneBlogPost.postCategory?._id || '',
        bgColor: oneBlogPost.bgColor || '',
        content: normalizedContent,
      });
    }
  }, [oneBlogPost]);

  // Track unsaved changes
  useEffect(() => {
    if (!oneBlogPost) return;

    const originalHTML = normalizeForEditor(oneBlogPost.markdown);

    const hasChanges =
      formState.title !== oneBlogPost.title ||
      formState.bgColor !== oneBlogPost.bgColor ||
      formState.postCategory !== oneBlogPost.postCategory?._id ||
      formState.content !== originalHTML ||
      newImage !== null ||
      removeCurrentImage;

    setHasUnsavedChanges(hasChanges);
  }, [formState, oneBlogPost, newImage, removeCurrentImage]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Handle input changes
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Handle editor content change
  const handleEditorChange = useCallback((htmlContent) => {
    setFormState((prev) => ({ ...prev, content: htmlContent }));
  }, []);

  // Handle file selection with validation
  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      const validation = validateImage(file);
      if (!validation.ok) {
        notify(validation.message, 'error');
        e.target.value = '';
        return;
      }
      setNewImage(file);
      setRemoveCurrentImage(false); // If uploading new, don't remove current
    }
  }, []);

  // Remove current or new image
  const handleRemoveImage = useCallback(() => {
    if (newImage) {
      // Remove the newly selected image
      setNewImage(null);
      const fileInput = document.getElementById('post_image_pick');
      if (fileInput) fileInput.value = '';
    } else {
      // Mark current image for removal
      setRemoveCurrentImage(true);
    }
  }, [newImage]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (isSubmitting) return;

      // Validate form data
      const validation = validateBlogPost(formState);
      if (!validation.ok) {
        notify(validation.message, 'error');
        return;
      }

      // Check if category is selected
      if (!formState.postCategory) {
        notify('Please select a category.', 'error');
        return;
      }

      // Validate new image if provided
      if (newImage) {
        const imageValidation = validateImage(newImage);
        if (!imageValidation.ok) {
          notify(imageValidation.message, 'error');
          return;
        }
      }

      setIsSubmitting(true);

      try {
        // If there's a new image or we're removing the current one, use FormData
        console.log("Submitting update with image changes:", { newImage, removeCurrentImage });
        if (newImage || removeCurrentImage) {
          const formData = new FormData();
          formData.append('title', formState.title.trim());
          formData.append('markdown', formState.content);
          formData.append('postCategory', formState.postCategory);
          formData.append('bgColor', formState.bgColor || '#ffffff');

          if (newImage) {
            formData.append('post_image', newImage);
          }

          if (removeCurrentImage) {
            formData.append('removeImage', 'true');
          }

          const result = await dispatch(
            updateBlogPost({
              blogPostID: formState.blogPostID,
              formData,
            })
          );

          if (updateBlogPost.fulfilled.match(result)) {
            notify('Blog post updated successfully!', 'success');
            setHasUnsavedChanges(false);
            setNewImage(null);
            setRemoveCurrentImage(false);

            setTimeout(() => {
              navigate(`/view-blog-post/${bPSlug}`);
            }, 2000);
          } else {
            notify(
              result.error?.message || 'Failed to update blog post. Please try again.',
              'error'
            );
          }
        } else {
          // No image changes, use regular JSON update
          const updatedBP = {
            blogPostID: formState.blogPostID,
            title: formState.title.trim(),
            postCategory: formState.postCategory,
            bgColor: formState.bgColor,
            markdown: formState.content,
          };

          const result = await dispatch(updateBlogPost(updatedBP));

          if (updateBlogPost.fulfilled.match(result)) {
            notify('Blog post updated successfully!', 'success');
            setHasUnsavedChanges(false);

            setTimeout(() => {
              navigate(`/view-blog-post/${bPSlug}`);
            }, 2000);
          } else {
            notify(
              result.error?.message || 'Failed to update blog post. Please try again.',
              'error'
            );
          }
        }
      } catch (error) {
        console.error('Error updating blog post:', error);
        notify('An unexpected error occurred. Please try again.', 'error');
      } finally {
        setIsSubmitting(false);
      }
    },
    [formState, newImage, removeCurrentImage, dispatch, navigate, bPSlug, isSubmitting]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      );
      if (!confirmLeave) return;
    }
    navigate(`/view-blog-post/${bPSlug}`);
  }, [hasUnsavedChanges, navigate, bPSlug]);

  // Character counters
  const titleCharsRemaining = VALIDATION_CONFIG.maxTitle - (formState.title?.length || 0);
  const contentLength = formState.content.replace(/<[^>]*>/g, '').trim().length;

  // Loading state
  const isLoading = isUserLoading || isBlogPostLoading || isCategoriesLoading;

  // Early returns
  if (!isAuthenticated) {
    return <NotAuthenticated />;
  }

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner color="primary" />
        <p className="mt-3">Loading the post...</p>
      </div>
    );
  }

  if (!oneBlogPost) {
    return (
      <Alert color="warning" className="m-5 text-center">
        <h4>Blog Post Not Found</h4>
        <p>The blog post you are trying to edit does not exist.</p>
        <Button color="primary" onClick={() => navigate('/blog')}>
          Go to Blog
        </Button>
      </Alert>
    );
  }

  if (user?.role === 'Visitor') {
    return (
      <Alert color="warning" className="m-5 text-center">
        <h4>Access Restricted</h4>
        <p>Visitors cannot edit blog posts.</p>
      </Alert>
    );
  }

  if (!isAuthorized) {
    return (
      <Alert color="danger" className="m-5 text-center">
        <h4>Access Denied</h4>
        <p>You do not have permission to edit this blog post.</p>
        <Button color="primary" onClick={() => navigate('/blog')}>
          Go to Blog
        </Button>
      </Alert>
    );
  }

  // Determine which image to show
  const currentImageUrl = !removeCurrentImage ? oneBlogPost.post_image : null;

  return (
    <Row className="p-2 pt-lg-5">
      <Col sm="8" className="mt-md-2">
        <Breadcrumb>
          <BreadcrumbItem>
            <a href="/blog">Blog</a>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <a href={`/view-blog-post/${bPSlug}`}>{oneBlogPost.title}</a>
          </BreadcrumbItem>
          <BreadcrumbItem active>Edit</BreadcrumbItem>
        </Breadcrumb>

        <Card>
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Edit Blog Post</h2>
              {hasUnsavedChanges && (
                <small className="text-warning">
                  <i className="fa fa-circle me-1"></i>
                  Unsaved changes
                </small>
              )}
            </div>

            <Form onSubmit={handleSubmit}>
              {/* Title Field */}
              <FormGroup>
                <Label for="title" className="fw-bold">
                  Title <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter blog post title"
                  value={formState.title || ''}
                  onChange={handleInputChange}
                  maxLength={VALIDATION_CONFIG.maxTitle}
                  required
                />
                <FormText color={titleCharsRemaining < 10 ? 'warning' : 'muted'}>
                  {formState.title?.length || 0}/{VALIDATION_CONFIG.maxTitle} characters
                  {titleCharsRemaining < 10 && ` (${titleCharsRemaining} remaining)`}
                </FormText>
              </FormGroup>

              {/* Category Field */}
              <FormGroup>
                <Label for="postCategory" className="fw-bold">
                  Post Category <span className="text-danger">*</span>
                </Label>
                <Input
                  type="select"
                  id="postCategory"
                  name="postCategory"
                  value={formState.postCategory || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Select a Category --</option>
                  {allPostCategories?.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.title}
                    </option>
                  ))}
                </Input>
                {isCategoriesLoading && (
                  <FormText color="muted">Loading categories...</FormText>
                )}
              </FormGroup>

              {/* Background Color Field */}
              <FormGroup>
                <Label for="bgColor" className="fw-bold">
                  Background Color
                </Label>
                <Input
                  type="select"
                  id="bgColor"
                  name="bgColor"
                  value={formState.bgColor || ''}
                  onChange={handleInputChange}
                >
                  <option value="">-- Default (White) --</option>
                  {DEFAULT_BG_COLORS.map((color) => (
                    <option key={color.value} value={color.value}>
                      {color.label}
                    </option>
                  ))}
                </Input>
                {formState.bgColor && (
                  <div className="mt-2">
                    <small className="text-muted">Preview:</small>
                    <div
                      style={{
                        backgroundColor: formState.bgColor,
                        height: '40px',
                        border: '1px solid #dee2e6',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                )}
              </FormGroup>

              {/* Rich Text Editor */}
              <FormGroup>
                <Label className="fw-bold">
                  Content <span className="text-danger">*</span>
                </Label>

                {formState.content !== '' && (
                  <TipTapEditor
                    onChange={handleEditorChange}
                    initialValue={formState.content}
                    minHeight="400px"
                  />
                )}
                <FormText color={contentLength < VALIDATION_CONFIG.minContent ? 'warning' : 'muted'}>
                  {contentLength} characters (minimum {VALIDATION_CONFIG.minContent})
                </FormText>
              </FormGroup>

              {/* Image Upload Field */}
              <FormGroup>
                <Label for="post_image_pick" className="fw-bold">
                  Representing Image
                </Label>
                <Input
                  type="file"
                  id="post_image_pick"
                  name="post_image"
                  accept={ACCEPTED_IMAGE_TYPES.extensions.join(',')}
                  onChange={handleFileChange}
                />
                <FormText color="muted">
                  {newImage || currentImageUrl ? (
                    <>Upload a new image to replace the current one</>
                  ) : (
                    <>Upload a new representing image</>
                  )}
                  <br />
                  Accepted formats: {ACCEPTED_IMAGE_TYPES.displayText}
                  <br />
                  Maximum size: {MAX_IMAGE_SIZE / 1024 / 1024}MB
                </FormText>
                <ImagePreview
                  file={newImage}
                  currentImage={currentImageUrl}
                  onRemove={handleRemoveImage}
                />
              </FormGroup>

              {/* Action Buttons */}
              <div className="d-flex gap-2 mt-4">
                <Button
                  color="success"
                  type="submit"
                  disabled={isSubmitting || !hasUnsavedChanges}
                  className="flex-grow-1"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className="fa fa-save me-2"></i>
                      Update Blog Post
                    </>
                  )}
                </Button>
                <Button
                  color="secondary"
                  outline
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>

              {!hasUnsavedChanges && (
                <small className="text-muted d-block mt-2">
                  No changes to save
                </small>
              )}
            </Form>
          </CardBody>
        </Card>
      </Col>

      <Col sm="4" className="mt-md-2">
        <UploadPostPhotos />
        <YourImages />
      </Col>
    </Row>
  );
};

export default EditBlogPost;
