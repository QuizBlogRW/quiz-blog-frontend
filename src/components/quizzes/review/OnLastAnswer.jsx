import { Button } from 'reactstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const OnLastAnswer = ({ thisQuiz }) => {
    const { isAuthenticated } = useSelector(state => state.users);
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    if (!isAuthenticated) {
        return (
            <div className="score-section text-center py-5">
                <h5 className="fw-bold text-danger">Unauthorized!</h5>
            </div>
        );
    }

    return (
        <div className="score-section text-center py-5 px-3">

            <div className="mx-auto p-4 rounded shadow-sm border" style={{ maxWidth: "480px" }}>
                <h4 className="fw-bolder mb-4 text-success">Reviewing finished!</h4>

                {/* Retake */}
                <Link to={`/view-quiz/${thisQuiz.slug}`}>
                    <Button color="outline-success" className="w-100 mb-3 fw-bold">
                        Retake Quiz
                    </Button>
                </Link>

                {/* WhatsApp Share */}
                <Button
                    color="success"
                    className="w-100 mb-3 fw-bold d-flex align-items-center justify-content-center"
                    tag="a"
                    href={`https://api.whatsapp.com/send?text=Attempt this ${thisQuiz.title} on Quiz-Blog\nhttp://www.quizblog.rw/view-quiz/${thisQuiz.slug}`}
                    target="_blank"
                >
                    <i className="fa-brands fa-whatsapp me-2"></i>
                    Share on WhatsApp
                </Button>

                {/* Back */}
                <Button color="outline-info" className="w-100 fw-bold" onClick={goBack}>
                    <i className="fas fa-circle-left me-2"></i> Back
                </Button>
            </div>

        </div>
    );
};

export default OnLastAnswer;
