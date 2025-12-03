import { Col, Row, Button } from 'reactstrap';
import PdfDocument from '@/components/dashboard/pdfs/PdfDocument';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useSelector } from 'react-redux';

const TitleRow = ({ thisReview, score, qnsAll, curRevQn, currentQuestion }) => {
    const { user } = useSelector(state => state.users);

    const scorePercent = Math.round((score * 100) / qnsAll.length);

    return (
        <Row className="justify-content-center">
            <Col lg={10} className="text-center">

                {/* Top action row */}
                <div className="d-flex flex-wrap gap-3 justify-content-center align-items-center mb-4 mb-sm-5">

                    {/* Dashboard Button */}
                    <Button
                        outline
                        color="success"
                        size="sm"
                        tag="a"
                        href="/dashboard"
                        className="fw-bold px-3"
                    >
                        Dashboard
                    </Button>

                    {/* Title + Score */}
                    <div className="text-center">
                        <p className="text-primary fw-bold d-inline mb-0">
                            Reviewing...
                        </p>
                        <small
                            className="fw-bolder ms-2"
                            style={{ color: 'var(--accent)' }}
                        >
                            Score: ~{scorePercent}%
                        </small>
                    </div>

                    {/* PDF Download */}
                    {user?.role?.includes('Admin') && (
                        <PDFDownloadLink
                            document={<PdfDocument review={thisReview} />}
                            fileName={`${thisReview?.title}-shared-by-Quiz-Blog.pdf`}
                            className="text-decoration-none"
                        >
                            {({ loading }) =>
                                loading ? (
                                    <small className="text-warning">Loading document...</small>
                                ) : (
                                    <Button
                                        color="success"
                                        size="sm"
                                        className="fw-bold px-3"
                                    >
                                        Download PDF
                                    </Button>
                                )
                            }
                        </PDFDownloadLink>
                    )}
                </div>

                {/* Question section */}
                <div className="question-section mx-auto my-4 p-3 p-sm-4 rounded border shadow-sm"
                    style={{ maxWidth: "700px" }}
                >
                    <h4 className="question-count text-uppercase fw-bolder text-secondary mb-3">
                        Question{" "}
                        <span style={{ color: "var(--brand)" }}>
                            {currentQuestion + 1}
                        </span>{" "}
                        / {qnsAll.length}
                    </h4>

                    <h5 className="q-txt fw-bolder text-dark text-center my-3">
                        {curRevQn?.questionText}
                    </h5>
                </div>

            </Col>
        </Row>
    );
};

export default TitleRow;
