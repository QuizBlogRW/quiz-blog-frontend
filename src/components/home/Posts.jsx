import { useEffect, useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { Container, Col, Row, Button } from "reactstrap";
import PostItemPlaceholder from "@/utils/rLoading/PostItemPlaceholder";
import { useSelector, useDispatch } from "react-redux";
import { getLimitedQuizzes } from "@/redux/slices/quizzesSlice";
import ResponsiveAd from "@/components/adsenses/ResponsiveAd";
import SquareAd from "@/components/adsenses/SquareAd";

const LandingSection = lazy(() => import("./LandingSection"));
const PostItem = lazy(() => import("./PostItem"));
const RightSide = lazy(() => import("./RightSide"));
const Popular = lazy(() => import("./Popular"));
const InFeedAd = lazy(() => import("@/components/adsenses/InFeedAd"));
const NotesPapers = lazy(() => import("./notes/NotesPapers"));
const BlogPosts = lazy(() => import("@/components/blog/BlogPosts"));
const ViewCategories = lazy(() => import("./categories/ViewCategories"));

const Posts = () => {
  // Dispatch
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories);
  const [limit] = useState(10);

  // Lifecycle methods
  useEffect(() => {
    dispatch(getLimitedQuizzes({ limit }));
  }, [dispatch, limit]);

  // Selectors from redux store using hooks
  const { loadingLimited, limitedQuizzes } = useSelector(
    (state) => state.quizzes
  );

  return (
    <Container className="posts main w-100 px-0">
      <Row className="mx-0 px-1 px-lg-5">
        <Col sm="12" className="px-1">
          <Suspense fallback={<PostItemPlaceholder />}>
            <LandingSection />
          </Suspense>
        </Col>
      </Row>

      <hr />
      <Row className="mt-lg-3 d-flex d-lg-none mobile-categories side-category">
        <Suspense fallback={<PostItemPlaceholder />}>
          <ViewCategories categories={categories} />
        </Suspense>
      </Row>

      <Row
        className="mt-5 mx-0 py-sm-3 quizzes-list"
        role="region"
        aria-label="Latest quizzes"
      >
        <Col sm="8" className="px-1 px-lg-4 mt-md-2">
          <h3 className="inversed-title mt-0 my-lg-3 py-lg-3 text-center fw-bolder py-2">
            <span className="part1">FreshQuiz:</span>
            <span className="part2">The Latest Quizzes</span>
          </h3>

          {loadingLimited ? (
            <>
              <PostItemPlaceholder />
              <PostItemPlaceholder />
              <PostItemPlaceholder />
              <PostItemPlaceholder />
            </>
          ) : limitedQuizzes && limitedQuizzes.length > 0 ? (
            <>
              <section className="quizzes-grid" aria-live="polite">
                {limitedQuizzes.map((quiz) =>
                  quiz.questions && quiz.questions.length > 5 ? (
                    <Suspense key={quiz._id} fallback={<PostItemPlaceholder />}>
                      <PostItem quiz={quiz} />
                    </Suspense>
                  ) : null
                )}
              </section>
              <div className="my-4 d-flex justify-content-center">
                <Link to="/allposts">
                  <Button outline color="success" className="view-all-btn">
                    More Quizzes Here &nbsp;
                    <i className="fa fa-arrow-right"></i>
                  </Button>
                </Link>
              </div>
              <div className="w-100 d-flex justify-content-center align-items-center">
                {process.env.NODE_ENV !== "development" ? <SquareAd /> : null}
              </div>
            </>
          ) : (
            <div className="p-1 m-1 d-flex justify-content-center align-items-center">
              No quizzes available today. &nbsp;
              <Button
                onClick={() => (window.location.href = "/contact")}
                outline
                color="success"
              >
                Contact us for more
              </Button>
            </div>
          )}
          <Popular />

          {/* ad */}
          <Row className="w-100 d-flex justify-content-center align-items-center">
            <Col
              sm="12"
              className="d-flex justify-content-center align-items-center"
            >
              <div className="w-100 d-flex justify-content-center align-items-center">
                {process.env.NODE_ENV !== "development" ? <InFeedAd /> : null}
              </div>
            </Col>
          </Row>
        </Col>

        <RightSide categories={categories} />
      </Row>

      <Suspense fallback={<PostItemPlaceholder />}>
        <BlogPosts />
      </Suspense>

      <Suspense fallback={<PostItemPlaceholder />}>
        <NotesPapers />
      </Suspense>

      <Row className="w-100 d-flex justify-content-center align-items-center">
        <Col
          sm="12"
          className="d-flex justify-content-center align-items-center"
        >
          <div className="w-100 d-flex justify-content-center align-items-center">
            {process.env.NODE_ENV !== "development" ? <ResponsiveAd /> : null}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Posts;
