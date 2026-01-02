import { useMemo, useCallback } from 'react';
import { Button, Row, Col } from 'reactstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NotAuthenticated from '@/components/users/NotAuthenticated';

const OnLastAnswer = ({ thisQuiz }) => {

    const { isAuthenticated } = useSelector((state) => state.users);
    const navigate = useNavigate();

    // Memoize share URLs
    const shareUrls = useMemo(() => {
        if (!thisQuiz?.slug || !thisQuiz?.title) return null;

        const currentDomain = window.location.origin;
        const quizUrl = `${currentDomain}/view-quiz/${thisQuiz.slug}`;
        const shareText = `Check out this quiz: "${thisQuiz.title}" on Quiz-Blog`;

        return {
            whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(
                `${shareText}\n${quizUrl}`
            )}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                shareText
            )}&url=${encodeURIComponent(quizUrl)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                quizUrl
            )}`,
            telegram: `https://t.me/share/url?url=${encodeURIComponent(
                quizUrl
            )}&text=${encodeURIComponent(shareText)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                quizUrl
            )}`,
            quizUrl,
        };
    }, [thisQuiz?.slug, thisQuiz?.title]);

    // Handle copy link
    const handleCopyLink = useCallback(async () => {
        if (!shareUrls?.quizUrl) return;

        try {
            await navigator.clipboard.writeText(shareUrls.quizUrl);
            // You could add a toast notification here
            alert('Quiz link copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy link:', error);
            alert('Failed to copy link. Please try again.');
        }
    }, [shareUrls?.quizUrl]);

    // Navigation handlers
    const goBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const goToDashboard = useCallback(() => {
        navigate('/dashboard');
    }, [navigate]);

    // Guard: Not authenticated
    if (!isAuthenticated) {
        return <NotAuthenticated />;
    }

    // Guard: No quiz data
    if (!thisQuiz) {
        return (
            <div className="text-center py-5">
                <p className="text-muted">Quiz information unavailable</p>
                <Button color="primary" onClick={goToDashboard}>
                    Go to Dashboard
                </Button>
            </div>
        );
    }

    return (
        <div className="score-section text-center py-5 px-3">
            <div
                className="mx-auto p-4 p-md-5 rounded shadow-lg border-0"
                style={{
                    maxWidth: '560px',
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                }}
            >
                {/* Success Icon and Message */}
                <div className="mb-4">
                    <div
                        className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                        style={{
                            width: '80px',
                            height: '80px',
                            backgroundColor: '#10b981',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                        }}
                    >
                        <i className="fa fa-check text-white" style={{ fontSize: '2.5rem' }}></i>
                    </div>
                    <h3 className="fw-bolder mb-2 text-success">Review Complete! 🎉</h3>
                    <p className="text-muted mb-0">
                        Great job reviewing &quot;{thisQuiz.title}&quot;!
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="d-grid gap-3 mb-4">
                    <Link to={`/view-quiz/${thisQuiz.slug}`} className="text-decoration-none">
                        <Button
                            color="success"
                            className="w-100 py-3 fw-bold d-flex align-items-center justify-content-center"
                            style={{ fontSize: '1.05rem' }}
                        >
                            <i className="fa fa-redo me-2"></i>
                            Retake Quiz
                        </Button>
                    </Link>

                    {/* Dashboard */}
                    <Button
                        color="primary"
                        className="w-100 py-3 fw-bold d-flex align-items-center justify-content-center"
                        onClick={goToDashboard}
                        style={{ fontSize: '1.05rem' }}
                    >
                        <i className="fa fa-home me-2"></i>
                        Go to Dashboard
                    </Button>

                    {/* Back */}
                    <Button
                        color="secondary"
                        outline
                        className="w-100 py-2 fw-bold d-flex align-items-center justify-content-center"
                        onClick={goBack}
                    >
                        <i className="fa fa-arrow-left me-2"></i>
                        Back
                    </Button>
                </div>

                {/* Share Section */}
                {shareUrls && (
                    <>
                        <div className="my-4">
                            <hr className="my-3" />
                            <h6 className="text-muted fw-bold mb-3">
                                <i className="fa fa-share-nodes me-2"></i>
                                Share This Quiz
                            </h6>
                        </div>

                        {/* Social Share Buttons */}
                        <Row className="g-2 mb-3">
                            <Col xs={6}>
                                <Button
                                    color="success"
                                    outline
                                    className="w-100 py-2"
                                    tag="a"
                                    href={shareUrls.whatsapp}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Share on WhatsApp"
                                >
                                    <i className="fa-brands fa-whatsapp me-1"></i>
                                    WhatsApp
                                </Button>
                            </Col>
                            <Col xs={6}>
                                <Button
                                    color="info"
                                    outline
                                    className="w-100 py-2"
                                    tag="a"
                                    href={shareUrls.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Share on X"
                                >
                                    <i className="fa-brands fa-x-twitter me-1"></i>
                                    Twitter
                                </Button>
                            </Col>
                            <Col xs={6}>
                                <Button
                                    color="primary"
                                    outline
                                    className="w-100 py-2"
                                    tag="a"
                                    href={shareUrls.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Share on Facebook"
                                >
                                    <i className="fa-brands fa-facebook me-1"></i>
                                    Facebook
                                </Button>
                            </Col>
                            <Col xs={6}>
                                <Button
                                    color="primary"
                                    outline
                                    className="w-100 py-2"
                                    tag="a"
                                    href={shareUrls.telegram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Share on Telegram"
                                >
                                    <i className="fa-brands fa-telegram me-1"></i>
                                    Telegram
                                </Button>
                            </Col>
                        </Row>

                        {/* Copy Link Button */}
                        <Button
                            color="dark"
                            outline
                            className="w-100 py-2"
                            onClick={handleCopyLink}
                            title="Copy quiz link"
                        >
                            <i className="fa fa-copy me-2"></i>
                            Copy Link
                        </Button>
                    </>
                )}

                {/* Footer Message */}
                <div className="mt-4 pt-3 border-top">
                    <small className="text-muted d-block">
                        <i className="fa fa-lightbulb me-1"></i>
                        Keep practicing to improve your score!
                    </small>
                </div>
            </div>
        </div>
    );
};

export default OnLastAnswer;
