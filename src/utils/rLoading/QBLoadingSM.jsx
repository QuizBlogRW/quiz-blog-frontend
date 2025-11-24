import { Spinner } from 'reactstrap';

const QBLoadingSM = () => {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center py-4 w-100">
            <Spinner color="success" type="grow" style={{ width: '2.5rem', height: '2.5rem' }} />

            <small className="text-secondary mt-2 fw-semibold">
                Loading...
            </small>
        </div>
    );
};

export default QBLoadingSM;
