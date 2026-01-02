import { useMemo, useCallback, useState } from 'react';
import { Col, Row, Card, CardBody, Button, Badge, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import { deleteVideo } from '@/redux/slices/quizzesSlice';
import { deleteFaqVideo } from '@/redux/slices/faqsSlice';
import { notify } from '@/utils/notifyToast';
import DeleteIcon from '@/images/trash.svg';

const EmbeddedVideos = ({ quiz, faq, isFromFaqs = false }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.users);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [videoToDelete, setVideoToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Extract videos and ID based on source
    const { videos, entityId } = useMemo(() => {
        if (isFromFaqs) {
            return {
                videos: faq?.video_links || [],
                entityId: faq?._id,
            };
        }
        return {
            videos: quiz?.oneQuiz?.video_links || [],
            entityId: quiz?.oneQuiz?._id,
        };
    }, [isFromFaqs, faq, quiz]);

    // Check if user is admin
    const isAdmin = useMemo(
        () => user?.role?.includes('Admin'),
        [user?.role]
    );

    // Open delete confirmation modal
    const handleDeleteClick = useCallback((video) => {
        setVideoToDelete(video);
        setDeleteModalOpen(true);
    }, []);

    // Close delete modal
    const closeDeleteModal = useCallback(() => {
        setDeleteModalOpen(false);
        setVideoToDelete(null);
    }, []);

    // Handle video deletion
    const confirmDelete = useCallback(async () => {
        if (!videoToDelete || !entityId) return;

        setIsDeleting(true);

        const videoData = {
            vId: videoToDelete._id,
            iD: entityId,
        };

        try {
            const action = isFromFaqs
                ? deleteFaqVideo(videoData, videoToDelete._id)
                : deleteVideo(videoData, videoToDelete._id);

            const result = await dispatch(action);

            if (result?.type?.includes('fulfilled')) {
                notify('Video deleted successfully!', 'success');
                closeDeleteModal();
            } else {
                notify('Failed to delete video. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error deleting video:', error);
            notify('An error occurred while deleting the video.', 'error');
        } finally {
            setIsDeleting(false);
        }
    }, [videoToDelete, entityId, isFromFaqs, dispatch, closeDeleteModal]);

    // Convert YouTube URL to embed format
    const getEmbedUrl = useCallback((url) => {
        if (!url) return '';

        // Already an embed URL
        if (url.includes('youtube.com/embed/')) {
            return url;
        }

        // Extract video ID from various YouTube URL formats
        let videoId = '';

        if (url.includes('youtube.com/watch?v=')) {
            videoId = url.split('v=')[1]?.split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1]?.split('?')[0];
        }

        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }, []);

    // Don't render if no videos
    if (!videos || videos.length === 0) {
        return null;
    }

    return (
        <>
            <Row className="mt-4">
                {/* Header Section */}
                <Col xs={12}>
                    <div
                        className="text-center py-3 mb-4 rounded shadow-sm"
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white'
                        }}
                    >
                        <h4 className="mb-1 fw-bold">
                            <i className="fa fa-play-circle me-2"></i>
                            Related Videos
                        </h4>
                        <Badge color="light" className="px-3 py-1">
                            {videos.length} {videos.length === 1 ? 'Video' : 'Videos'}
                        </Badge>
                    </div>
                </Col>

                {/* Video Grid */}
                {videos.map((video, index) => (
                    <Col
                        key={video._id || `video-${index}`}
                        xs={12}
                        md={6}
                        lg={4}
                        className="mb-4"
                    >
                        <Card className="h-100 border-0 shadow-sm">
                            <CardBody className="p-3">
                                {/* Video Title and Actions */}
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <h6 className="mb-0 flex-grow-1 text-truncate pe-2">
                                        <i className="fa fa-video me-2 text-primary"></i>
                                        {video.vtitle || 'Untitled Video'}
                                    </h6>

                                    {isAdmin && (
                                        <Button
                                            size="sm"
                                            color="danger"
                                            outline
                                            className="px-2 py-1"
                                            onClick={() => handleDeleteClick(video)}
                                            title="Delete video"
                                        >
                                            <img
                                                src={DeleteIcon}
                                                alt="Delete"
                                                width="12"
                                                height="12"
                                            />
                                        </Button>
                                    )}
                                </div>

                                {/* Video Player */}
                                <div
                                    className="ratio ratio-16x9 rounded overflow-hidden shadow-sm"
                                    style={{ backgroundColor: '#000' }}
                                >
                                    <iframe
                                        src={getEmbedUrl(video.vlink)}
                                        title={video.vtitle || 'Video player'}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                        loading="lazy"
                                        className="border-0"
                                    />
                                </div>

                                {/* Video Info */}
                                {video.description && (
                                    <p className="text-muted small mt-2 mb-0">
                                        {video.description}
                                    </p>
                                )}
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModalOpen}
                toggle={closeDeleteModal}
                centered
            >
                <ModalHeader toggle={closeDeleteModal} className="border-0 pb-0">
                    <i className="fa fa-exclamation-triangle text-warning me-2"></i>
                    Confirm Deletion
                </ModalHeader>
                <ModalBody className="pt-2">
                    <p className="mb-2">
                        Are you sure you want to delete this video?
                    </p>
                    {videoToDelete && (
                        <div
                            className="p-3 rounded mt-3"
                            style={{ backgroundColor: '#f8f9fa' }}
                        >
                            <strong className="d-block mb-1">
                                <i className="fa fa-video me-2 text-primary"></i>
                                {videoToDelete.vtitle || 'Untitled Video'}
                            </strong>
                            <small className="text-muted">
                                This action cannot be undone.
                            </small>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter className="border-0">
                    <Button
                        color="secondary"
                        onClick={closeDeleteModal}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        color="danger"
                        onClick={confirmDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <i className="fa fa-spinner fa-spin me-2"></i>
                                Deleting...
                            </>
                        ) : (
                            <>
                                <i className="fa fa-trash me-2"></i>
                                Delete Video
                            </>
                        )}
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default EmbeddedVideos;
