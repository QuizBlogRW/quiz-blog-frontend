import {
  lazy,
  Suspense,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { Button } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useSelector } from "react-redux";
import { logRegContext } from "@/contexts/appContexts";

import ResponsiveAd from "@/components/adsenses/ResponsiveAd";
import QBLoadingSM from "@/utils/rLoading/QBLoadingSM";
import isAdEnabled from "@/utils/isAdEnabled";

import MarksStatus from "./MarksStatus";
import PdfDocument from "@/components/dashboard/pdfs/PdfDocument";
import RatingQuiz from "./RatingQuiz";
import RelatedNotes from "./RelatedNotes";
import SimilarQuizzes from "./SimilarQuizzes";

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

const WhatsAppShareBtn = ({ quiz }) => (
  <Button color="success" className="mt-3 share-btn">
    <i className="fa-brands fa-whatsapp"></i>&nbsp;
    <a
      className="text-white"
      href={`https://api.whatsapp.com/send?text=Attempt this ${quiz?.title} quiz:%0Ahttps://www.quizblog.rw/view-quiz/${quiz?.slug}`}
    >
      Share
    </a>
  </Button>
);

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

  // Save score for guests
  useEffect(() => {
    if (!isAuthenticated && scoreToSaveID) {
      localStorage.setItem(scoreToSaveID, JSON.stringify(scoreToSave));
    }
  }, [isAuthenticated, scoreToSaveID, scoreToSave]);

  // Auto-open rating
  const [modalOpen, setModalOpen] = useState(false);

  // Check if feedback already submitted (use same key format as RatingQuiz)
  const feedbackKey = `quiz-feedback-${thisQuiz?._id}-${user?._id}`;

  useEffect(() => {
    if (!isAuthenticated || !thisQuiz?._id || !user?._id) return;

    // Check if feedback already exists and is still valid
    const storedFeedback = localStorage.getItem(feedbackKey);

    if (storedFeedback) {
      try {
        const data = JSON.parse(storedFeedback);
        const ONE_HOUR = 60 * 60 * 1000;

        // If feedback was submitted less than 1 hour ago, don't show modal
        if (Date.now() - data.timestamp <= ONE_HOUR) {
          return;
        } else {
          // Expired feedback, remove it
          localStorage.removeItem(feedbackKey);
        }
      } catch {
        localStorage.removeItem(feedbackKey);
      }
    }
    // Open modal after 3 seconds if no recent feedback
    const timer = setTimeout(() => setModalOpen(true), 3000);
    return () => clearTimeout(timer);
  }, [isAuthenticated, thisQuiz?._id, user?._id, feedbackKey]);

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
              <Button outline color="success" className="btn-retake mt-3 mt-sm-0 text-warning">Retake</Button>
            </Link>

            {user?.role ? (
              <>
                <WhatsAppShareBtn quiz={thisQuiz} />

                {scoreToSaveID && (
                  <Link to={`/review-quiz/${scoreToSaveID}`} state={scoreToSave}>
                    <Button outline color="warning" className="mt-3 share-btn text-success">
                      Review Answers
                    </Button>
                  </Link>
                )}

                {user?.role?.includes("Admin") && (
                  <PdfDownloadBtn quiz={thisQuiz} review={quizToReview} />
                )}

                <RatingQuiz
                  isOpen={modalOpen}
                  toggle={() => setModalOpen((s) => !s)}
                  quiz={thisQuiz?._id}
                  score={mongoScoreID}
                  user={user?._id}
                />
              </>
            ) : (
              <Button color="warning" onClick={toggleL} className="btn-retake mt-3 text-success">
                Login to review answers
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
