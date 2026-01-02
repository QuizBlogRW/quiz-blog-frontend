import { useState, useCallback, useMemo } from 'react';
import {
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    Row,
    Col,
    Alert,
    Breadcrumb,
    BreadcrumbItem,
    FormText,
    Card,
    CardBody,
    Spinner,
} from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createBlogPost } from '@/redux/slices';
import UploadPostPhotos from './UploadPostPhotos';
import YourImages from './YourImages';
import { notify } from '@/utils/notifyToast';
import NotAuthenticated from '@/components/users/NotAuthenticated';

// Constants
const VALIDATION_CONFIG = {
    minTitle: 4,
    maxTitle: 70,
    minMarkdown: 100,
    maxMarkdown: 50000,
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
        return { ok: false, message: 'Please select an image file.' };
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
    const { title, markdown } = formData;

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

    if (!markdown || markdown.trim().length < VALIDATION_CONFIG.minMarkdown) {
        return {
            ok: false,
            message: `Content must be at least ${VALIDATION_CONFIG.minMarkdown} characters.`,
        };
    }

    if (markdown.trim().length > VALIDATION_CONFIG.maxMarkdown) {
        return {
            ok: false,
            message: `Content must not exceed ${VALIDATION_CONFIG.maxMarkdown} characters.`,
        };
    }

    return { ok: true };
};

// Image Preview Component
const ImagePreview = ({ file, onRemove }) => {
    const [previewUrl, setPreviewUrl] = useState(null);

    useState(() => {
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [file]);

    if (!file) return null;

    return (
        <div className="mt-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <small className="text-success">
                    ✓ Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </small>
                <Button color="danger" size="sm" outline onClick={onRemove}>
                    Remove
                </Button>
            </div>
            {previewUrl && (
                <img
                    src={previewUrl}
                    alt="Preview"
                    className="img-thumbnail"
                    style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }}
                />
            )}
        </div>
    );
};

