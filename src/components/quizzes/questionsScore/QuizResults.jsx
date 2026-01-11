import {
  lazy,
  Suspense,
  useContext,
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { Button } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useSelector, useDispatch } from "react-redux";

import { logRegContext } from "@/contexts/appContexts";
import { createScore } from '@/redux/slices/scoresSlice';

import ResponsiveAd from "@/components/adsenses/ResponsiveAd";
import QBLoadingSM from "@/utils/rLoading/QBLoadingSM";
import isAdEnabled from "@/utils/isAdEnabled";

import MarksStatus from "./MarksStatus";
import PdfDocument from "@/components/dashboard/pdfs/PdfDocument";
import RatingQuiz from "./RatingQuiz";
import RelatedNotes from "./RelatedNotes";
import SimilarQuizzes from "./SimilarQuizzes";
import { notify } from '@/utils/notifyToast';

const ResponsiveHorizontal = lazy(() =>
  import("@/components/adsenses/ResponsiveHorizontal")
);
const GridMultiplex = lazy(() =>
  import("@/components/adsenses/GridMultiplex")
);

// Constants
const ONE_HOUR_MS = 60 * 60 * 1000;
const RATING_MODAL_DELAY = 3000;

// REUSABLE COMPONENTS
const LazyAd = ({ children }) =>
  isAdEnabled() ? (
    <Suspense fallback={<QBLoadingSM />}>{children}</Suspense>
  ) : null;

const ResultHeader = ({ marks, qnsLength, percentage }) => (
  <div className="mb-4">
    <h5 className="fw-bolder fs-6 fs-sm-5 px-2">
      You answered <b className="text-brand">{marks}</b> out of{" "}
      <b className="text-brand">{qnsLength}</b>
      <span className="d-none d-sm-inline"> questions</span> correctly.
      <small className="text-primary fw-bolder d-block d-sm-inline">
        &nbsp;(~{percentage}%)
      </small>
    </h5>
  </div>
);

