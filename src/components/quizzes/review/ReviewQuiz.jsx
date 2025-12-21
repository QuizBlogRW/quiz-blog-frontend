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

import NotAuthenticated from '@/components/users/NotAuthenticated';
import ResponsiveAd from '@/components/adsenses/ResponsiveAd';
import SquareAd from '@/components/adsenses/SquareAd';
import isAdEnabled from '@/utils/isAdEnabled';

// REUSABLE INLINE BLOCKS
const EmptyScoreBlock = ({ onSave }) => (
  <div className="d-flex justify-content-center align-items-center vh-100">
    <div className="text-center p-5 rounded-4 shadow-lg" style={{ maxWidth: 480, background: '#EAFAF1' }}>
      <h1 className="display-1 text-danger fw-bold mb-3">404</h1>
      <h4 className="mb-2">Your score is not saved! ❌</h4>
      <p className="text-muted mb-4">Click below to save your score 📝</p>

      <div className="d-flex justify-content-center gap-3 flex-wrap">
        <Button color="warning" className="px-4 fw-bold" onClick={onSave}>
          🪣 Save
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
    <Row className="mx-auto text-center rounded border border-primary my-5 py-4 w-80 shadow-sm" style={{ background: '#EAFAF1' }}>
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
              alt="Question"
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
  const { reviewId } = useParams();
  const location = useLocation();

  const { isLoading, oneScore } = useSelector((s) => s.scores);
  const { isAuthenticated, user } = useSelector(state => state.users);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [lastAnswer, setLastAnswer] = useState(false);

  // Score restoring logic simplified
  let storedScore = localStorage.getItem(reviewId);
  if (storedScore) storedScore = JSON.stringify({ ...JSON.parse(storedScore), taken_by: user?._id });
  const newScoreToSave = location.state || storedScore ? JSON.parse(storedScore) : null;

  const qnsAll = oneScore?.review?.questions || [];
  const curRevQn = qnsAll[currentQuestion];

  useEffect(() => {
    dispatch(getOneScore(reviewId));
  }, [dispatch, reviewId]);

  const handleSaveScore = () => {
    dispatch(createScore(newScoreToSave)).then((res) => {
      if (res?.type?.includes('fulfilled')) {
        setTimeout(() => window.location.reload(), 2000);
      } else {
        alert('Error saving score!');
      }
    });
  };

  // AUTH LOADING
  if (!isAuthenticated) return <NotAuthenticated />;
  if (isLoading) return <QBLoadingSM />;

  // EMPTY SCORE
  if (!oneScore) return <EmptyScoreBlock onSave={handleSaveScore} />;

  // NO QUESTIONS
  if (!qnsAll.length) return <NoQuestionsBlock />;

  // MAIN RENDER
  return (
    <div className="px-lg-5">

      {isAdEnabled() && (
        <Row className="w-100 mb-3">
          <Col sm="6"><ResponsiveAd /></Col>
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
          <Col sm="6"><SquareAd /></Col>
        </Row>
      )}
    </div>
  );
};

export default ReviewQuiz;
