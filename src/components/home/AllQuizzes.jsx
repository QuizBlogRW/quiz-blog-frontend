import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { Col, Row, Button, Card, CardBody, CardTitle, CardSubtitle, Alert } from 'reactstrap';
import { getLimitedQuizzes, getQuizzes } from '@/redux/slices/quizzesSlice';
import { useSelector, useDispatch } from 'react-redux';

import SearchInput from '@/utils/SearchInput';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import ResponsiveAd from '@/components/adsenses/ResponsiveAd';
import isAdEnabled from '@/utils/isAdEnabled';
import SquareAd from '@/components/adsenses/SquareAd';

const QuizItem = lazy(() => import('./QuizItem'));

// Constants
const ITEMS_PER_PAGE = 20;
const MIN_QUESTIONS = 5;

// Hero Section Component
const HeroSection = () => (
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
);

// Motivational Alert Component
const MotivationalAlert = () => (
    <Row>
        <Col xs="12" className="px-3 px-md-4">
            <Alert color="info" className="text-center py-2 py-md-3 mb-4 mb-md-5 shadow-sm">
                <h4 className="mb-0 fw-bold fs-5 fs-md-4">
                    Get ready for exam success! Let&apos;s make it happen together!{' '}
                    <span role="img" aria-label="celebrate">🍾🎉</span>
                </h4>
            </Alert>
        </Col>
    </Row>
);

// Search Section Component
const SearchSection = ({ setSearchKey, isLoading }) => {
    if (isLoading) {
        return (
            <Card className="border-0 shadow-sm mb-3">
                <CardBody className="p-3 d-flex justify-content-center align-items-center">
                    <QBLoadingSM />
                </CardBody>
            </Card>
        );
    }

    return (
        <Card className="border-0 shadow-sm mb-4">
            <CardBody className="p-2 p-md-3 d-flex justify-content-center">
                <div style={{ width: '100%', maxWidth: '600px' }}>
                    <SearchInput
                        setSearchKey={setSearchKey}
                        placeholder="Search quizzes here..."
                        aria-label="Search quizzes"
                    />
                </div>
            </CardBody>
        </Card>
    );
};

// Search Results Component
const SearchResults = ({ searchKey, filteredQuizzes }) => {
    if (!searchKey) return null;

    return (
        <Card className="border-0 shadow-sm mb-3">
            <CardBody className="p-3">
                <h5 className="mb-3 text-center">
                    Search Results {filteredQuizzes.length > 0 && (
                        <span className="badge bg-primary ms-2">{filteredQuizzes.length}</span>
                    )}
                </h5>
                <div role="region" aria-live="polite" aria-atomic="true">
                    {filteredQuizzes.length > 0 ? (
                        filteredQuizzes.map(quiz => (
                            <QuizItem key={quiz._id} quiz={quiz} fromSearch />
                        ))
                    ) : (
                        <p className="text-center text-muted my-4">
                            No quizzes found matching &quot;{searchKey}&quot;
                        </p>
                    )}
                </div>
            </CardBody>
        </Card>
    );
};

// Pagination Controls Component
const PaginationControls = ({ skip, limit, itemCount, onPrevious, onNext }) => (
    <Card className="border-0 shadow-sm mt-3 mb-5">
        <CardBody className="py-2 py-md-3 d-flex justify-content-between align-items-center gap-2">
            <Button
                onClick={onPrevious}
                className={`btn-sm ${skip < 1 ? 'invisible' : ''}`}
                color="success"
                disabled={skip < 1}
                aria-label="Previous page"
            >
                <i className="bi bi-chevron-left me-1"></i> Previous
            </Button>

            <div className="text-muted">
                Showing <span className="badge bg-secondary">{itemCount}</span> items
            </div>

            <Button
                onClick={onNext}
                className={`btn-sm ${itemCount < limit ? 'invisible' : ''}`}
                color="success"
                disabled={itemCount < limit}
                aria-label="Next page"
            >
                Next <i className="bi bi-chevron-right ms-1"></i>
            </Button>
        </CardBody>
    </Card>
);

