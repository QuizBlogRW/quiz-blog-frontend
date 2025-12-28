import { Button } from 'reactstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NotAuthenticated from '@/components/users/NotAuthenticated';

const OnLastAnswer = ({ thisQuiz }) => {
    const { isAuthenticated } = useSelector(state => state.users);
    const navigate = useNavigate();

    const goBack = () => navigate(-1);
    const currentDomain = window.location.origin;
    const shareText = `Attempt this "${thisQuiz.title}" quiz on Quiz-Blog\n${currentDomain}/view-quiz/${thisQuiz.slug}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    
    if (!isAuthenticated) return <NotAuthenticated />;

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
                    className="btn-accent px-4 py-2 fw-semibold shadow-sm d-flex align-items-center"
                    tag="a"
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
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
