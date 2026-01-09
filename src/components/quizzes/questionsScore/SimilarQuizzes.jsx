import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, CardBody, Button, Row, Col, Badge } from 'reactstrap';
import Unavailable from './Unavailable';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import { calculateQuestionsDurationInMinutes } from "@/utils/quizUtils";

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

    return categoryData.quizzes
      .filter((quiz) => quiz._id !== thisQuiz._id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  }, [categoryData.quizzes, thisQuiz?._id]);

  // Calculate difficulty color
  const getDifficultyColor = (difficulty) => {
    const diff = difficulty?.toLowerCase();
    if (diff === 'easy') return 'success';
    if (diff === 'hard') return 'danger';
    return 'warning';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="text-center py-5">
        <QBLoadingSM />
        <p className="text-muted mt-3">Loading similar quizzes...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-5">
        <div className="alert alert-danger d-inline-block">
          <i className="fa fa-exclamation-triangle me-2"></i>
          Failed to load quizzes: {error}
        </div>
      </div>
    );
  }

  // No similar quizzes
  if (!similarQuizzes.length) {
    return (
      <div className="my-5">
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
    <div className="similar-quizzes my-5 px-2 px-md-3">
      {/* Section Header */}
      <div className="text-center mb-4">
        <h4 className="fw-bold mb-2" style={{ color: '#157a6e' }}>
          <i className="fa fa-lightbulb me-2"></i>
          You Might Also Like
        </h4>
        <p className="text-muted mb-0">
          Similar quizzes from{' '}
          <Badge
            color="success"
            className="px-3 py-1"
            style={{ backgroundColor: '#157a6e' }}
          >
            {categoryData.category?.title || 'this category'}
          </Badge>
        </p>
        <hr className="my-4 mx-auto" style={{ maxWidth: '200px', opacity: '0.3' }} />
      </div>

      {/* Quiz Cards */}
      <Row className="g-3 g-md-4">
        {similarQuizzes.map((quiz, index) => {

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
                <CardBody className="d-flex flex-column p-4">
                  {/* Quiz Number Badge */}
                  <div className="mb-2">
                    <Badge
                      color="light"
                      className="px-2 py-1"
                      style={{
                        backgroundColor: '#f3f3f2',
                        color: '#157a6e',
                        fontSize: '0.75rem'
                      }}
                    >
                      Quiz #{index + 1}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h5 className="fw-bold mb-2" style={{ color: '#157a6e' }}>
                    {quiz.title}
                  </h5>

                  {/* Description */}
                  <p className="text-muted mb-3 flex-grow-1" style={{ fontSize: '0.9rem' }}>
                    {quiz.description || 'Test your knowledge with this quiz!'}
                  </p>

                  {/* Quiz Stats */}
                  <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                    <div className="text-center flex-fill">
                      <div className="fw-bold" style={{ color: '#157a6e' }}>
                        {questionCount}
                      </div>
                      <small className="text-muted">Questions</small>
                    </div>
                    <div className="text-center flex-fill border-start border-end">
                      <div className="fw-bold" style={{ color: '#157a6e' }}>
                        ~{estimatedMinutes}m
                      </div>
                      <small className="text-muted">Duration</small>
                    </div>
                    <div className="text-center flex-fill">
                      {quiz.difficulty && (
                        <>
                          <Badge color={getDifficultyColor(quiz.difficulty)}>
                            {quiz.difficulty}
                          </Badge>
                          <div>
                            <small className="text-muted">Level</small>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

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
                        color: '#157a6e',
                      }}
                    >
                      <i className="fa fa-play-circle me-2"></i>
                      Start Quiz
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Browse All Link */}
      <div className="text-center mt-5">
        <Link to="/all-quizzes" className="text-decoration-none">
          <Button
            color="success"
            outline
            size="lg"
            className="px-5 py-3 fw-bold"
            style={{
              borderColor: '#157a6e',
              color: '#157a6e',
            }}
          >
            <i className="fa fa-grid me-2"></i>
            Browse All Quizzes
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SimilarQuizzes;
