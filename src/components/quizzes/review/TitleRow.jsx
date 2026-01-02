import { useMemo } from 'react';
import { Col, Row, Button, Badge } from 'reactstrap';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useSelector } from 'react-redux';
import PdfDocument from '@/components/dashboard/pdfs/PdfDocument';

const TitleRow = ({ thisReview, score, qnsAll, curRevQn, currentQuestion }) => {
    const { user } = useSelector((state) => state.users);

    // Memoize calculations
    const scorePercent = useMemo(
        () => Math.round((score * 100) / qnsAll.length),
        [score, qnsAll.length]
    );

    const progressPercent = useMemo(
        () => Math.round(((currentQuestion + 1) * 100) / qnsAll.length),
        [currentQuestion, qnsAll.length]
    );

    const questionNumber = useMemo(
        () => currentQuestion + 1,
        [currentQuestion]
    );

    // Determine score badge color
    const getScoreColor = useMemo(() => {
        if (scorePercent >= 80) return 'success';
        if (scorePercent >= 50) return 'warning';
        return 'danger';
    }, [scorePercent]);

    // Determine score status text
    const scoreStatus = useMemo(() => {
        if (scorePercent >= 80) return 'Excellent';
        if (scorePercent >= 70) return 'Good';
        if (scorePercent >= 50) return 'Pass';
        return 'Needs Improvement';
    }, [scorePercent]);

    const isAdmin = useMemo(
        () => user?.role?.includes('Admin'),
        [user?.role]
    );

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
                        className="fw-bold px-3 py-2"
                        style={{
                            transition: 'all 0.2s ease-in-out',
                        }}
                    >
                        <i className="fa fa-home me-2"></i>
                        Dashboard
                    </Button>

                    {/* Title + Score Badge */}
                    <div className="d-flex flex-column flex-sm-row align-items-center gap-2">
                        <span className="text-primary fw-bold mb-0">
                            Reviewing Quiz
                        </span>

                        <Badge
                            color={getScoreColor}
                            className="px-3 py-2"
                            pill
                        >
                            <i className="fa fa-star me-1"></i>
                            Score: {scorePercent}%
                            <small className="ms-1">({scoreStatus})</small>
                        </Badge>
                    </div>

                    {/* PDF Download (Admin Only) */}
                    {isAdmin && thisReview && (
                        <PDFDownloadLink
                            document={<PdfDocument review={thisReview} />}
                            fileName={`${thisReview.title}-Quiz-Review.pdf`}
                            className="text-decoration-none"
                        >
                            {({ loading, error }) =>
                                loading ? (
                                    <Button
                                        color="secondary"
                                        size="sm"
                                        className="fw-bold px-3 py-2"
                                        disabled
                                    >
                                        <i className="fa fa-spinner fa-spin me-2"></i>
                                        Generating...
                                    </Button>
                                ) : error ? (
                                    <Button
                                        color="danger"
                                        size="sm"
                                        className="fw-bold px-3 py-2"
                                        disabled
                                    >
                                        <i className="fa fa-exclamation-triangle me-2"></i>
                                        Error
                                    </Button>
                                ) : (
                                    <Button
                                        color="success"
                                        size="sm"
                                        className="fw-bold px-3 py-2"
                                        style={{
                                            transition: 'all 0.2s ease-in-out',
                                        }}
                                    >
                                        <i className="fa fa-download me-2"></i>
                                        Download PDF
                                    </Button>
                                )
                            }
                        </PDFDownloadLink>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                    <div className="progress" style={{ height: '8px' }}>
                        <div
                            className="progress-bar progress-bar-striped progress-bar-animated"
                            role="progressbar"
                            style={{
                                width: `${progressPercent}%`,
                                backgroundColor: 'var(--brand)',
                            }}
                            aria-valuenow={progressPercent}
                            aria-valuemin="0"
                            aria-valuemax="100"
                            aria-label={`Review progress: ${progressPercent}% complete`}
                        />
                    </div>
                    <small className="text-muted mt-1 d-block">
                        {questionNumber} of {qnsAll.length} questions reviewed ({progressPercent}% complete)
                    </small>
                </div>

                {/* Question section */}
                <div
                    className="question-section mx-auto my-4 p-3 p-sm-4 rounded shadow-sm"
                    style={{
                        maxWidth: '700px',
                        border: '2px solid var(--brand)',
                        backgroundColor: '#f8f9fa',
                    }}
                >
                    <h4 className="question-count text-uppercase fw-bolder text-secondary mb-3">
                        Question{' '}
                        <span style={{ color: 'var(--brand)', fontSize: '1.2em' }}>
                            {questionNumber}
                        </span>{' '}
                        <span className="text-muted" style={{ fontSize: '0.85em' }}>
                            of {qnsAll.length}
                        </span>
                    </h4>

                    {/* Question Text */}
                    {curRevQn?.questionText ? (
                        <h5 className="q-txt fw-bolder text-dark text-center my-3 px-2">
                            {curRevQn.questionText}
                        </h5>
                    ) : (
                        <div className="alert alert-warning" role="alert">
                            <i className="fa fa-exclamation-triangle me-2"></i>
                            Question text unavailable
                        </div>
                    )}

                    {/* Question Category/Difficulty (if available) */}
                    {curRevQn?.difficulty && (
                        <div className="mt-3">
                            <Badge
                                color={
                                    curRevQn.difficulty === 'Easy'
                                        ? 'success'
                                        : curRevQn.difficulty === 'Medium'
                                            ? 'warning'
                                            : 'danger'
                                }
                                className="px-3 py-1"
                            >
                                {curRevQn.difficulty}
                            </Badge>
                        </div>
                    )}
                </div>
            </Col>
        </Row>
    );
};

export default TitleRow;
