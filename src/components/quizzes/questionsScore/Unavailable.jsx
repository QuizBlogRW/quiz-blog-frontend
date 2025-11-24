import { Button } from 'reactstrap';

const Unavailable = ({ title, link, more }) => {
    return (
        <div className="py-5 d-flex flex-column justify-content-center align-items-center text-center">
            <h4 className="text-danger fw-bold mb-3" style={{ fontSize: '1rem' }}>
                {title}
            </h4>

            <p className="mb-0">
                <Button color="brand" outline href={link} className="fw-bold text-decoration-none">
                    <span role="img" aria-label="pointing">👉</span>&nbsp;Click here for more {more}
                </Button>
            </p>
        </div>
    );
};

export default Unavailable;