const RetakeButton = ({ quizSlug }) => (
  <Link to={`/view-quiz/${quizSlug}`} className="text-decoration-none">
    <Button
      outline
      color="success"
      className="px-3 px-sm-4 py-2 fw-semibold shadow-sm d-flex align-items-center justify-content-center"
      style={{
        minWidth: '120px',
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <i className="fa fa-redo me-2"></i>
      <span className="d-none d-sm-inline">Retake Quiz</span>
      <span className="d-inline d-sm-none">Retake</span>
    </Button>
  </Link>
);

const WhatsAppShareButton = ({ quiz }) => {
  const currentDomain = window.location.origin;
  const shareText = `Attempt this "${quiz.title}" quiz on Quiz-Blog\n${currentDomain}/view-quiz/${quiz.slug}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  return (
    <Button
      className="px-3 px-sm-4 py-2 fw-semibold shadow-sm d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: '#25D366',
        border: 'none',
        color: 'white',
        minWidth: '120px',
        transition: 'all 0.2s ease-in-out',
      }}
      tag="a"
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
    >
      <i className="fa-brands fa-whatsapp me-2"></i>
      <span className="d-none d-sm-inline">Share Quiz</span>
      <span className="d-inline d-sm-none">Share</span>
    </Button>
  );
};

const ReviewAnswersButton = ({ scoreToSaveID, scoreToSave }) => (
  <Link
    to={`/review-quiz/${scoreToSaveID}`}
    state={scoreToSave}
    className="text-decoration-none"
  >
    <Button
      outline
      color="warning"
      className="px-3 px-sm-4 py-2 fw-semibold shadow-sm d-flex align-items-center justify-content-center"
      style={{
        minWidth: '120px',
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <i className="fa fa-eye me-2"></i>
      <span className="d-none d-sm-inline">Review Answers</span>
      <span className="d-inline d-sm-none">Review</span>
    </Button>
  </Link>
);

const PdfDownloadButton = ({ quiz, review }) => (
  <PDFDownloadLink
    document={<PdfDocument review={review} />}
    fileName={`${quiz?.title}-shared-by-Quiz-Blog.pdf`}
  >
    {({ loading, error }) => {
      if (loading) {
        return (
          <Button
            color="secondary"
            className="px-3 px-sm-4 py-2 fw-semibold shadow-sm d-flex align-items-center justify-content-center"
            style={{ minWidth: '120px' }}
            disabled
          >
            <i className="fa fa-spinner fa-spin me-2"></i>
            <span className="d-none d-sm-inline">Generating...</span>
            <span className="d-inline d-sm-none">...</span>
          </Button>
        );
      }

      if (error) {
        return (
          <Button
            color="danger"
            className="px-3 px-sm-4 py-2 fw-semibold shadow-sm d-flex align-items-center justify-content-center"
            style={{ minWidth: '120px' }}
            disabled
          >
            <i className="fa fa-exclamation-triangle me-2"></i>
            <span className="d-none d-sm-inline">Error</span>
            <span className="d-inline d-sm-none">!</span>
          </Button>
        );
      }

      return (
        <Button
          color="success"
          className="px-3 px-sm-4 py-2 fw-semibold shadow-sm d-flex align-items-center justify-content-center"
          style={{
            minWidth: '120px',
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <i className="fa fa-download me-2"></i>
          <span className="d-none d-sm-inline">Download PDF</span>
          <span className="d-inline d-sm-none">PDF</span>
        </Button>
      );
    }}
  </PDFDownloadLink>
);

const LoginPromptButton = ({ toggleL }) => (
  <Button
    color="warning"
    onClick={toggleL}
    className="px-3 px-sm-4 py-2 fw-semibold shadow-sm d-flex align-items-center justify-content-center"
    style={{
      minWidth: '120px',
      transition: 'all 0.2s ease-in-out',
    }}
  >
    <i className="fa fa-sign-in-alt me-2"></i>
    <span className="d-none d-sm-inline">Login to Review</span>
    <span className="d-inline d-sm-none">Login</span>
  </Button>
);

// Action Buttons Section Component
const ActionButtons = ({
  quiz,
  user,
  scoreToSaveID,
  scoreToSave,
  quizToReview,
  toggleL
}) => {
  const isAuthenticated = !!user?.role;
  const isAdmin = user?.role?.includes("Admin");

  return (
    <div className="my-4 my-sm-5">
      <div className="d-flex flex-column flex-sm-row justify-content-center align-items-stretch align-items-sm-center gap-2 gap-sm-3 flex-wrap px-2 px-sm-0">
        {/* Retake Button - Always visible */}
        <RetakeButton quizSlug={quiz?.slug} />

        {isAuthenticated ? (
          <>
            {/* WhatsApp Share */}
            <WhatsAppShareButton quiz={quiz} />

            {/* Review Answers */}
            {scoreToSaveID && (
              <ReviewAnswersButton
                scoreToSaveID={scoreToSaveID}
                scoreToSave={scoreToSave}
              />
            )}

            {/* PDF Download - Admin only */}
            {isAdmin && (
              <PdfDownloadButton quiz={quiz} review={quizToReview} />
            )}
          </>
        ) : (
          /* Login Prompt for guests */
          <LoginPromptButton toggleL={toggleL} />
        )}
      </div>

      {/* Helper text for mobile */}
      {!isAuthenticated && (
        <div className="text-center mt-3 d-sm-none">
          <small className="text-muted">
            Login to review answers and share your results
          </small>
        </div>
      )}
    </div>
  );
};

// MAIN COMPONENT
const QuizResults = () => {
  const dispatch = useDispatch();
  const autoSavedRef = useRef(false);
  const location = useLocation();
  const { toggleL } = useContext(logRegContext);
  const { user, isAuthenticated } = useSelector((state) => state.users);

  // Extract safe values from location.state
  const {
    score = 0,
    qnsLength = 0,
    thisQuiz = null,
    quizToReview,
    passMark = 0,
    mongoScoreID,
    scoreToSaveID,
  } = location.state ?? {};

  const marks = isNaN(score) ? 0 : score;

  // Derived values
  const percentage = useMemo(
    () => (qnsLength ? Math.round((marks * 100) / qnsLength) : 0),
    [marks, qnsLength]
  );

  const scoreToSave = useMemo(
    () => ({
      id: scoreToSaveID,
      marks,
      out_of: qnsLength,
      category: thisQuiz?.category?._id,
      quiz: thisQuiz?._id,
      review: quizToReview,
      taken_by: user?._id,
    }),
    [scoreToSaveID, marks, qnsLength, thisQuiz, quizToReview, user]
  );

  // Save score for guests in localStorage
  useEffect(() => {
    if (!isAuthenticated && scoreToSaveID) {
      localStorage.setItem(scoreToSaveID, JSON.stringify(scoreToSave));
    }
  }, [isAuthenticated, scoreToSaveID, scoreToSave]);

  // Auto-save score when user logs in
  useEffect(() => {
    if (!isAuthenticated || !user?._id || !scoreToSaveID || autoSavedRef.current) {
      return;
    }

    const storedScore = localStorage.getItem(scoreToSaveID);
    if (!storedScore) return;

    let parsedScore;
    try {
      parsedScore = JSON.parse(storedScore);
    } catch (error) {
      console.error('Failed to parse stored score:', error);
      localStorage.removeItem(scoreToSaveID);
      return;
    }

    const payload = {
      ...parsedScore,
      taken_by: user._id,
    };

    autoSavedRef.current = true;

    dispatch(createScore(payload))
      .then((res) => {
        if (res?.type?.includes("fulfilled")) {
          localStorage.removeItem(scoreToSaveID);
          notify("Quiz results saved successfully!", "success");
        } else {
          autoSavedRef.current = false;
          notify("Failed to save results. Please try again.", "error");
        }
      })
      .catch((error) => {
        console.error('Error saving score:', error);
        autoSavedRef.current = false;
        notify("An error occurred while saving results.", "error");
      });
  }, [isAuthenticated, user?._id, scoreToSaveID, dispatch]);

  // Rating modal state
  const [modalOpen, setModalOpen] = useState(false);

  const feedbackKey = useMemo(
    () => `quiz-feedback-${thisQuiz?._id}-${user?._id}`,
    [thisQuiz?._id, user?._id]
  );

  // Handle rating modal timing
  useEffect(() => {
    if (!isAuthenticated || !thisQuiz?._id || !user?._id) return;

    const storedFeedback = localStorage.getItem(feedbackKey);

    if (storedFeedback) {
      try {
        const data = JSON.parse(storedFeedback);

        if (Date.now() - data.timestamp <= ONE_HOUR_MS) {
          return;
        }

        localStorage.removeItem(feedbackKey);
      } catch (error) {
        console.error('Failed to parse feedback data:', error);
        localStorage.removeItem(feedbackKey);
      }
    }

    const timer = setTimeout(() => setModalOpen(true), RATING_MODAL_DELAY);
    return () => clearTimeout(timer);
  }, [isAuthenticated, thisQuiz?._id, user?._id, feedbackKey]);

  // RENDER
  return (
    <>
      <div className="p-2 p-sm-5 text-center score-section" id="pdf-container">
        <LazyAd>
          <ResponsiveHorizontal />
        </LazyAd>

        <div className="p-3 p-sm-5 m-2 my-4 my-sm-5 mx-auto shadow bg-body rounded border-brand" style={{ maxWidth: '900px' }}>
          <ResultHeader marks={marks} qnsLength={qnsLength} percentage={percentage} />

          {/* ACTION BUTTONS */}
          <ActionButtons
            quiz={thisQuiz}
            user={user}
            scoreToSaveID={scoreToSaveID}
            scoreToSave={scoreToSave}
            quizToReview={quizToReview}
            toggleL={toggleL}
          />

          <MarksStatus score={marks} qnLength={qnsLength} passMark={passMark} />
        </div>
      </div>

      {/* Rating Modal */}
      {isAuthenticated && (
        <RatingQuiz
          isOpen={modalOpen}
          toggle={() => setModalOpen((prev) => !prev)}
          quiz={thisQuiz?._id}
          score={mongoScoreID}
          user={user?._id}
        />
      )}

      {/* BELOW RESULTS */}
      <SimilarQuizzes thisQuiz={thisQuiz} />

      <LazyAd>
        <ResponsiveAd />
      </LazyAd>

      {thisQuiz?.category?.courseCategory && (
        <RelatedNotes ccatgID={thisQuiz.category.courseCategory} />
      )}

      <LazyAd>
        <GridMultiplex />
      </LazyAd>
    </>
  );
};

export default QuizResults;