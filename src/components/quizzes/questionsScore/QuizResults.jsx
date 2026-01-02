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

// REUSABLE INLINE BLOCKS
const LazyAd = ({ children }) =>
  isAdEnabled() ? (
    <Suspense fallback={<QBLoadingSM />}>{children}</Suspense>
  ) : null;

const ResultHeader = ({ marks, qnsLength, percentage }) => (
  <h5 className="fw-bolder">
    You answered <b className="text-brand">{marks}</b> out of{" "}
    <b className="text-brand">{qnsLength}</b> questions correctly.
    <small className="text-primary fw-bolder">&nbsp;(~{percentage}%)</small>
  </h5>
);

const WhatsAppShareBtn = ({ quiz }) => {
  const currentDomain = window.location.origin;
  const shareText = `Attempt this "${quiz.title}" quiz on Quiz-Blog\n${currentDomain}/view-quiz/${quiz.slug}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  return (
    <Button
      className="btn-accent px-4 py-2 fw-semibold shadow-sm d-flex align-items-center"
      tag="a"
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
    >
      <i className="fa-brands fa-whatsapp me-2"></i>
      Share
    </Button>
  );
};

const PdfDownloadBtn = ({ quiz, review }) => (
  <PDFDownloadLink
    document={<PdfDocument review={review} />}
    fileName={`${quiz?.title}-shared-by-Quiz-Blog.pdf`}
    className="mt-3"
  >
    {({ loading, error }) =>
      loading ? (
        <small className="text-warning">Generating PDF...</small>
      ) : error ? (
        <small className="text-danger">{error.message}</small>
      ) : (
        <Button color="success" className="share-btn">
          Download PDF
        </Button>
      )
    }
  </PDFDownloadLink>
);

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
    // Guard clauses
    if (!isAuthenticated || !user?._id || !scoreToSaveID || autoSavedRef.current) {
      return;
    }

    // Check if score exists in localStorage
    const storedScore = localStorage.getItem(scoreToSaveID);
    if (!storedScore) return;

    // Parse stored score safely
    let parsedScore;
    try {
      parsedScore = JSON.parse(storedScore);
    } catch (error) {
      console.error('Failed to parse stored score:', error);
      localStorage.removeItem(scoreToSaveID);
      return;
    }

    // Prepare payload with authenticated user ID
    const payload = {
      ...parsedScore,
      taken_by: user._id,
    };

    // Mark as attempted to prevent duplicate saves
    autoSavedRef.current = true;

    // Dispatch save action
    dispatch(createScore(payload))
      .then((res) => {
        if (res?.type?.includes("fulfilled")) {
          localStorage.removeItem(scoreToSaveID);
          notify("Quiz results saved successfully!", "success");
        } else {
          // Reset flag to allow retry on failure
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

  // Auto-open rating modal
  const [modalOpen, setModalOpen] = useState(false);

  // Memoize feedback key
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
        const ONE_HOUR = 60 * 60 * 1000;

        // Don't show modal if feedback submitted recently
        if (Date.now() - data.timestamp <= ONE_HOUR) {
          return;
        }

        // Remove expired feedback
        localStorage.removeItem(feedbackKey);
      } catch (error) {
        console.error('Failed to parse feedback data:', error);
        localStorage.removeItem(feedbackKey);
      }
    }

    // Open modal after 3 seconds
    const timer = setTimeout(() => setModalOpen(true), 3000);
    return () => clearTimeout(timer);
  }, [isAuthenticated, thisQuiz?._id, user?._id, feedbackKey]);

  // Memoize button text based on auth state
  const reviewButtonText = useMemo(() => {
    if (user?.role) {
      return "Review Answers";
    }
    return "Login to Review Answers";
  }, [user?.role]);

  // RENDER
  return (
    <>
      <div className="p-sm-5 text-center score-section" id="pdf-container">
        <LazyAd>
          <ResponsiveHorizontal />
        </LazyAd>

        <div className="p-2 p-sm-5 m-2 my-5 mx-sm-auto shadow bg-body rounded border-brand">
          <ResultHeader marks={marks} qnsLength={qnsLength} percentage={percentage} />

          {/* ACTION BUTTONS */}
          <div className="my-sm-5 d-flex justify-content-around align-items-center flex-wrap">
            <Link to={`/view-quiz/${thisQuiz?.slug}`}>
              <Button
                outline
                color="success"
                className="btn-retake mt-3 mt-sm-0 text-warning"
              >
                Retake
              </Button>
            </Link>

            {user?.role ? (
              <>
                <WhatsAppShareBtn quiz={thisQuiz} />

                {scoreToSaveID && (
                  <Link to={`/review-quiz/${scoreToSaveID}`} state={scoreToSave}>
                    <Button
                      outline
                      color="warning"
                      className="mt-3 share-btn text-success"
                    >
                      {reviewButtonText}
                    </Button>
                  </Link>
                )}

                {user?.role?.includes("Admin") && (
                  <PdfDownloadBtn quiz={thisQuiz} review={quizToReview} />
                )}

                <RatingQuiz
                  isOpen={modalOpen}
                  toggle={() => setModalOpen((prev) => !prev)}
                  quiz={thisQuiz?._id}
                  score={mongoScoreID}
                  user={user?._id}
                />
              </>
            ) : (
              <Button
                color="warning"
                onClick={toggleL}
                className="btn-retake mt-3 text-success"
              >
                Login to Review Answers
              </Button>
            )}
          </div>

          <MarksStatus score={marks} qnLength={qnsLength} passMark={passMark} />
        </div>
      </div>

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
