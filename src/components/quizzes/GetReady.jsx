import { useEffect, useMemo, lazy, Suspense } from 'react';
import { Col, Row, Card, Button, CardTitle, CardText } from 'reactstrap';
import { Link, useParams } from 'react-router-dom';
import { getOneQuiz } from '@/redux/slices/quizzesSlice';
import { useSelector, useDispatch } from 'react-redux';
import EmbeddedVideos from './EmbeddedVideos';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import isAdEnabled from '@/utils/isAdEnabled';

const ResponsiveHorizontal = lazy(() => import('@/components/adsenses/ResponsiveHorizontal'));

const GetReady = () => {

    const dispatch = useDispatch();
    const { quizSlug } = useParams();
    const { oneQuiz, isLoading, error } = useSelector(state => state.quizzes);
    const { user } = useSelector(state => state.users);
    const currentDomain = window.location.origin;
    const shareText = `Attempt this "${oneQuiz.title}" quiz on Quiz-Blog\n${currentDomain}/view-quiz/${oneQuiz.slug}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

    useEffect(() => {
        if (!oneQuiz || oneQuiz.slug !== quizSlug) dispatch(getOneQuiz(quizSlug));
    }, [dispatch, quizSlug, oneQuiz]);

    const shuffledQuestions = useMemo(() => {
        return oneQuiz?.questions ? [...oneQuiz.questions].sort(() => Math.random() - 0.5) : [];
    }, [oneQuiz?.questions]);

    const currentCategory = oneQuiz?.category?._id;
    const isAmategeko = currentCategory === '60e8e72d4463f50015a81f96';

    const texts = {
        ready: user
            ? isAmategeko
                ? `${user.name}, witeguye gutangira isuzuma?`
                : `${user.name}, are you ready to start the quiz?`
            : isAmategeko
                ? 'Kugirango uze kubona uko wasubije, Injira cyangwa ufungure konti 😎'
                : 'To save and review your answers, please log in or create an account 😎',
        attempt: isAmategeko ? 'Tangira Isuzuma' : 'Start Quiz',
        share: isAmategeko ? 'Sangiza' : 'Share Quiz',
        back: isAmategeko ? 'Garuka' : 'Go Back',
    };

    if (isLoading) return <QBLoadingSM />;

    if (error)
        return (
            <div className="text-danger text-center my-5 fw-bold">
                Failed to load quiz. Please try again.
            </div>
        );

    if (!oneQuiz) return null;
    console.log(oneQuiz)

    // If quiz has no questions
    if (shuffledQuestions.length === 0)
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                <div className="text-center">
                    <Card className="shadow border-0 p-4 mx-auto" style={{ maxWidth: '600px' }}>
                        <CardTitle tag="h4" className="text-danger fw-bold mb-3">
                            😕 This quiz has no questions yet!
                        </CardTitle>
                        <CardText className="text-secondary mb-4">
                            This quiz is still being prepared. Don’t worry — plenty of other quizzes
                            are ready for you to try!
                        </CardText>
                        <Link to="/all-quizzes">
                            <Button color="success" className="px-4 py-2 fw-semibold">
                                <i className="fa fa-list me-2"></i> Browse Other Quizzes
                            </Button>
                        </Link>
                    </Card>
                </div>
            </div>
        );

    return (
        <div className="py-4 rounded">
            <Row className="justify-content-center">
                <Col xs="12" md="10" lg="8">
                    <Card
                        body
                        className="text-center m-3 mx-md-auto p-4 shadow rounded-4 border border-2"
                        style={{
                            borderColor: 'var(--brand)',
                            background: '#ffffff',
                        }}
                    >
                        <CardTitle
                            tag="h4"
                            className="text-primary fw-bold mb-3 text-uppercase"
                        >
                            {oneQuiz.title} ({shuffledQuestions.length})
                        </CardTitle>

                        <CardText className="text-muted mb-3 fs-6">
                            {oneQuiz.description}
                        </CardText>

                        <small
                            className={`d-block mb-3 fw-semibold text-${user ? 'success' : 'danger'}`}
                        >
                            {texts.ready}
                        </small>

                        {/* Buttons */}
                        <div className="d-flex flex-wrap justify-content-center gap-3 mt-3">

                            <Button
                                className="btn-accent px-4 py-2 fw-semibold shadow-sm d-flex align-items-center"
                                tag="a"
                                href={whatsappUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <i className="fa-brands fa-whatsapp me-2"></i>
                                {texts.share}
                            </Button>

                            <Link
                                to={`/attempt-quiz/${oneQuiz.slug}`}
                                state={{ ...oneQuiz, questions: shuffledQuestions }}
                            >
                                <Button className="px-4 py-2 fw-semibold shadow-sm" color="success">
                                    <i className="fa-regular fa-circle-play me-2"></i>
                                    {texts.attempt}
                                </Button>
                            </Link>

                            <Link to="/">
                                <Button className="btn-accent px-4 py-2 fw-semibold shadow-sm">
                                    <i className="fas fa-circle-left me-2"></i>
                                    {texts.back}
                                </Button>
                            </Link>
                        </div>

                        <small className="d-block mt-4 fw-bold text-muted">
                            ~ {oneQuiz.category?.title} ~
                        </small>
                    </Card>

                    {/* Adsense */}
                    {isAdEnabled && <Suspense fallback={<QBLoadingSM />}>
                        <ResponsiveHorizontal />
                    </Suspense>}

                    {/* Videos */}
                    <EmbeddedVideos quiz={oneQuiz} />
                </Col>
            </Row>
        </div>
    );
};

export default GetReady;
