import { useState, useEffect, lazy, Suspense } from 'react';
import { Container, Col, Row, Button } from 'reactstrap';
import { getLimitedQuizzes, getQuizzes } from '@/redux/slices/quizzesSlice';
import { useSelector, useDispatch } from 'react-redux';
import ResponsiveAd from '@/components/adsenses/ResponsiveAd';
import SquareAd from '@/components/adsenses/SquareAd';
import SearchInput from '@/utils/SearchInput';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';

const PostItem = lazy(() => import('./PostItem'));

const Posts = () => {

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
        dispatch(getLimitedQuizzes({ skip, limit }));
        dispatch(getQuizzes());
    }, [dispatch, skip, limit]);

    return (
        <Container className="posts main mt-4">

            <blockquote className="blockquote text-center mt-3 mt-sm-5">
                <h1 className="mb-4 lead text-uppercase fw-bolder">Knowledge matters, and so does the joy of quizzing!</h1>
                <small className="text-muted mt-2 p-1 m-lg-4">
                    &nbsp;~&nbsp; Welcome! Explore and test your knowledge as you please! &nbsp;~&nbsp;
                </small>
            </blockquote>

            <Row className="my-5 mx-0">
                <div className="callout text-center w-100">
                    <h4 className='d-inline rounded p-2 callout-text'>
                        Get ready for exam success! Let's make it happen together! <span role="img" aria-label="celebrate">🍾🎉</span>
                    </h4>
                </div>
            </Row>

            <Row className="mt-lg-5">
                <Col sm="2" className="mt-md-2 d-flex justify-content-center align-items-center">
                    {/* Google responsive 1 ad */}
                    <div className='w-100 d-flex justify-content-center align-items-center'>
                        {process.env.NODE_ENV !== 'development' ? <ResponsiveAd /> : null}
                    </div>
                </Col>

                <Col sm="8" className="mt-md-2">
                    <Suspense
                        fallback={<QBLoadingSM />}>
                        <h3 className="mb-3 text-center lead fw-bolder">Entire Quiz Selection</h3>
                        {loadingLimited ?

                            <div className="mt-5 pt-5 d-flex justify-content-center align-items-center">
                                <QBLoadingSM />
                            </div> :

                            <>

                                {/* Search input*/}
                                {isLoading ? (
                                    <div className="p-1 m-1 d-flex justify-content-center align-items-center">
                                        <QBLoadingSM />
                                    </div>
                                ) : (
                                    <div className="d-flex justify-content-center mb-3">
                                        <SearchInput setSearchKey={setSearchKey} placeholder="Search quizzes here..." />
                                    </div>
                                )}

                                {searchKey === '' ? null :

                                    quizzes?.map(quiz => (

                                        quiz.title.toLowerCase().includes(searchKey.toLowerCase()) ?
                                            <PostItem key={quiz._id} quiz={quiz} fromSearch={true} /> : null
                                    ))}

                                {limitedQuizzes?.map(quiz => (
                                    quiz?.questions?.length > 5 ?
                                        <PostItem key={quiz._id} quiz={quiz} /> :
                                        null
                                ))}

                                <div className="w-100 d-flex justify-content-between mx-auto my-3 overflow-auto pb-2">
                                    <Button onClick={previousPage} className={`btn-sm ${skip < 1 ? 'invisible' : ''}`} style={{ backgroundColor: 'var(--brand)', color: 'var(--accent)' }} aria-label="Previous page">
                                        Previous
                                    </Button>
                                    <div className="text-muted align-self-center small">Showing {limitedQuizzes?.length || 0} items</div>
                                    <Button onClick={nextPage} className={`btn-sm ${limitedQuizzes?.length < limit ? 'invisible' : ''}`} style={{ backgroundColor: 'var(--brand)', color: 'var(--accent)' }} aria-label="Next page">
                                        Next
                                    </Button>
                                </div>
                            </>}
                    </Suspense>
                </Col>

                <Col sm="2" className="mt-md-2 w-100 d-flex justify-content-center align-items-center">
                    {/* Google square ad */}
                    <Row className='w-100 d-flex justify-content-center align-items-center'>
                        <Col sm="12" className='d-flex justify-content-center align-items-center'>
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

export default Posts;
