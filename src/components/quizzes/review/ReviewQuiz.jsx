import { useState, useEffect } from 'react';
import { Col, Row, Button } from 'reactstrap';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOneScore, createScore } from '@/redux/slices/scoresSlice';

import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import ReviewView from './ReviewView';
import QuestionComments from '@/components/quizzes/review/questionComments/QuestionComments';
import OnLastAnswer from './OnLastAnswer';
import TitleRow from './TitleRow';

import NotAuthenticated from '@/components/auth/NotAuthenticated';
import ResponsiveAd from '@/components/adsenses/ResponsiveAd';
import SquareAd from '@/components/adsenses/SquareAd';

const ReviewQuiz = () => {
  const dispatch = useDispatch();
  const { isLoading, oneScore } = useSelector((state) => state.scores);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [lastAnswer, setLastAnswer] = useState(false);

  const { reviewId } = useParams();
  const location = useLocation();
  const newScoreToSave = location.state;

  const qnsAll = oneScore?.review?.questions || [];
  const curRevQn = qnsAll[currentQuestion];

  useEffect(() => {
    dispatch(getOneScore(reviewId));
  }, [dispatch, reviewId]);

  const handleSaveScore = async () => {
    const scoreCreation = await dispatch(createScore(newScoreToSave));
    if (scoreCreation) setTimeout(() => window.location.reload(), 2000);
    else alert('Error saving score!');
  };

  if (!isAuthenticated) return <NotAuthenticated />;
  if (isLoading) return <QBLoadingSM />;

  // No score saved
  if (!oneScore) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div
          className="text-center p-5 rounded-4 shadow-lg"
          style={{ maxWidth: '480px', width: '100%', backgroundColor: '#EAFAF1' }}
        >
          <h1 className="display-1 text-danger fw-bold mb-3">404</h1>
          <h4 className="mb-3 text-dark">Your score is not saved! ❌</h4>
          <p className="text-muted mb-4">Click below to save your score 📝</p>

          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Button
              color="warning"
              className="px-4 py-2 fw-bold shadow-sm"
              onClick={handleSaveScore}
              style={{ borderRadius: '12px', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              🪣 Save
            </Button>

            <Button
              color="success"
              className="px-4 py-2 fw-bold shadow-sm"
              style={{ borderRadius: '12px', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <a href="/dashboard" className="text-white text-decoration-none">
                ⬅️ Back
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // No questions available
  if (!qnsAll.length) {
    return (
      <div className="px-lg-5">
        <Row className="mx-auto d-flex flex-column justify-content-center rounded border border-primary my-5 py-4 w-80 text-center shadow-sm" style={{ backgroundColor: '#EAFAF1' }}>
          <h1 className="text-danger fw-bolder mb-3">404</h1>
          <h4 className="mb-3">Quiz's questions unavailable! Refresh! 🔄</h4>
          <Button color="success" style={{ width: '120px' }} className="mx-auto mt-3">
            <a href="/dashboard" className="text-white text-decoration-none">
              ⬅️ Back
            </a>
          </Button>
        </Row>
      </div>
    );
  }

  // Question section
  const QuestionSection = () => (
    <Row
      className="my-4 mx-auto px-lg-5 d-flex flex-column justify-content-center py-lg-5 w-80 shadow-sm"
      key={curRevQn._id}
      style={{
        border: '3px solid #157A6E',
        borderRadius: '12px',
        backgroundColor: '#EAFAF1',
      }}
    >
      {lastAnswer ? (
        <OnLastAnswer isAuthenticated={isAuthenticated} thisQuiz={oneScore.quiz} />
      ) : (
        <div className="question-view p-3">
          <TitleRow
            thisQuiz={oneScore.quiz}
            thisReview={oneScore.review}
            score={oneScore.marks}
            qnsAll={qnsAll}
            curRevQn={curRevQn}
            currentQuestion={currentQuestion}
            role={user.role}
          />

          {/* Question Image */}
          {curRevQn?.question_image && (
            <Row>
              <Col>
                <div className="my-3 d-flex justify-content-center align-items-center">
                  <img
                    src={curRevQn.question_image}
                    style={{ width: '260px', height: 'auto', borderRadius: '8px', }}
                    alt="Question Illustration"
                  />
                </div>
              </Col>
            </Row>
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

  return (
    <div className="px-lg-5">
      <Row className="w-100 mb-3">
        <Col sm="6" className="w-100">
          <ResponsiveAd />
        </Col>
      </Row>

      <QuestionSection />

      <Row className="mt-4">
        <Col sm="6">
          <SquareAd />
        </Col>
      </Row>
    </div>
  );
};

export default ReviewQuiz;
