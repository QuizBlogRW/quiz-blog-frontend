import { useEffect, useMemo, lazy, Suspense, useCallback } from 'react';
import { Col, Row, Card, Button, CardTitle, CardText, Badge, Alert } from 'reactstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { getOneQuiz } from '@/redux/slices/quizzesSlice';
import EmbeddedVideos from './EmbeddedVideos';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import isAdEnabled from '@/utils/isAdEnabled';
import { notify } from '@/utils/notifyToast';

const ResponsiveHorizontal = lazy(() =>
    import('@/components/adsenses/ResponsiveHorizontal')
);

const GetReady = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { quizSlug } = useParams();

    const { oneQuiz, isLoading, error } = useSelector((state) => state.quizzes);
    const { user } = useSelector((state) => state.users);

    // Fetch quiz data
    useEffect(() => {
        if (!oneQuiz || oneQuiz.slug !== quizSlug) {
            dispatch(getOneQuiz(quizSlug));
        }
    }, [dispatch, quizSlug, oneQuiz]);

    // Shuffle questions
    const shuffledQuestions = useMemo(() => {
        if (!oneQuiz?.questions) return [];
        return [...oneQuiz.questions].sort(() => Math.random() - 0.5);
    }, [oneQuiz?.questions]);

    // Category checks
    const categoryInfo = useMemo(() => {
        const categoryId = oneQuiz?.category?._id;
        const isAmategeko = categoryId === '60e8e72d4463f50015a81f96';
        const isDrivingTest = categoryId === '60e9a2ba82f7830015c317f1';

        return {
            id: categoryId,
            isAmategeko,
            isDrivingTest,
            title: oneQuiz?.category?.title || 'General',
        };
    }, [oneQuiz?.category]);

    // Localized text based on category
    const texts = useMemo(() => {
        const { isAmategeko } = categoryInfo;
        const userName = user?.name || 'Guest';

        return {
            ready: user
                ? isAmategeko
                    ? `${userName}, witeguye gutangira isuzuma?`
                    : `${userName}, are you ready to start the quiz?`
                : isAmategeko
                    ? 'Kugirango uze kubona uko wasubije, Injira cyangwa ufungure konti 😎'
                    : 'To save and review your answers, please log in or create an account 😎',
            attempt: isAmategeko ? 'Tangira Isuzuma' : 'Start Quiz',
            share: isAmategeko ? 'Sangiza kuri' : 'Share quiz on',
            back: isAmategeko ? 'Garuka' : 'Back',
            noQuestions: isAmategeko
                ? 'Iki kizamini nta kibazo gifite!'
                : 'This quiz has no questions yet!',
            browseOthers: isAmategeko
                ? 'Reba izindi bizamini'
                : 'Browse Other Quizzes',
            questions: isAmategeko ? 'Ibibazo' : 'Questions',
            duration: isAmategeko ? 'Igihe' : 'Duration',
            copyLink: isAmategeko ? 'Kopiya Linki' : 'Copy Link',
        };
    }, [categoryInfo, user]);

    // Share URLs
    const shareUrls = useMemo(() => {
        if (!oneQuiz?.slug || !oneQuiz?.title) return null;

        const currentDomain = window.location.origin;
        const quizUrl = `${currentDomain}/view-quiz/${oneQuiz.slug}`;
        const shareText = `Check out this quiz: "${oneQuiz.title}" on Quiz-Blog`;

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
            quizUrl,
        };
    }, [oneQuiz?.slug, oneQuiz?.title]);

    // Copy link handler
    const handleCopyLink = useCallback(async () => {
        if (!shareUrls?.quizUrl) return;

        try {
            await navigator.clipboard.writeText(shareUrls.quizUrl);
            notify('Quiz link copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy link:', error);
            notify('Failed to copy link. Please try again.');
        }
    }, [shareUrls?.quizUrl]);

    // Quiz statistics
    const quizStats = useMemo(() => {
        if (!oneQuiz) return null;

        const questionCount = shuffledQuestions.length;
        const estimatedMinutes = Math.ceil(questionCount * 0.5); // 30 seconds per question
        const difficulty = oneQuiz.difficulty || 'Medium';

        return {
            questionCount,
            estimatedMinutes,
            difficulty,
            category: categoryInfo.title,
        };
    }, [oneQuiz, shuffledQuestions, categoryInfo]);

    // Loading state
    if (isLoading) {
        return <QBLoadingSM />;
    }

    // Error state
    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Alert color="danger" className="text-center shadow-sm">
                    <i className="fa fa-exclamation-triangle fa-2x mb-3 d-block"></i>
                    <h5 className="mb-2">Failed to Load Quiz</h5>
                    <p className="mb-3">We couldn&apos;t load this quiz. Please try again.</p>
                    <Button color="danger" onClick={() => navigate('/all-quizzes')}>
                        Browse Other Quizzes
                    </Button>
                </Alert>
            </div>
        );
    }

    // No quiz data
    if (!oneQuiz) return null;

    // No questions state
    if (shuffledQuestions.length === 0) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                <div className="text-center">
                    <Card className="shadow-lg border-0 p-5 mx-auto" style={{ maxWidth: '600px' }}>
                        <div className="mb-4">
                            <i className="fa fa-question-circle fa-4x text-muted"></i>
                        </div>
                        <CardTitle tag="h4" className="text-danger fw-bold mb-3">
                            😕 {texts.noQuestions}
                        </CardTitle>
                        <CardText className="text-secondary mb-4">
                            This quiz is still being prepared. Don&apos;t worry — plenty of other quizzes
                            are ready for you to try!
                        </CardText>
                        <Link to="/all-quizzes">
                            <Button color="success" size="lg" className="px-5 py-3 fw-bold">
                                <i className="fa fa-list me-2"></i>
                                {texts.browseOthers}
                            </Button>
                        </Link>
                    </Card>
                </div>
            </div>
        );
    }

    // Main render
    return (
        <div className="py-4">
            <Row className="justify-content-center">
                <Col>
                    {/* Main Quiz Card */}
                    <Card
                        className="text-center m-3 mx-md-auto p-4 shadow-lg rounded-4 border-0"
                        style={{
                            background: 'linear-gradient(135deg, #157a6e 0%, #0f5a4a 100%)',
                            color: 'white',
                        }}
                    >
                        {/* Category Badge */}
                        <div className="mb-3">
                            <Badge color="light" className="px-3 py-2 text-dark">
                                <i className="fa fa-folder me-2"></i>
                                {categoryInfo.title}
                            </Badge>
                        </div>

                        {/* Title */}
                        <CardTitle tag="h3" className="fw-bold mb-3">
                            {oneQuiz.title}
                        </CardTitle>

                        {/* Description */}
                        {oneQuiz.description && (
                            <CardText className="mb-4 opacity-90">
                                {oneQuiz.description}
                            </CardText>
                        )}

                        {/* Quiz Statistics */}
                        {quizStats && (
                            <Row className="mb-4 g-2">
                                <Col xs="6" sm="6">
                                    <div className="bg-white bg-opacity-25 rounded p-3">
                                        <div className="fw-bold">{quizStats.questionCount}</div>
                                        <small>{texts.questions}</small>
                                    </div>
                                </Col>
                                <Col xs="6" sm="6">
                                    <div className="bg-white bg-opacity-25 rounded p-3">
                                        <div className="fw-bold">~{quizStats.estimatedMinutes} min</div>
                                        <small>{texts.duration}</small>
                                    </div>
                                </Col>
                            </Row>
                        )}

                        {/* Auth Status Message */}
                        <Alert
                            color={user ? 'success' : 'warning'}
                            className="mb-4"
                            style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                        >
                            <small className="fw-semibold text-dark">
                                {user ? (
                                    <>
                                        <i className="fa fa-check-circle me-2"></i>
                                        {texts.ready}
                                    </>
                                ) : (
                                    <>
                                        <i className="fa fa-info-circle me-2"></i>
                                        {texts.ready}
                                    </>
                                )}
                            </small>
                        </Alert>

                        {/* Action Buttons */}
                        <div className="d-grid gap-3 mb-3">
                            {/* Start Quiz - Primary Action */}
                            <Link
                                to={`/attempt-quiz/${oneQuiz.slug}`}
                                state={{ ...oneQuiz, questions: shuffledQuestions }}
                                className="text-decoration-none"
                            >
                                <Button
                                    size="lg"
                                    className="w-100 py-3 fw-bold"
                                    style={{
                                        backgroundColor: '#ffc107',
                                        color: '#157a6e',
                                        border: 'none',
                                    }}
                                >
                                    <i className="fa fa-play-circle me-2"></i>
                                    {texts.attempt}
                                </Button>
                            </Link>

                            {/* Secondary Actions */}
                            <Row className="g-2">
                                <Col xs="12" sm="6">
                                    <Link to="/" className="text-decoration-none">
                                        <Button color="light" className="w-100 py-2 text-dark fw-semibold">
                                            <i className="fa fa-arrow-left me-2"></i>
                                            {texts.back}
                                        </Button>
                                    </Link>
                                </Col>
                                <Col xs="12" sm="6">
                                    <Button
                                        color="light"
                                        className="w-100 py-2 text-dark fw-semibold"
                                        onClick={handleCopyLink}
                                    >
                                        <i className="fa fa-copy me-2"></i>
                                        {texts.copyLink}
                                    </Button>
                                </Col>
                            </Row>
                        </div>

                        {/* Share Section */}
                        {shareUrls && (
                            <div className="mt-3">
                                <small className="d-block mb-2 opacity-75">{texts.share}:</small>
                                <div className="d-flex justify-content-center gap-2">
                                    <Button
                                        color="light"
                                        className="rounded-circle"
                                        style={{ width: '40px', height: '40px' }}
                                        tag="a"
                                        href={shareUrls.whatsapp}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Share on WhatsApp"
                                    >
                                        <i className="fa-brands fa-whatsapp"></i>
                                    </Button>
                                    <Button
                                        color="light"
                                        className="rounded-circle"
                                        style={{ width: '40px', height: '40px' }}
                                        tag="a"
                                        href={shareUrls.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Share on X"
                                    >
                                        <i className="fa-brands fa-x-twitter"></i>
                                    </Button>
                                    <Button
                                        color="light"
                                        className="rounded-circle"
                                        style={{ width: '40px', height: '40px' }}
                                        tag="a"
                                        href={shareUrls.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Share on Facebook"
                                    >
                                        <i className="fa-brands fa-facebook"></i>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Adsense */}
                    {isAdEnabled() && (
                        <Suspense fallback={<QBLoadingSM />}>
                            <ResponsiveHorizontal />
                        </Suspense>
                    )}

                    {/* Videos */}
                    <EmbeddedVideos quiz={{ oneQuiz }} />
                </Col>
            </Row>
        </div>
    );
};

export default GetReady;