// Main Component
const AddBlogPost = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { bPCatID } = useParams();

    // Redux state
    const { user, isAuthenticated, isLoading } = useSelector((state) => state.users);
    const { isLoading: isCreating } = useSelector((state) => state.blogPosts || {});

    // Check authorization
    const isAuthorized = useMemo(() => {
        return user?.role?.includes('Admin') || user?.role === 'Creator';
    }, [user?.role]);

    // Form state
    const [formState, setFormState] = useState({
        title: '',
        markdown: '',
        bgColor: '',
    });
    const [postImage, setPostImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validation state
    const [errors, setErrors] = useState({});

    // Validate category ID
    const isCategoryValid = useMemo(() => {
        return bPCatID && bPCatID !== 'undefined';
    }, [bPCatID]);

    // Handle input changes
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
        // Clear error for this field
        setErrors((prev) => ({ ...prev, [name]: null }));
    }, []);

    // Handle file selection with validation
    const handleFileChange = useCallback((e) => {
        const file = e.target.files?.[0] || null;

        if (file) {
            const validation = validateImage(file);
            if (!validation.ok) {
                notify(validation.message, 'error');
                e.target.value = ''; // Reset input
                return;
            }
            setPostImage(file);
            setErrors((prev) => ({ ...prev, post_image: null }));
        }
    }, []);

    // Remove selected image
    const handleRemoveImage = useCallback(() => {
        setPostImage(null);
        const fileInput = document.getElementById('post_image_pick');
        if (fileInput) fileInput.value = '';
    }, []);

    // Handle form submission
    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();

            if (isSubmitting) return;

            // Validate category
            if (!isCategoryValid) {
                notify('Invalid blog category. Please go back and select a category.', 'error');
                return;
            }

            // Validate form data
            const validation = validateBlogPost(formState);
            if (!validation.ok) {
                notify(validation.message, 'error');
                return;
            }

            // Validate image
            const imageValidation = validateImage(postImage);
            if (!imageValidation.ok) {
                notify(imageValidation.message, 'error');
                return;
            }

            // Build form data
            const formData = new FormData();
            formData.append('title', formState.title.trim());
            formData.append('markdown', formState.markdown.trim());
            formData.append('bgColor', formState.bgColor || '#ffffff');
            formData.append('post_image', postImage);
            formData.append('postCategory', bPCatID);

            if (user?._id) {
                formData.append('creator', user._id);
            }

            // Submit
            setIsSubmitting(true);

            try {
                const result = await dispatch(createBlogPost(formData));

                if (createBlogPost.fulfilled.match(result)) {
                    notify('Blog post created successfully!', 'success');

                    // Reset form
                    setFormState({
                        title: '',
                        markdown: '',
                        bgColor: '',
                    });
                    setPostImage(null);
                    const fileInput = document.getElementById('post_image_pick');
                    if (fileInput) fileInput.value = '';

                    // Navigate to the new post or category
                    setTimeout(() => {
                        if (result.payload?.slug) {
                            navigate(`/view-blog-post/${result.payload.slug}`);
                        }
                    }, 2000);
                } else {
                    notify(
                        result.error?.message || 'Failed to create blog post. Please try again.',
                        'error'
                    );
                }
            } catch (error) {
                console.error('Error creating blog post:', error);
                notify('An unexpected error occurred. Please try again.', 'error');
            } finally {
                setIsSubmitting(false);
            }
        },
        [formState, postImage, bPCatID, user?._id, dispatch, navigate, isSubmitting, isCategoryValid]
    );

    // Character counters
    const titleCharsRemaining = VALIDATION_CONFIG.maxTitle - (formState.title?.length || 0);
    const markdownCharsRemaining = VALIDATION_CONFIG.maxMarkdown - (formState.markdown?.length || 0);

    // Early returns
    if (!isAuthenticated) {
        return <NotAuthenticated />;
    }

    if (isLoading) {
        return (
            <div className="text-center py-5">
                <Spinner color="primary" />
                <p className="mt-3">Loading...</p>
            </div>
        );
    }

    if (!isAuthorized) {
        return (
            <Alert color="danger" className="m-5 text-center">
                <h4>Access Denied</h4>
                <p>You don&apos;t have permission to create blog posts.</p>
            </Alert>
        );
    }

    if (!isCategoryValid) {
        return (
            <Alert color="warning" className="m-5 text-center">
                <h4>Invalid Category</h4>
                <p>Please select a valid blog category first.</p>
                <Button color="primary" onClick={() => navigate('/blog-categories')}>
                    Go to Categories
                </Button>
            </Alert>
        );
    }

    return (
        <Row className="p-2 pt-lg-5">
            <Col sm="8" className="mt-md-2">
                <Breadcrumb>
                    <BreadcrumbItem>
                        <a href="/blog-categories">Blog</a>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>Create New Post</BreadcrumbItem>
                </Breadcrumb>

                <Card>
                    <CardBody>
                        <h2 className="mb-4">Create New Blog Post</h2>

                        <Form onSubmit={handleSubmit}>
                            {/* Title Field */}
                            <FormGroup>
                                <Label for="title" className="fw-bold text-success">
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
                                    invalid={!!errors.title}
                                />
                                <FormText color={titleCharsRemaining < 10 ? 'warning' : 'muted'}>
                                    {formState.title?.length || 0}/{VALIDATION_CONFIG.maxTitle} characters
                                    {titleCharsRemaining < 10 && ` (${titleCharsRemaining} remaining)`}
                                </FormText>
                            </FormGroup>

                            {/* Background Color Field */}
                            <FormGroup>
                                <Label for="bgColor" className="fw-bold text-success">
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

                            {/* Markdown Content Field */}
                            <FormGroup>
                                <Label for="markdown" className="fw-bold text-success">
                                    Content (Markdown) <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    type="textarea"
                                    id="markdown"
                                    name="markdown"
                                    placeholder="Write your blog post content in markdown format..."
                                    value={formState.markdown || ''}
                                    onChange={handleInputChange}
                                    rows="15"
                                    maxLength={VALIDATION_CONFIG.maxMarkdown}
                                    required
                                    invalid={!!errors.markdown}
                                />
                                <FormText color={markdownCharsRemaining < 1000 ? 'warning' : 'muted'}>
                                    {formState.markdown?.length || 0}/{VALIDATION_CONFIG.maxMarkdown} characters
                                    (minimum {VALIDATION_CONFIG.minMarkdown})
                                </FormText>
                            </FormGroup>

                            {/* Image Upload Field */}
                            <FormGroup>
                                <Label for="post_image_pick" className="fw-bold text-success">
                                    Representing Image <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    type="file"
                                    id="post_image_pick"
                                    name="post_image"
                                    accept={ACCEPTED_IMAGE_TYPES.extensions.join(',')}
                                    onChange={handleFileChange}
                                    required={!postImage}
                                    invalid={!!errors.post_image}
                                />
                                <FormText color="muted">
                                    Accepted formats: {ACCEPTED_IMAGE_TYPES.displayText}
                                    <br />
                                    Maximum size: {MAX_IMAGE_SIZE / 1024 / 1024}MB
                                </FormText>
                                <ImagePreview file={postImage} onRemove={handleRemoveImage} />
                            </FormGroup>

                            {/* Submit Button */}
                            <Button
                                color="success"
                                size="lg"
                                block
                                type="submit"
                                disabled={isSubmitting || isCreating}
                                className="mt-4"
                            >
                                {isSubmitting || isCreating ? (
                                    <>
                                        <Spinner size="sm" className="me-2" />
                                        Creating Post...
                                    </>
                                ) : (
                                    'Create Blog Post'
                                )}
                            </Button>
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

export default AddBlogPost;