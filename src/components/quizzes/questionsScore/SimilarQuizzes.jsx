import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, CardBody, Button, Row, Col, Badge } from 'reactstrap';
import Unavailable from './Unavailable';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import { calculateQuestionsDurationInMinutes } from "@/utils/quizUtils";

// Constants
const MAX_SIMILAR_QUIZZES = 3;
const BRAND_COLOR = '#157a6e';

// Helper Functions
const getDifficultyColor = (difficulty) => {
  const diff = difficulty?.toLowerCase();
  if (diff === 'easy') return 'success';
  if (diff === 'hard') return 'danger';
  return 'warning';
};

const shuffleArray = (array) => {
  return [...array].sort(() => 0.5 - Math.random());
};

// Section Header Component
const SectionHeader = ({ categoryTitle }) => (
  <div className="text-center mb-4 mb-md-5 px-2">
    <h4 className="fw-bold mb-2 mb-sm-3 fs-5 fs-md-4" style={{ color: BRAND_COLOR }}>
      <i className="fa fa-lightbulb me-2"></i>
      <span className="d-none d-sm-inline">You Might Also Like</span>
      <span className="d-inline d-sm-none">More Quizzes</span>
    </h4>
    <p className="text-muted mb-0 fs-6 fs-sm-5">
      <span className="d-none d-sm-inline">Similar quizzes from </span>
      <Badge
        color="success"
        className="px-2 px-sm-3 py-1"
        style={{ backgroundColor: BRAND_COLOR }}
      >
        {categoryTitle || 'this category'}
      </Badge>
    </p>
    <hr className="my-3 my-sm-4 mx-auto" style={{ maxWidth: '200px', opacity: '0.3' }} />
  </div>
);

// Quiz Stats Component
const QuizStats = ({ questionCount, estimatedMinutes, difficulty }) => (
  <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
    <div className="text-center flex-fill">
      <div className="fw-bold fs-6 fs-sm-5" style={{ color: BRAND_COLOR }}>
        {questionCount}
      </div>
      <small className="text-muted" style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)' }}>
        <span className="d-none d-sm-inline">Questions</span>
        <span className="d-inline d-sm-none">Qs</span>
      </small>
    </div>

    <div className="text-center flex-fill border-start border-end px-2">
      <div className="fw-bold fs-6 fs-sm-5" style={{ color: BRAND_COLOR }}>
        ~{estimatedMinutes}m
      </div>
      <small className="text-muted" style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)' }}>
        <span className="d-none d-sm-inline">Duration</span>
        <span className="d-inline d-sm-none">Time</span>
      </small>
    </div>

    <div className="text-center flex-fill">
      {difficulty ? (
        <>
          <Badge color={getDifficultyColor(difficulty)} className="mb-1">
            <span className="d-none d-sm-inline">{difficulty}</span>
            <span className="d-inline d-sm-none">
              {difficulty.charAt(0)}
            </span>
          </Badge>
          <div>
            <small className="text-muted" style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)' }}>
              Level
            </small>
          </div>
        </>
      ) : (
        <small className="text-muted">-</small>
      )}
    </div>
  </div>
);

// Quiz Card Component
const QuizCard = ({ quiz, index }) => {
  const questionCount = quiz.questions?.length || 0;
  const estimatedMinutes = calculateQuestionsDurationInMinutes(quiz.questions || []);

  return (
    <Col xs="12" md="6" lg="4" key={quiz._id || index}>
      <Card
        className="h-100 border-0 shadow-sm"
        style={{
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
        }}
      >
        <CardBody className="d-flex flex-column p-3 p-sm-4">
          {/* Quiz Number Badge */}
          <div className="mb-2">
            <Badge
              color="light"
              className="px-2 py-1"
              style={{
                backgroundColor: '#f3f3f2',
                color: BRAND_COLOR,
                fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)'
              }}
            >
              Quiz #{index + 1}
            </Badge>
          </div>

          {/* Title */}
          <h5
            className="fw-bold mb-2 fs-6 fs-sm-5"
            style={{
              color: BRAND_COLOR,
              lineHeight: '1.4',
            }}
          >
            {quiz.title}
          </h5>

          {/* Description */}
          <p
            className="text-muted mb-3 flex-grow-1"
            style={{
              fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem)',
              lineHeight: '1.5',
            }}
          >
            {quiz.description || 'Test your knowledge with this quiz!'}
          </p>

          {/* Quiz Stats */}
          <QuizStats
            questionCount={questionCount}
            estimatedMinutes={estimatedMinutes}
            difficulty={quiz.difficulty}
          />

          {/* Action Button */}
          <Link
            to={`/view-quiz/${quiz.slug}`}
            className="text-decoration-none"
          >
            <Button
              color="warning"
              className="w-100 fw-bold py-2"
              style={{
                backgroundColor: '#ffc107',
                border: 'none',
                color: BRAND_COLOR,
                transition: 'all 0.2s ease-in-out',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
              }}
            >
              <i className="fa fa-play-circle me-2"></i>
              <span className="d-none d-sm-inline">Start Quiz</span>
              <span className="d-inline d-sm-none">Start</span>
            </Button>
          </Link>
        </CardBody>
      </Card>
    </Col>
  );
};