// Quiz List Component
const QuizList = ({ quizzes, isLoading }) => {
    if (isLoading) {
        return (
            <Card className="border-0 shadow-sm mt-4">
                <CardBody className="py-5 d-flex justify-content-center align-items-center">
                    <QBLoadingSM />
                </CardBody>
            </Card>
        );
    }

    if (!quizzes || quizzes.length === 0) {
        return (
            <Card className="border-0 shadow-sm mb-3">
                <CardBody className="p-3 text-center text-muted">
                    <p className="my-4">No quizzes available at the moment.</p>
                </CardBody>
            </Card>
        );
    }

    return (
        <Card className="border-0 shadow-sm mb-3">
            <CardBody className="p-3">
                {quizzes.map(quiz => (
                    <QuizItem key={quiz._id} quiz={quiz} />
                ))}
            </CardBody>
        </Card>
    );
};

// Main Component
const AllQuizzes = () => {
    const dispatch = useDispatch();
    const { isLoading, loadingLimited, quizzes, limitedQuizzes } = useSelector(
        state => state.quizzes
    );

    const [limit] = useState(ITEMS_PER_PAGE);
    const [skip, setSkip] = useState(0);
    const [searchKey, setSearchKey] = useState('');

    // Memoized filtered quizzes for search
    const filteredQuizzes = useMemo(() => {
        if (!searchKey || !quizzes) return [];
        const lowerSearchKey = searchKey.toLowerCase();
        return quizzes.filter(q =>
            q?.title?.toLowerCase().includes(lowerSearchKey)
        );
    }, [quizzes, searchKey]);

    // Memoized valid quizzes (with minimum question count)
    const validLimitedQuizzes = useMemo(() => {
        if (!limitedQuizzes) return [];
        return limitedQuizzes.filter(q => q?.questions?.length > MIN_QUESTIONS);
    }, [limitedQuizzes]);

    // Pagination handlers
    const nextPage = () => setSkip(skip + limit);
    const previousPage = () => setSkip(Math.max(skip - limit, 0));

    // Reset pagination when searching
    useEffect(() => {
        if (searchKey) {
            setSkip(0);
        }
    }, [searchKey]);

    // Fetch limited quizzes based on pagination
    useEffect(() => {
        dispatch(getLimitedQuizzes({ limit, skip }));
    }, [dispatch, limit, skip]);

    // Fetch all quizzes for search
    useEffect(() => {
        dispatch(getQuizzes());
    }, [dispatch]);

    return (
        <div className="posts mt-4">
            <HeroSection />
            <MotivationalAlert />

            {/* Main Content */}
            <Row className="mt-4 mt-lg-5">
                {/* Left Ad */}
                {isAdEnabled() && (
                    <Col
                        xs="12"
                        md="2"
                        className="order-2 order-md-1 mt-3 mt-md-2 d-flex justify-content-center align-items-start"
                    >
                        <div className="w-100 d-flex justify-content-center align-items-center">
                            <ResponsiveAd />
                        </div>
                    </Col>
                )}

                {/* Quiz List Section */}
                <Col xs="12" md={isAdEnabled() ? "8" : "12"} className="order-1 order-md-2 mt-3 mt-md-2">
                    <Suspense fallback={<QBLoadingSM />}>
                        {/* Section Header */}
                        <Card className="border-0 shadow-sm mb-3 mb-md-4">
                            <CardBody className="text-center py-2 py-md-3">
                                <h3 className="mb-0 fw-bolder text-primary fs-4 fs-md-3">
                                    Entire Quiz Selection
                                </h3>
                            </CardBody>
                        </Card>

                        {/* Search Input */}
                        <SearchSection
                            setSearchKey={setSearchKey}
                            isLoading={isLoading}
                        />

                        {/* Search Results */}
                        <SearchResults
                            searchKey={searchKey}
                            filteredQuizzes={filteredQuizzes}
                        />

                        {/* Quiz Items with Pagination */}
                        {!searchKey && (
                            <>
                                <QuizList
                                    quizzes={validLimitedQuizzes}
                                    isLoading={loadingLimited}
                                />

                                {!loadingLimited && validLimitedQuizzes.length > 0 && (
                                    <PaginationControls
                                        skip={skip}
                                        limit={limit}
                                        itemCount={validLimitedQuizzes.length}
                                        onPrevious={previousPage}
                                        onNext={nextPage}
                                    />
                                )}
                            </>
                        )}
                    </Suspense>
                </Col>

                {/* Right Ad */}
                {isAdEnabled() && (
                    <Col
                        xs="12"
                        md="2"
                        className="order-3 mt-3 mt-md-2 d-flex justify-content-center align-items-start"
                    >
                        <SquareAd />
                    </Col>
                )}
            </Row>
        </div>
    );
};

export default AllQuizzes;