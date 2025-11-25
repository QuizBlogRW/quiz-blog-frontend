import { useState, useEffect, lazy, Suspense } from 'react';
import { Col, Row, Button, Card, CardBody, CardTitle, CardSubtitle, Alert } from 'reactstrap';
import { getLimitedQuizzes, getQuizzes } from '@/redux/slices/quizzesSlice';
import { useSelector, useDispatch } from 'react-redux';

import SearchInput from '@/utils/SearchInput';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';

import ResponsiveAd from '@/components/adsenses/ResponsiveAd';
import SquareAd from '@/components/adsenses/SquareAd';

const QuizItem = lazy(() => import('./QuizItem'));

const AllQuizzes = () => {
    const dispatch = useDispatch();
    const { isLoading, loadingLimited, quizzes, limitedQuizzes } = useSelector(state => state.quizzes);

    const [limit] = useState(20);
    const [skip, setSkip] = useState(0);
    const [searchKey, setSearchKey] = useState('');

    const nextPage = () => setSkip(skip + limit);
    const previousPage = () => setSkip(Math.max(skip - limit, 0));

    useEffect(() => {
        dispatch(getLimitedQuizzes({ limit, skip }));
        dispatch(getQuizzes());
    }, [dispatch, limit, skip]);

    return (
        <div className="posts mt-4">
            {/* Hero section */}
            <Card className="border-0 shadow-sm bg-gradient mb-4 mb-md-5">
                <CardBody className="text-center py-3 py-md-4 px-2 px-md-4">
                    <CardTitle tag="h1" className="mb-3 mb-md-4 text-uppercase fw-bolder fs-3 fs-md-2 text-primary">
                        Knowledge matters, and so does the joy of quizzing!
                    </CardTitle>
                    <CardSubtitle tag="p" className="text-muted lead fs-4 fs-md-3">
                        <span className="badge bg-light text-dark p-3 p-md-4 rounded-pill">
                            ~ Welcome! Explore and test your knowledge as you please! ~
                        </span>
                    </CardSubtitle>
                </CardBody>
            </Card>

            {/* Motivational alert */}
            <Row>
                <Col xs="12" className="px-3 px-md-4">
                    <Alert color="info" className="text-center py-2 py-md-3 mb-4 mb-md-5 shadow-sm">
                        <h4 className="mb-0 fw-bold fs-5 fs-md-4">
                            Get ready for exam success! Let's make it happen together! <span role="img" aria-label="celebrate">🍾🎉</span>
                        </h4>
                    </Alert>
                </Col>
            </Row>

            {/* content */}
            <Row className="mt-4 mt-lg-5">
                {/* Left Ad */}
                <Col xs="12" md="2" className="order-2 order-md-1 mt-3 mt-md-2 d-flex justify-content-center align-items-start">
                    <div className='w-100 d-flex justify-content-center align-items-center'>
                        <ResponsiveAd />
                    </div>
                </Col>

                {/* Quiz list */}
                <Col xs="12" md="8" className="order-1 order-md-2 mt-3 mt-md-2">
                    <Suspense fallback={<QBLoadingSM />}>
                        {/* Section header */}
                        <Card className="border-0 shadow-sm mb-3 mb-md-4">
                            <CardBody className="text-center py-2 py-md-3">
                                <h3 className="mb-0 fw-bolder text-primary fs-4 fs-md-3">Entire Quiz Selection</h3>
                            </CardBody>
                        </Card>

                        {loadingLimited ? (
                            <Card className="border-0 shadow-sm mt-4">
                                <CardBody className="py-5 d-flex justify-content-center align-items-center">
                                    <QBLoadingSM />
                                </CardBody>
                            </Card>
                        ) : (
                            <>
                                {/* Search input */}
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

                                {/* Search results */}
                                {searchKey && (
                                    <Card className="border-0 shadow-sm mb-3">
                                        <CardBody className="p-3">
                                            <h5 className="mb-3 text-center">Search Results</h5>
                                            {quizzes?.filter(q => q.title.toLowerCase().includes(searchKey.toLowerCase()))
                                                .map(quiz => <QuizItem key={quiz._id} quiz={quiz} fromSearch />)}
                                        </CardBody>
                                    </Card>
                                )}

                                {/* Quiz items */}
                                <Card className="border-0 shadow-sm mb-3">
                                    <CardBody className="p-3">
                                        {limitedQuizzes?.filter(q => q?.questions?.length > 5)
                                            .map(quiz => <QuizItem key={quiz._id} quiz={quiz} />)}
                                    </CardBody>
                                </Card>

                                {/* Pagination */}
                                <Card className="border-0 shadow-sm mt-3 mb-5">
                                    <CardBody className="py-2 py-md-3 d-flex justify-content-between align-items-center gap-2">
                                        <Button
                                            onClick={previousPage}
                                            className={`btn-sm w-md-auto ${skip < 1 ? 'invisible' : ''}`}
                                            color="success"
                                            disabled={skip < 1}
                                            aria-label="Previous page"
                                        >
                                            <i className="bi bi-chevron-left me-1"></i> Previous
                                        </Button>

                                        <div className="text-muted">Showing <span className="badge bg-secondary">{limitedQuizzes?.length || 0}</span> items</div>

                                        <Button
                                            onClick={nextPage}
                                            className={`btn-sm w-md-auto ${limitedQuizzes?.length < limit ? 'invisible' : ''}`}
                                            color="success"
                                            disabled={limitedQuizzes?.length < limit}
                                            aria-label="Next page"
                                        >
                                            Next <i className="bi bi-chevron-right ms-1"></i>
                                        </Button>
                                    </CardBody>
                                </Card>
                            </>
                        )}
                    </Suspense>
                </Col>

                {/* Right Ad */}
                <Col xs="12" md="2" className="order-3 mt-3 mt-md-2 w-100 d-flex justify-content-center align-items-start">
                    <SquareAd />
                </Col>
            </Row>
        </div>
    );
};

export default AllQuizzes;
