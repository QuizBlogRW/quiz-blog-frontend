import moment from 'moment'
import { Table, Alert } from 'reactstrap'

const FeedbacksTable = ({ feedbacksToUse, pageNo }) => {

    return (
        feedbacksToUse && feedbacksToUse.length > 0 ?
            <Table bordered className='all-scores table-success' hover responsive striped size="sm">
                <thead className='text-uppercase table-dark'>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Rate/10</th>
                        <th scope="col">Comment</th>
                        <th scope="col">Quiz</th>
                        <th scope="col">Author</th>
                        <th scope="col">Date</th>
                    </tr>
                </thead>

                <tbody>
                    {feedbacksToUse && [...feedbacksToUse].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((feedback, index) => {

                        let date = feedback && new Date(feedback.createdAt)
                        const numero = ((pageNo - 1) * 20) + index + 1
                        const quiz = feedback && feedback.quiz
                        const rating = feedback && feedback.rating
                        const comment = feedback && feedback.comment
                        const user = feedback && feedback.user

                        return (<tr key={index}>
                            <th scope="row" className="table-dark">{numero && numero}</th>
                            <td>{rating && rating}</td>
                            <td>{comment && comment}</td>
                            <td>{quiz && quiz.title}</td>
                            <td>{user && user?.name}</td>
                            <td>{date && moment(date).format('YYYY-MM-DD, HH:mm')}</td>
                        </tr>)
                    })}

                </tbody>
            </Table> :
            <Alert color="danger" className="w-50 text-center mx-auto" style={{ border: '2px solid var(--brand)' }}>
                Seems like you have nothing here!
            </Alert>
    )
}

export default FeedbacksTable
