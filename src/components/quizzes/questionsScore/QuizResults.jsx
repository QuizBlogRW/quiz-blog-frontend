import { lazy, Suspense, useContext, useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import { Link, useLocation } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { saveFeedback } from '@/redux/slices/feedbacksSlice';
import { useSelector, useDispatch } from 'react-redux';
import { logRegContext } from '@/contexts/appContexts';

import ResponsiveAd from '@/components/adsenses/ResponsiveAd';
import isAdEnabled from '@/utils/isAdEnabled';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import MarksStatus from './MarksStatus';
import PdfDocument from '@/components/dashboard/pdfs/PdfDocument';
import ReviewForm from './ReviewForm';
import RelatedNotes from './RelatedNotes';
import SimilarQuizzes from './SimilarQuizzes';

const ResponsiveHorizontal = lazy(() =>
  import('@/components/adsenses/ResponsiveHorizontal')
);
const GridMultiplex = lazy(() => import('@/components/adsenses/GridMultiplex'));

const QuizResults = () => {

  const dispatch = useDispatch();
  const location = useLocation();

  const { score, qnsLength, thisQuiz, quizToReview, passMark, mongoScoreID, scoreToSaveID, } = location.state && location.state;

  console.log(location.state)

  const marks = isNaN(score) ? 0 : score;
  const { user } = useSelector((state) => state.auth);
  const { toggleL } = useContext(logRegContext);

  const scoreToSave = {
    id: scoreToSaveID,
    marks,
    out_of: qnsLength,
    category: thisQuiz && thisQuiz.category && thisQuiz.category._id,
    quiz: thisQuiz && thisQuiz._id,
    review: quizToReview && quizToReview,
    taken_by: user?._id,
  };

  // open review form modal after 3 seconds of quiz results page load
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const submitReview = (reviewData) => {
    dispatch(saveFeedback(reviewData));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setModalOpen(true); // Set Modal to open after 3 seconds
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="p-sm-5 score-section text-center" id="pdf-container">
        {isAdEnabled() && <Suspense fallback={<QBLoadingSM />}>
          <div className="w-100">
            <ResponsiveHorizontal />
          </div>
        </Suspense>}

        <div
          className={
            'p-2 p-sm-5 m-2 my-5 mx-sm-auto mx-sm-5 shadow p-3 bg-body rounded'
          }
          style={{ border: '3px solid var(--brand)' }}
        >
          <h5 className="fw-bolder">
            You answered <b style={{ color: '#B4654A' }}>{marks}</b> out of{' '}
            <b style={{ color: '#B4654A' }}>{qnsLength}</b> questions correctly.
            <small className="text-primary fw-bolder">
              &nbsp;(~{Math.round((marks * 100) / qnsLength)}%)
            </small>
          </h5>

          {/* Get ready */}
          <div className="my-sm-5 d-flex justify-content-around align-items-center">
            <a href={`/view-quiz/${thisQuiz.slug}`}>
              <button
                type="button"
                className="text-primary mt-3 mt-sm-0 me-2 me-md-0"
                style={{
                  backgroundColor: 'var(--accent)',
                  border: '2px solid var(--brand)',
                  borderRadius: '10px',
                  padding: '5px 12px',
                }}
              >
                Retake
              </button>
            </a>

            {user?.role ? (
              <>
                <Button
                  color="success"
                  className="mt-3 mt-sm-0 share-btn mx-1 mx-md-0"
                >
                  <i className="fa-brands fa-whatsapp"></i>&nbsp;
                  <a
                    className="text-white"
                    href={`https://api.whatsapp.com/send?phone=whatsappphonenumber&text=Attempt this ${thisQuiz && thisQuiz.title
                      } quiz on Quiz-Blog
                        \nhttps://www.quizblog.rw/view-quiz/${thisQuiz && thisQuiz.slug
                      }`}
                  >
                    Share
                  </a>
                </Button>
                {scoreToSaveID && (
                  <Link to={`/review-quiz/${scoreToSaveID}`} state={scoreToSave}>
                    <Button
                      outline
                      color="success"
                      className="mt-3 mt-sm-0 share-btn mx-1 mx-md-0"
                    >
                      Review Answers
                    </Button>
                  </Link>
                )}


                {user?.role?.includes('Admin') && (
                  <PDFDownloadLink
                    document={<PdfDocument review={quizToReview} />}
                    className="mt-sm-0 share-btn mx-1 mx-md-0"
                    fileName={`${thisQuiz && thisQuiz.title
                      }-shared-by-Quiz-Blog.pdf`}
                  >
                    {({ blob, url, loading, error }) =>
                      loading ? (
                        <small className="text-warning">
                          {console.log(url, blob)}
                          {loading ? 'Generating PDF...' : null}
                        </small>
                      ) : error ? (
                        <small className="text-danger">
                          {error ? error.message : null}
                        </small>
                      ) : (
                        <Button
                          color="success"
                          className="mt-sm-0 share-btn mx-1 mx-md-0"
                        >
                          Download PDF
                        </Button>
                      )
                    }
                  </PDFDownloadLink>
                )}

                <ReviewForm
                  isOpen={modalOpen}
                  toggle={toggleModal}
                  onSubmit={submitReview}
                  quiz={thisQuiz && thisQuiz._id}
                  score={mongoScoreID}
                  user={user ? user._id : null}
                />
              </>
            ) : (
              <button
                type="button"
                onClick={toggleL}
                className="text-primary mt-3 mt-sm-0 me-2 me-md-0"
                style={{
                  backgroundColor: 'var(--accent)',
                  border: '2px solid var(--brand)',
                  borderRadius: '10px',
                  padding: '5px 12px',
                  fontSize: '0.8rem',
                }}
              >
                Login to review answers
              </button>
            )}
          </div>

          <MarksStatus score={marks} qnLength={qnsLength} passMark={passMark} />
        </div>
      </div>

      <>
        <SimilarQuizzes thisQuiz={thisQuiz && thisQuiz} />

        {isAdEnabled() && <Suspense fallback={<QBLoadingSM />}>
          <div className="w-100">
            <ResponsiveAd />
          </div>
        </Suspense>}

        {thisQuiz && thisQuiz.category && thisQuiz.category.courseCategory && (
          <RelatedNotes ccatgID={thisQuiz.category.courseCategory} />
        )}

        {isAdEnabled() && <Suspense fallback={<QBLoadingSM />}>
          <GridMultiplex />
        </Suspense>}
      </>
    </>
  );
};

export default QuizResults;