// Browse All Button Component
const BrowseAllButton = () => (
  <div className="text-center mt-4 mt-sm-5 px-2">
    <Link to="/all-quizzes" className="text-decoration-none">
      <Button
        color="success"
        outline
        size="lg"
        className="px-4 px-sm-5 py-2 py-sm-3 fw-bold"
        style={{
          borderColor: BRAND_COLOR,
          color: BRAND_COLOR,
          transition: 'all 0.2s ease-in-out',
          fontSize: 'clamp(0.875rem, 2vw, 1rem)',
        }}
      >
        <i className="fa fa-grid me-2"></i>
        <span className="d-none d-sm-inline">Browse All Quizzes</span>
        <span className="d-inline d-sm-none">All Quizzes</span>
      </Button>
    </Link>
  </div>
);

// Loading State Component
const LoadingState = () => (
  <div className="text-center py-5">
    <QBLoadingSM />
    <p className="text-muted mt-3" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
      <span className="d-none d-sm-inline">Loading similar quizzes...</span>
      <span className="d-inline d-sm-none">Loading...</span>
    </p>
  </div>
);

// Error State Component
const ErrorState = ({ error }) => (
  <div className="text-center py-5 px-2">
    <div className="alert alert-danger d-inline-block">
      <i className="fa fa-exclamation-triangle me-2"></i>
      <span className="d-none d-sm-inline">Failed to load quizzes: {error}</span>
      <span className="d-inline d-sm-none">Loading failed</span>
    </div>
  </div>
);

// Main Component
const SimilarQuizzes = ({ thisQuiz }) => {
  const { allcategories, isLoading, error } = useSelector(
    (state) => state.categories
  );

  // Get category and its quizzes
  const categoryData = useMemo(() => {
    if (!allcategories || !thisQuiz?.category?._id) {
      return { category: null, quizzes: [] };
    }

    const categoryId = thisQuiz.category._id;
    const category = allcategories.find((c) => c._id === categoryId);

    // Handle both 'quizes' and 'quizzes' spelling variations
    const quizzes = category?.quizes || category?.quizzes || [];

    return { category, quizzes };
  }, [allcategories, thisQuiz]);

  // Filter and randomize quizzes
  const similarQuizzes = useMemo(() => {
    if (!categoryData.quizzes.length || !thisQuiz?._id) return [];

    const filtered = categoryData.quizzes.filter(
      (quiz) => quiz._id !== thisQuiz._id
    );

    return shuffleArray(filtered).slice(0, MAX_SIMILAR_QUIZZES);
  }, [categoryData.quizzes, thisQuiz?._id]);

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} />;
  }

  // No similar quizzes
  if (!similarQuizzes.length) {
    return (
      <div className="my-4 my-sm-5">
        <Unavailable
          title="No Related Quizzes Available Yet"
          link="/all-quizzes"
          more="quizzes"
        />
      </div>
    );
  }

  // Main render
  return (
    <div className="similar-quizzes my-4 my-sm-5 px-2 px-md-3">
      {/* Section Header */}
      <SectionHeader categoryTitle={categoryData.category?.title} />

      {/* Quiz Cards */}
      <Row className="g-3 g-md-4">
        {similarQuizzes.map((quiz, index) => (
          <QuizCard key={quiz._id || index} quiz={quiz} index={index} />
        ))}
      </Row>

      {/* Browse All Link */}
      <BrowseAllButton />
    </div>
  );
};

export default SimilarQuizzes;