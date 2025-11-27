import { useEffect, useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Col, Row, Button } from 'reactstrap';
import ItemPlaceholder from '@/utils/rLoading/ItemPlaceholder';
import { useSelector, useDispatch } from 'react-redux';
import { getLimitedQuizzes } from '@/redux/slices/quizzesSlice';
import ResponsiveAd from '@/components/adsenses/ResponsiveAd';
import isAdEnabled from '@/utils/isAdEnabled';
import SquareAd from '@/components/adsenses/SquareAd';

const LandingSection = lazy(() => import('./LandingSection'));
const QuizItem = lazy(() => import('./QuizItem'));
const RightSide = lazy(() => import('./RightSide'));
const Popular = lazy(() => import('./Popular'));
const InFeedAd = lazy(() => import('@/components/adsenses/InFeedAd'));
const NotesPapers = lazy(() => import('./notes/NotesPapers'));
const BlogPosts = lazy(() => import('@/components/blog/BlogPosts'));
const ViewCategories = lazy(() => import('./categories/ViewCategories'));

const LandingQuizzes = () => {

  // Dispatch
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories);
  const [limit] = useState(10);

  // Lifecycle methods
  useEffect(() => {
    dispatch(getLimitedQuizzes({ limit }));
  }, [dispatch, limit]);

  // Selectors from redux store using hooks
  const { loadingLimited, limitedQuizzes } = useSelector(state => state.quizzes);

  return (
    <div className="posts w-100 px-0">
      <Row className="mx-0 px-1 px-lg-5">
        <Col sm="12" className="px-1">
          <Suspense fallback={<ItemPlaceholder />}>
            <LandingSection />
          </Suspense>
        </Col>
      </Row>

      <hr />
      <Row className="mt-lg-3 d-flex d-lg-none mobile-categories side-category">
        <Suspense fallback={<ItemPlaceholder />}>
          <ViewCategories categories={categories} />
        </Suspense>
      </Row>

      <Row
        className="mt-5 mx-0 py-sm-3 quizzes-list"
        role="region"
        aria-label="Latest quizzes"
      >
        <Col sm="8" className="px-1 px-lg-4 mt-md-2">
          <h1 className="mt-0 my-lg-3 py-lg-3 text-center fw-bolder py-2">
            Latest Quizzes
          </h1>

          {loadingLimited ? (
            <>
              <ItemPlaceholder />
              <ItemPlaceholder />
              <ItemPlaceholder />
              <ItemPlaceholder />
            </>
          ) : limitedQuizzes && limitedQuizzes.length > 0 ? (
            <>
              <section className="quizzes-grid" aria-live="polite">
                {limitedQuizzes.map((quiz) =>
                  <Suspense key={quiz._id} fallback={<ItemPlaceholder />}>
                    <QuizItem quiz={quiz} />
                  </Suspense>
                )}
              </section>
              <div className="my-4 d-flex justify-content-center">
                <Link to="/all-quizzes">
                  <Button outline color="success" className="view-all-btn">
                    More Quizzes Here &nbsp;
                    <i className="fa fa-arrow-right"></i>
                  </Button>
                </Link>
              </div>
              {isAdEnabled() && <div className="w-100 d-flex justify-content-center align-items-center">
                <SquareAd />
              </div>}
            </>
          ) : (
            <div className="p-1 m-1 d-flex justify-content-center align-items-center">
              No quizzes available today! &nbsp;
              <Button
                onClick={() => (window.location.href = '/contact')}
                outline
                color="success"
              >
                Contact us for more
              </Button>
            </div>
          )}
          <Popular />

          {/* ad */}
          {isAdEnabled() && <Row className="w-100 d-flex justify-content-center align-items-center">
            <Col
              sm="12"
              className="d-flex justify-content-center align-items-center"
            >
              <div className="w-100 d-flex justify-content-center align-items-center">
                <InFeedAd />
              </div>
            </Col>
          </Row>}
        </Col>

        <RightSide categories={categories} />
      </Row>

      <Suspense fallback={<ItemPlaceholder />}>
        <BlogPosts />
      </Suspense>

      <Suspense fallback={<ItemPlaceholder />}>
        <NotesPapers />
      </Suspense>

      {isAdEnabled() && <Row className="w-100 d-flex justify-content-center align-items-center">
        <Col
          sm="12"
          className="d-flex justify-content-center align-items-center"
        >
          <div className="w-100 d-flex justify-content-center align-items-center">
            <ResponsiveAd />
          </div>
        </Col>
      </Row>}
    </div>
  );
};

export default LandingQuizzes;
