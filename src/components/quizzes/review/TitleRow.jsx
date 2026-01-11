import { useMemo } from 'react';
import { Row, Button, Badge } from 'reactstrap';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useSelector } from 'react-redux';
import PdfDocument from '@/components/dashboard/pdfs/PdfDocument';

// Constants
const SCORE_THRESHOLDS = {
    EXCELLENT: 80,
    GOOD: 70,
    PASS: 50,
};

// Helper functions
const calculatePercentage = (value, total) => {
    if (!total) return 0;
    return Math.round((value * 100) / total);
};

const getScoreColor = (percent) => {
    if (percent >= SCORE_THRESHOLDS.EXCELLENT) return 'success';
    if (percent >= SCORE_THRESHOLDS.PASS) return 'warning';
    return 'danger';
};

const getScoreStatus = (percent) => {
    if (percent >= SCORE_THRESHOLDS.EXCELLENT) return 'Excellent';
    if (percent >= SCORE_THRESHOLDS.GOOD) return 'Good';
    if (percent >= SCORE_THRESHOLDS.PASS) return 'Pass';
    return 'Needs Improvement';
};

const getDifficultyColor = (difficulty) => {
    const difficultyMap = {
        Easy: 'success',
        Medium: 'warning',
        Hard: 'danger',
    };
    return difficultyMap[difficulty] || 'secondary';
};

// Dashboard Button Component
const DashboardButton = () => (
    <Button
        outline
        color="success"
        size="sm"
        tag="a"
        href="/dashboard"
        className="fw-bold px-3 py-2 d-flex align-items-center"
        style={{ transition: 'all 0.2s ease-in-out' }}
    >
        <i className="fa fa-home me-2"></i>
        <span>Dashboard</span>
    </Button>
);

// Score Badge Component
const ScoreBadge = ({ scorePercent }) => {
    const color = useMemo(() => getScoreColor(scorePercent), [scorePercent]);
    const status = useMemo(() => getScoreStatus(scorePercent), [scorePercent]);

    return (
        <div className="d-flex flex-column flex-sm-row align-items-center gap-2">
            <Badge color={color} className="px-3 py-2" pill>
                <i className="fa fa-star me-1"></i>
                <span className="d-none d-sm-inline">Score: </span>
                {scorePercent}%
                <small className="ms-1 d-none d-md-inline">({status})</small>
            </Badge>
        </div>
    );
};

// PDF Download Button Component
const PDFDownloadButton = ({ thisReview }) => {
    if (!thisReview) return null;

    return (
        <PDFDownloadLink
            document={<PdfDocument review={thisReview} />}
            fileName={`${thisReview.title}-Quiz-Review.pdf`}
            className="text-decoration-none"
        >
            {({ loading, error }) => {
                if (loading) {
                    return (
                        <Button
                            color="secondary"
                            size="sm"
                            className="fw-bold px-3 py-2 d-flex align-items-center"
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
                            size="sm"
                            className="fw-bold px-3 py-2 d-flex align-items-center"
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
                        size="sm"
                        className="fw-bold px-3 py-2 d-flex align-items-center"
                        style={{ transition: 'all 0.2s ease-in-out' }}
                    >
                        <i className="fa fa-download me-2"></i>
                        <span className="d-none d-sm-inline">Download PDF</span>
                        <span className="d-inline d-sm-none">PDF</span>
                    </Button>
                );
            }}
        </PDFDownloadLink>
    );
};

// Progress Bar Component
const ProgressBar = ({ progressPercent, questionNumber, totalQuestions }) => (
    <div className="mb-3 px-2 px-sm-0">
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
        <small className="text-muted mt-2 d-block">
            <span className="d-none d-sm-inline">
                {questionNumber} of {totalQuestions} questions reviewed ({progressPercent}% complete)
            </span>
            <span className="d-inline d-sm-none">
                {questionNumber}/{totalQuestions}
            </span>
        </small>
    </div>
);

// Question Display Component
const QuestionDisplay = ({ curRevQn, questionNumber, totalQuestions }) => {
    if (!curRevQn) {
        return (
            <div className="alert alert-warning" role="alert">
                <i className="fa fa-exclamation-triangle me-2"></i>
                Question data unavailable
            </div>
        );
    }

    return (
        <div
            className="question-section mx-auto my-3 my-sm-4 p-3 p-sm-4 rounded shadow-sm"
            style={{
                maxWidth: '700px',
                border: '2px solid var(--brand)',
                backgroundColor: '#f8f9fa',
            }}
        >
            {/* Question Counter */}
            <h4 className="question-count text-uppercase fw-bolder text-secondary mb-3">
                <span className="d-none d-sm-inline">Question </span>
                <span className="d-inline d-sm-none">Q </span>
                <span style={{ color: 'var(--brand)', fontSize: '1.2em' }}>
                    {questionNumber}
                </span>{' '}
                <span className="text-muted" style={{ fontSize: '0.85em' }}>
                    of {totalQuestions}
                </span>
            </h4>

            {/* Question Text */}
            {curRevQn.questionText ? (
                <h5 className="q-txt fw-bolder text-dark text-center my-3 px-2 fs-6 fs-sm-5">
                    {curRevQn.questionText}
                </h5>
            ) : (
                <div className="alert alert-warning" role="alert">
                    <i className="fa fa-exclamation-triangle me-2"></i>
                    Question text unavailable
                </div>
            )}

            {/* Difficulty Badge */}
            {curRevQn.difficulty && (
                <div className="mt-3">
                    <Badge
                        color={getDifficultyColor(curRevQn.difficulty)}
                        className="px-3 py-1"
                    >
                        <i className="fa fa-signal me-1 d-none d-sm-inline"></i>
                        {curRevQn.difficulty}
                    </Badge>
                </div>
            )}
        </div>
    );
};

// Main Component
const TitleRow = ({ thisReview, score, qnsAll, curRevQn, currentQuestion }) => {
    const { user } = useSelector((state) => state.users);

    // Memoize calculations
    const scorePercent = useMemo(
        () => calculatePercentage(score, qnsAll?.length),
        [score, qnsAll?.length]
    );

    const progressPercent = useMemo(
        () => calculatePercentage(currentQuestion + 1, qnsAll?.length),
        [currentQuestion, qnsAll?.length]
    );

    const questionNumber = useMemo(
        () => currentQuestion + 1,
        [currentQuestion]
    );

    const isAdmin = useMemo(
        () => user?.role?.includes('Admin'),
        [user?.role]
    );

    const totalQuestions = qnsAll?.length || 0;

    return (
        <Row className="justify-content-center">
                {/* Top Action Row */}
                <div className="d-flex justify-content-around align-items-center mb-3 mb-sm-5 px-2">
                    <DashboardButton />
                    <ScoreBadge scorePercent={scorePercent} />
                    {isAdmin && <PDFDownloadButton thisReview={thisReview} />}
                </div>

                {/* Progress Bar */}
                <ProgressBar
                    progressPercent={progressPercent}
                    questionNumber={questionNumber}
                    totalQuestions={totalQuestions}
                />

                {/* Question Display */}
                <QuestionDisplay
                    curRevQn={curRevQn}
                    questionNumber={questionNumber}
                    totalQuestions={totalQuestions}
                />
        </Row>
    );
};

export default TitleRow;