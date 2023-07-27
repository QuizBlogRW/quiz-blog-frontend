import React, { lazy, Suspense, useContext } from 'react'
import ReactDOMServer from 'react-dom/server';
import { Button, Spinner } from 'reactstrap'
import { Link, useLocation } from 'react-router-dom'
import html2pdf from 'html2pdf.js'

import MarksStatus from "./MarksStatus"
import LoginModal from '../../auth/LoginModal'
import PdfDocument from '../../webmaster/pdfs/PdfDocument'
import SimilarQuizes from './SimilarQuizes'
import RelatedNotes from './RelatedNotes'
import { currentUserContext, categoriesContext } from '../../../appContexts'

const ResponsiveHorizontal = lazy(() => import('../../adsenses/ResponsiveHorizontal'))
const ResponsiveAd = lazy(() => import('../../adsenses/ResponsiveAd'))
const GridMultiplex = lazy(() => import('../../adsenses/GridMultiplex'))


const QuizResults = () => {

    const location = useLocation();
    const { newScoreId, score, qnsLength, thisQuiz, quizToReview, passMark } = location.state && location.state

    // context
    const currentUser = useContext(currentUserContext)
    const categories = useContext(categoriesContext)

    const uRole = currentUser && currentUser.role
    const uId = currentUser && currentUser._id
    const thisQuizTitle = thisQuiz && thisQuiz.title

    const createPDF = () => {
        // Select the web page element to convert to PDF
        const element = <PdfDocument review={quizToReview && quizToReview} />
        const elementString = ReactDOMServer.renderToString(element);

        // Set the PDF options
        const options = {
            margin: [0.1, 0.1, 0.1, 0.1],
            filename: `${thisQuizTitle}-shared-by-QuizBlog.pdf`,
            image: { type: 'jpeg', quality: 0.98, background: '#fff', border: '1px solid #fff' },
            html2canvas: { scale: 2, useCORS: true, logging: true, letterRendering: true, allowTaint: true, scrollX: 0, scrollY: -window.scrollY },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait', compressPDF: true, precision: 16 }
        }

        // Generate the PDF file
        html2pdf().set(options).from(elementString).save()
    }

    const scoreToSave = {
        id: newScoreId,
        marks: score,
        out_of: qnsLength,
        category: thisQuiz && thisQuiz.category && thisQuiz.category._id,
        quiz: thisQuiz && thisQuiz._id,
        review: quizToReview && quizToReview,
        taken_by: uId
    }

    return (
        <>
            <div className='p-sm-5 score-section text-center' id='pdf-container'>

                <Suspense fallback={<div className="p-1 m-1 d-flex justify-content-center align-items-center w-100">
                    <Spinner color="primary" />
                </div>}>
                    <div className='w-100'>
                        {/* Google responsive 1 ad */}
                        <ResponsiveHorizontal />
                    </div>
                </Suspense>

                <h5>You got <b style={{ color: "#B4654A" }}>{score}</b> questions right from <b style={{ color: "#B4654A" }}>{qnsLength}</b>.

                    <small className="text-info">
                        (~{Math.round(score * 100 / qnsLength)}%)
                    </small>
                </h5>

                {/* Get ready */}
                <div className="my-sm-5 d-flex justify-content-around align-items-center">
                    <a href={`/view-quiz/${thisQuiz.slug}`}>
                        <button type="button" className="btn btn-outline-success mt-3 mt-sm-0 mr-2 mr-md-0">
                            Retake
                        </button>
                    </a>

                    {uRole ?
                        <>
                            <Button color="success" className="mt-3 mt-sm-0 share-btn mx-1 mx-md-0">
                                <i className="fa fa-whatsapp"></i>&nbsp;
                                <a className="text-white" href={`https://api.whatsapp.com/send?phone=whatsappphonenumber&text=Attempt this ${thisQuiz && thisQuiz.title} quiz on Quiz Blog
                        \nhttps://www.quizblog.rw/view-quiz/${thisQuiz && thisQuiz.slug}`}>Share</a>
                            </Button>

                            <Link to={`/review-quiz/${newScoreId && newScoreId}`} state={scoreToSave}>
                                <Button outline color="success" className="mt-3 mt-sm-0 share-btn mx-1 mx-md-0">
                                    Review Answers
                                </Button>
                            </Link>

                            {(uRole === 'Admin' || uRole === 'SuperAdmin') &&
                                <Button color="success"
                                    className="mt-3 mt-sm-0 share-btn mx-1 mx-md-0"
                                    onClick={createPDF}>
                                    Download PDF
                                </Button>}
                        </> :

                        <button type="button" className="btn btn-outline-warning mt-3 mt-sm-0 p-0">
                            <LoginModal
                                textContent={'Login to review answers'}
                                textColor={'text-info'} />
                        </button>}
                </div>

                <MarksStatus
                    score={score}
                    qnLength={qnsLength}
                    passMark={passMark} />
            </div>

            <>
                <SimilarQuizes
                    thisQId={thisQuiz && thisQuiz._id}
                    categories={categories.allcategories}
                    categoryId={thisQuiz.category && thisQuiz.category._id} />

                <Suspense fallback={<div className="p-1 m-1 d-flex justify-content-center align-items-center w-100">
                    <Spinner color="primary" />
                </div>}>
                    <div className='w-100'>
                        <ResponsiveAd />
                    </div>
                </Suspense>

                {thisQuiz && thisQuiz.category && thisQuiz.category.courseCategory &&
                    <RelatedNotes
                        ccatgID={thisQuiz.category.courseCategory} />
                }

                <Suspense fallback={<div className="p-1 m-1 d-flex justify-content-center align-items-center">
                    <Spinner color="primary" />
                </div>}>
                    <GridMultiplex />
                </Suspense>
            </>
        </>
    )
}
export default QuizResults