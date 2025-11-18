import { useState, useEffect, lazy, Suspense } from 'react';
import { Container, Col, Row, Button, Card, CardBody, CardTitle, CardSubtitle, Alert } from 'reactstrap';
import { getLimitedQuizzes, getQuizzes } from '@/redux/slices/quizzesSlice';
import { useSelector, useDispatch } from 'react-redux';
import ResponsiveAd from '@/components/adsenses/ResponsiveAd';
import SquareAd from '@/components/adsenses/SquareAd';
import SearchInput from '@/utils/SearchInput';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';

const QuizItem = lazy(() => import('./QuizItem'));

const AllQuizzes = () => {

    // Redux
    const { isLoading, loadingLimited, quizzes, limitedQuizzes } = useSelector(state => state.quizzes);
    const dispatch = useDispatch();

    const [limit] = useState(20);
    const [skip, setSkip] = useState(0);
    const [searchKey, setSearchKey] = useState('');

    const nextPage = () => {
        setSkip(skip + limit);
    };

    const previousPage = () => {
        setSkip(skip - limit);
    };

    // Lifecycle methods
    useEffect(() => {
        dispatch(getLimitedQuizzes({ limit, skip }));
        dispatch(getQuizzes());
    }, [dispatch, limit, skip]);

    return (
        <Container className="posts main mt-4">

            <Card className="border-0 shadow-sm bg-gradient mb-4 mb-md-5">
                <CardBody className="text-center py-3 py-md-4 px-2 px-md-4">
                    <CardTitle tag="h1" className="mb-3 mb-md-4 text-uppercase fw-bolder fs-3 fs-md-2 text-primary">Knowledge matters, and so does the joy of quizzing!</CardTitle>
                    <CardSubtitle tag="p" className="text-muted lead fs-4 fs-md-3">
                        <span className="badge bg-light text-dark p-3 p-md-4 rounded-pill">~ Welcome! Explore and test your knowledge as you please! ~</span>
                    </CardSubtitle>
                </CardBody>
            </Card>

            <Row>
                <Col xs="12" className="px-3 px-md-4">
                    <Alert color="info" className="text-center py-2 py-md-3 mb-4 mb-md-5 shadow-sm">
                        <h4 className="mb-0 fw-bold fs-5 fs-md-4">Get ready for exam success! Let's make it happen together! <span role="img" aria-label="celebrate">🍾🎉</span></h4>
                    </Alert>
                </Col>
            </Row>

            <Row className="mt-4 mt-lg-5">
                <Col xs="12" md="2" className="order-2 order-md-1 mt-3 mt-md-2 d-flex justify-content-center align-items-center">
                    {/* Google responsive 1 ad */}
                    <div className='w-100 d-flex justify-content-center align-items-center'>
                        {process.env.NODE_ENV !== 'development' ? <ResponsiveAd /> : null}
                    </div>
                </Col>

                <Col xs="12" md="8" className="order-1 order-md-2 mt-3 mt-md-2">
                    <Suspense
                        fallback={<QBLoadingSM />}>
                        <Card className="border-0 shadow-sm mb-3 mb-md-4">
                            <CardBody className="text-center py-2 py-md-3">
                                <h3 className="mb-0 fw-bolder text-primary fs-4 fs-md-3">Entire Quiz Selection</h3>
                            </CardBody>
                        </Card>
                        {loadingLimited ?

                            <Card className="border-0 shadow-sm mt-4">
                                <CardBody className="py-5 d-flex justify-content-center align-items-center">
                                    <QBLoadingSM />
                                </CardBody>
                            </Card> :

                            <>

                                {/* Search input*/}
                                {isLoading ? (
                                    <Card className="border-0 shadow-sm mb-3">
                                        <CardBody className="p-3 d-flex justify-content-center align-items-center">
                                            <QBLoadingSM />
                                        </CardBody>
                                    </Card>
                                ) : (
                                    <Card className="border-0 shadow-sm mb-4">
                                        <CardBody className="p-2 p-md-3 d-flex justify-content-center">
                                            <div className="w-100 w-md-75">
                                                <SearchInput setSearchKey={setSearchKey} placeholder="Search quizzes here..." />
                                            </div>
                                        </CardBody>
                                    </Card>
                                )}

                                {searchKey === '' ? null :
                                    <Card className="border-0 shadow-sm mb-3">
                                        <CardBody className="p-3">
                                            <h5 className="mb-3 text-center">Search Results</h5>
                                            {quizzes?.map(quiz => (
                                                quiz.title.toLowerCase().includes(searchKey.toLowerCase()) ?
                                                    <QuizItem key={quiz._id} quiz={quiz} fromSearch={true} /> : null
                                            ))}
                                        </CardBody>
                                    </Card>
                                }

                                <Card className="border-0 shadow-sm mb-3">
                                    <CardBody className="p-3">
                                        {limitedQuizzes?.map(quiz => (
                                            quiz?.questions?.length > 5 ?
                                                <QuizItem key={quiz._id} quiz={quiz} /> :
                                                null
                                        ))}
                                    </CardBody>
                                </Card>

                                <Card className="border-0 shadow-sm mt-3 mb-5">
                                    <CardBody className="py-2 py-md-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
                                        <Button onClick={previousPage} className={`btn-sm w-100 w-md-auto ${skip < 1 ? 'invisible' : ''}`} color="primary" disabled={skip < 1} aria-label="Previous page">
                                            <i className="bi bi-chevron-left me-1"></i> Previous
                                        </Button>
                                        <div className="text-muted">Showing <span className="badge bg-secondary">{limitedQuizzes?.length || 0}</span> items</div>
                                        <Button onClick={nextPage} className={`btn-sm w-100 w-md-auto ${limitedQuizzes?.length < limit ? 'invisible' : ''}`} color="primary" disabled={limitedQuizzes?.length < limit} aria-label="Next page">
                                            Next <i className="bi bi-chevron-right ms-1"></i>
                                        </Button>
                                    </CardBody>
                                </Card>
                            </>}
                    </Suspense>
                </Col>

                <Col xs="12" md="2" className="order-3 mt-3 mt-md-2 w-100 d-flex justify-content-center align-items-center">
                    {/* Google square ad */}
                    <Row className='w-100 d-flex justify-content-center align-items-center'>
                        <Col xs="12" className='d-flex justify-content-center align-items-center'>
                            <div className='w-100 d-flex justify-content-center align-items-center'>
                                {process.env.NODE_ENV !== 'development' ? <SquareAd /> : null}
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default AllQuizzes;
