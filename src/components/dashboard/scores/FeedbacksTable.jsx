import moment from 'moment';
import { Table, Alert } from 'reactstrap';

const FeedbacksTable = ({ feedbacksToUse, pageNo }) => {

    if (!feedbacksToUse || feedbacksToUse.length === 0) {
        return (
            <Alert
                color="danger"
                className="w-50 text-center mx-auto"
                style={{ border: '2px solid var(--brand)' }}
            >
                Seems like you have nothing here!
            </Alert>
        );
    }

    // FIX ➜ Deep clone before sorting to avoid mutating Redux state
    const sortedFeedbacks = [...feedbacksToUse]
        .map(f => ({ ...f }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <Table bordered className="all-scores table-success" hover responsive striped size="sm">
            <thead className="text-uppercase table-dark">
                <tr>
                    <th>#</th>
                    <th>Rate/10</th>
                    <th>Comment</th>
                    <th>Quiz</th>
                    <th>Author</th>
                    <th>Date</th>
                </tr>
            </thead>

            <tbody>
                {sortedFeedbacks.map((feedback, index) => {
                    const numero = ((pageNo - 1) * 20) + index + 1;
                    const formattedDate = moment(feedback.createdAt).format('YYYY-MM-DD, HH:mm');

                    return (
                        <tr key={feedback._id || index}>
                            <th className="table-dark">{numero}</th>
                            <td>{feedback.rating}</td>
                            <td>{feedback.comment}</td>
                            <td>{feedback.quiz?.title}</td>
                            <td>{feedback.user?.name}</td>
                            <td>{formattedDate}</td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
};

export default FeedbacksTable;
