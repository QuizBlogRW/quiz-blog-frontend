import React from 'react'
import { Col, Row, Button } from 'reactstrap'

import PdfDocument from '../../webmaster/pdfs/PdfDocument'
import ReactDOMServer from 'react-dom/server';
import html2pdf from 'html2pdf.js'

const TitleRow = ({ thisReview, score, thisQuiz, qnsAll, curRevQn, currentQuestion, uRole }) => {

    const thisQuizTitle = thisQuiz && thisQuiz.title

    const createPDF = () => {
        // Select the web page element to convert to PDF
        const element = <PdfDocument review={thisReview} />
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

    return (
        <Row>
            <Col>
                <div className="mb-sm-5 d-flex justify-content-around">
                    <Button outline color="success" size="sm">
                        <a href="/webmaster" className="text-dark">Dashboard</a>
                    </Button>

                    <span>
                        <h6 className="text-warning d-inline">Reviewing ...</h6>
                        <small className="text-info">
                            &nbsp; Score: ~{Math.round(score * 100 / qnsAll.length)}%
                        </small> 
                    </span>

                    {(uRole === 'Admin' || uRole === 'SuperAdmin') &&
                        <Button color="success"
                            className="mt-sm-0 share-btn mx-1 mx-md-0"
                            onClick={createPDF}>
                            Download PDF
                        </Button>}

                </div>

                <div className='question-section my-4 mt-sm-5 mx-auto w-75'>
                    <h4 className='question-count text-uppercase text-center text-secondary font-weight-bold'>
                        <span>Question <b style={{ color: "#B4654A" }}>{currentQuestion + 1}</b></span>/{qnsAll.length}
                    </h4>
                    <h5 className='q-txt my-4 font-weight-bold text-center'>{curRevQn && curRevQn.questionText}</h5>

                </div>
            </Col>
        </Row>
    )
}

export default TitleRow