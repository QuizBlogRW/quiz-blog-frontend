import { useEffect, useMemo, lazy, Suspense } from 'react';
import { Container, Col, Row, Card, Button, CardTitle, CardText } from 'reactstrap';
import { Link, useParams } from 'react-router-dom';
import { getOneQuiz } from '@/redux/slices/quizzesSlice';
import { useSelector, useDispatch } from 'react-redux';
import EmbeddedVideos from './EmbeddedVideos';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';

const ResponsiveHorizontal = lazy(() => import('@/components/adsenses/ResponsiveHorizontal'));

const GetReady = () => {
    const dispatch = useDispatch();
    const { quizSlug } = useParams();
    const { oneQuiz, isLoading, error } = useSelector(state => state.quizzes);
    const { user } = useSelector(state => state.auth);

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
        share: isAmategeko ? 'Sangiza' : 'Share this Quiz',
        back: isAmategeko ? 'Garuka' : '⬅ Back to Quizzes',
    };

    if (isLoading) return <div className="vh-100 d-flex justify-content-center align-items-center"><QBLoadingSM /></div>;
    if (error) return <div className="text-danger text-center my-5">Failed to load quiz. Please try again.</div>;
    if (!oneQuiz) return null;

    if (shuffledQuestions.length === 0)
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                <Container className="text-center">
                    <Card className="shadow-sm border-0 p-4 mx-auto" style={{ maxWidth: '600px' }}>
                        <CardTitle tag="h4" className="text-danger fw-bold mb-3">
                            😕 This quiz has no questions yet!
                        </CardTitle>
                        <CardText className="text-secondary mb-4">
                            This quiz is still being prepared. Don’t worry — plenty of other quizzes are ready for you to try!
                        </CardText>
                        <Link to="/all-quizzes">
                            <Button color="success" className="px-4 py-2 fw-semibold">
                                <i className="fa fa-list me-2"></i> Browse Other Quizzes
                            </Button>
                        </Link>
                    </Card>
                </Container>
            </div>
        );

    return (
        <div className="py-3 d-flex flex-column align-items-center">
            <Container className="main my-4 py-3 rounded w-100">
                <Row className="justify-content-center">
                    <Col xs="12" md="10" lg="8">
                        <Card body className="text-center my-3 mx-auto p-4 shadow-sm border border-3" style={{ borderColor: 'var(--brand)' }}>
                            <CardTitle tag="h5" className="text-uppercase text-primary fw-bolder mb-3">
                                {oneQuiz.title} ({shuffledQuestions.length})
                            </CardTitle>
                            <CardText className="text-secondary mb-3">{oneQuiz.description}</CardText>
                            <small className={`d-block mb-3 fw-bold text-${user ? 'success' : 'danger'}`}>{texts.ready}</small>

                            {/* Buttons */}
                            <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
                                <Link to={`/attempt-quiz/${oneQuiz.slug}`} state={{ ...oneQuiz, questions: shuffledQuestions }}>
                                    <Button className="btn-brand px-4 py-2">{texts.attempt}</Button>
                                </Link>

                                <Button color="success" className="px-3 py-2 share-btn d-flex align-items-center">
                                    <i className="fa-brands fa-whatsapp me-2"></i>
                                    <a
                                        className="text-white text-decoration-none"
                                        href={`https://api.whatsapp.com/send?text=Attempt this ${oneQuiz.title} quiz on Quiz-Blog%0Ahttps://www.quizblog.rw/view-quiz/${oneQuiz.slug}`}
                                    >
                                        {texts.share}
                                    </a>
                                </Button>

                                <Link to="/">
                                    <Button className="btn-accent px-4 py-2">{texts.back}</Button>
                                </Link>
                            </div>

                            <small className="d-block mt-3 fw-bold text-muted">~{oneQuiz.category?.title}~</small>
                        </Card>

                        {/* Adsense */}
                        <Suspense fallback={<QBLoadingSM />}>
                            <ResponsiveHorizontal />
                        </Suspense>

                        {/* Embedded Videos */}
                        <EmbeddedVideos quiz={oneQuiz} />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default GetReady;
