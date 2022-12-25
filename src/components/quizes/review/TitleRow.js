import React from 'react'
// import { PDFDownloadLink } from "@react-pdf/renderer"
// import PdfDocument from "../../webmaster/PdfDocument"
import { Col, Row, Button } from 'reactstrap'

const TitleRow = ({ thisReview, score, qnsAll, curRevQn, currentQuestion, uRole }) => {
    return (
        <Row>
            <Col>
                <div className="mb-sm-5 d-flex justify-content-around">
                    <Button outline color="success" size="sm">
                        <a href="/webmaster" className="text-dark">Your past scores</a>
                    </Button>

                    <span>
                        <h6 className="text-warning d-inline">Reviewing ...</h6>
                        <small className="text-info">
                            &nbsp; Score: ~{Math.round(score * 100 / qnsAll.length)}%
                        </small>
                    </span>

                    {/* {(uRole === 'Admin' || uRole === 'SuperAdmin') ?
                        <PDFDownloadLink
                            document={<PdfDocument review={thisReview} />}
                            fileName={`${thisReview.title.split(' ').join('-')}.pdf`}
                            style={{
                                textDecoration: "none",
                                padding: "3px 5px",
                                color: "white",
                                backgroundColor: "#157a6e",
                                border: "1px solid #ffc107",
                                borderRadius: "4px",
                                display: "block",
                                width: "fit-content"
                            }}
                        >
                            {({ blob, url, loading, error }) =>
                                loading ? 'Preparing document...' : 'Download pdf'
                            }
                        </PDFDownloadLink> : null} */}

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