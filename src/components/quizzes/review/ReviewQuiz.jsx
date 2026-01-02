import { useState, useEffect, useMemo, useCallback } from 'react';
import { Col, Row, Button } from 'reactstrap';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getOneScore, createScore } from '@/redux/slices/scoresSlice';
import { notify } from '@/utils/notifyToast';

import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import ReviewView from './ReviewView';
import QuestionComments from '@/components/quizzes/review/questionComments/QuestionComments';
import OnLastAnswer from './OnLastAnswer';
import TitleRow from './TitleRow';

import NotAuthenticated from '@/components/users/NotAuthenticated';
import ResponsiveAd from '@/components/adsenses/ResponsiveAd';
import SquareAd from '@/components/adsenses/SquareAd';
import isAdEnabled from '@/utils/isAdEnabled';

// REUSABLE INLINE BLOCKS
const EmptyScoreBlock = ({ onSave, isSaving }) => (
  <div className="d-flex justify-content-center align-items-center vh-100">
    <div
      className="text-center p-5 rounded-4 shadow-lg"
      style={{ maxWidth: 480, background: '#EAFAF1' }}
    >
      <h1 className="display-1 text-danger fw-bold mb-3">404</h1>
      <h4 className="mb-2">Your score is not saved! ❌</h4>
      <p className="text-muted mb-4">Click below to save your score 📝</p>

      <div className="d-flex justify-content-center gap-3 flex-wrap">
        <Button
          color="warning"
          className="px-4 fw-bold"
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? '⏳ Saving...' : '🪣 Save'}
        </Button>

        <Button color="success" className="px-4 fw-bold" href="/dashboard">
          ⬅️ Back
        </Button>
      </div>
    </div>
  </div>
);

const NoQuestionsBlock = () => (
  <div className="px-lg-5">
    <Row
      className="mx-auto text-center rounded border border-primary my-5 py-4 w-80 shadow-sm"
      style={{ background: '#EAFAF1' }}
    >
      <h1 className="text-danger fw-bolder mb-3">404</h1>
      <h4 className="mb-3">Quiz questions unavailable! Refresh 🔄</h4>
      <Button color="success" className="mx-auto mt-3" href="/dashboard">
        ⬅️ Back
      </Button>
    </Row>
  </div>
);

// QUESTION SECTION
const QuestionSection = ({
  oneScore,
  qnsAll,
  curRevQn,
  currentQuestion,
  setCurrentQuestion,
  lastAnswer,
  setLastAnswer,
  user,
}) => (
  <Row
    className="my-4 mx-auto px-lg-5 py-lg-5 shadow-sm"
    style={{ border: '3px solid #157A6E', borderRadius: 12, background: '#EAFAF1' }}
    key={curRevQn._id}
  >
    {lastAnswer ? (
      <OnLastAnswer isAuthenticated={true} thisQuiz={oneScore.quiz} />
    ) : (
      <div className="p-3">
        <TitleRow
          thisQuiz={oneScore.quiz}
          thisReview={oneScore.review}
          score={oneScore.marks}
          qnsAll={qnsAll}
          curRevQn={curRevQn}
          currentQuestion={currentQuestion}
          role={user.role}
        />

        {/* IMAGE */}
        {curRevQn.question_image && (
          <div className="my-3 d-flex justify-content-center">
            <img
              src={curRevQn.question_image}
              style={{ width: 260, borderRadius: 8 }}
              alt="Question illustration"
            />
          </div>
        )}

        <ReviewView
          qnsAll={qnsAll}
          curRevQn={curRevQn}
          currentQuestion={currentQuestion}
          lastAnswer={lastAnswer}
          setLastAnswer={setLastAnswer}
          setCurrentQuestion={setCurrentQuestion}
        />

        <QuestionComments
          questionID={curRevQn._id}
          quizID={oneScore.quiz._id}
          user={user}
        />
      </div>
    )}
  </Row>
);

// MAIN COMPONENT
const ReviewQuiz = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { reviewId } = useParams();
  const location = useLocation();

  const { isLoading, oneScore } = useSelector((state) => state.scores);
  const { isAuthenticated, user } = useSelector((state) => state.users);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [lastAnswer, setLastAnswer] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Memoize questions array
  const qnsAll = useMemo(
    () => oneScore?.review?.questions || [],
    [oneScore?.review?.questions]
  );

  const curRevQn = useMemo(
    () => qnsAll[currentQuestion],
    [qnsAll, currentQuestion]
  );

  // Parse stored score safely
  const newScoreToSave = useMemo(() => {
    // First check location.state
    if (location.state) {
      return location.state;
    }

    // Then check localStorage
    const storedScore = localStorage.getItem(reviewId);
    if (!storedScore) return null;

    try {
      const parsed = JSON.parse(storedScore);
      return {
        ...parsed,
        taken_by: user?._id,
      };
    } catch (error) {
      console.error('Failed to parse stored score:', error);
      localStorage.removeItem(reviewId);
      return null;
    }
  }, [location.state, reviewId, user?._id]);

  // Fetch score on mount
  useEffect(() => {
    if (reviewId) {
      dispatch(getOneScore(reviewId));
    }
  }, [dispatch, reviewId]);

  // Handle save score with improved error handling
  const handleSaveScore = useCallback(async () => {
    if (!newScoreToSave) {
      notify('No score data to save', 'error');
      return;
    }

    setIsSaving(true);

    try {
      const result = await dispatch(createScore(newScoreToSave)).unwrap();

      if (result) {
        notify('Score saved successfully!', 'success');
        localStorage.removeItem(reviewId);

        // Navigate to the saved score review page
        setTimeout(() => {
          navigate(`/review-quiz/${result._id}`, { replace: true });
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error('Error saving score:', error);
      notify(
        error?.message || 'Failed to save score. Please try again.',
        'error'
      );
    } finally {
      setIsSaving(false);
    }
  }, [dispatch, newScoreToSave, reviewId, navigate]);

  // Reset question index when score changes
  useEffect(() => {
    setCurrentQuestion(0);
    setLastAnswer(false);
  }, [oneScore?._id]);

  // Guard: Not authenticated
  if (!isAuthenticated) {
    return <NotAuthenticated />;
  }

  // Guard: Loading
  if (isLoading) {
    return <QBLoadingSM />;
  }

  // Guard: Empty score (show save option if we have data to save)
  if (!oneScore) {
    return (
      <EmptyScoreBlock
        onSave={handleSaveScore}
        isSaving={isSaving}
      />
    );
  }

  // Guard: No questions
  if (!qnsAll.length) {
    return <NoQuestionsBlock />;
  }

  // Guard: Invalid current question index
  if (!curRevQn) {
    return <QBLoadingSM />;
  }

  // MAIN RENDER
  return (
    <div className="px-lg-5">
      {isAdEnabled() && (
        <Row className="w-100 mb-3">
          <Col sm="6">
            <ResponsiveAd />
          </Col>
        </Row>
      )}

      <QuestionSection
        oneScore={oneScore}
        qnsAll={qnsAll}
        curRevQn={curRevQn}
        currentQuestion={currentQuestion}
        setCurrentQuestion={setCurrentQuestion}
        lastAnswer={lastAnswer}
        setLastAnswer={setLastAnswer}
        user={user}
      />

      {isAdEnabled() && (
        <Row className="mt-4">
          <Col sm="6">
            <SquareAd />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default ReviewQuiz;
