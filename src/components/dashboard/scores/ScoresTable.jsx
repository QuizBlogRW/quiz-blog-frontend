import { Table, Alert } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DeleteModal from '@/utils/DeleteModal';
import { formatDateTime } from '@/utils/dateFormat';

const ScoresTable = ({ scoresToUse, pageNo, deleteScore }) => {

    const { user } = useSelector(state => state.users);

    return (
        scoresToUse && scoresToUse?.length > 0 ?
            <Table bordered className='all-scores table-success' hover responsive striped size="sm">
                <thead className='text-uppercase table-dark'>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Date</th>
                        <th scope="col">Taker</th>
                        <th scope="col">Quiz</th>
                        <th scope="col">Category</th>
                        <th scope="col">Marks</th>
                        <th scope="col">Out of</th>
                        <th scope="col">Reviewing</th>
                        <th scope="col" className={`${user?.role?.includes('Admin') ? '' : 'd-none'}`}><span role="img" aria-label="pointing">❌</span></th>
                    </tr>
                </thead>

                <tbody>

                    {scoresToUse && [...scoresToUse].sort((a, b) => new Date(b.test_date) - new Date(a.test_date)).map((score, index) => {
                        const taker = score && (user?.role === 'Creator') ? score.users_scores_name : score && (user?.role === 'Visitor') ? user && user.name : score.taken_by && score.taken_by.name;

                        const qui = score && (user?.role === 'Creator') ? score.quiz_scores_title : score && (user?.role === 'Visitor') ? score.review && score.review.title : score.quiz && score.quiz.title;

                        const catg = score && (user?.role === 'Creator') ? score.category_scores_title : score.category && score.category.title;

                        let date = score && new Date(score.test_date);

                        const numero = user?.role?.includes('Admin') ? ((pageNo - 1) * 20) + index + 1 : index + 1;
                        const formattedDate = date ? formatDateTime(date) : '';

                        return (<tr key={index}>
                            <th scope="row" className="table-dark">{numero && numero}</th>
                            <td>{date && formattedDate}</td>
                            <td className='text-uppercase'>
                                {taker && taker}
                            </td>
                            <td>{qui && qui}</td>
                            <td>{catg && catg}</td>
                            <td className={score.out_of / 2 > score.marks ? 'fw-bolder text-danger' : 'text-success'}>
                                {score.marks}
                            </td>
                            <td className={score.out_of / 2 > score.marks ? 'fw-bolder text-danger' : 'text-success'}>
                                {score.out_of}
                            </td>
                            <td>
                                <Link to={`/review-quiz/${score && score.id}`}>Review</Link>
                            </td>
                            <td className={`table-dark ${user?.role?.includes('Admin') ? '' : 'd-none'}`}>
                                <DeleteModal deleteFnName="deleteScore" deleteFn={deleteScore} delID={score._id} delTitle={score.quiz && score.quiz.title} />
                            </td>
                        </tr>);
                    }
                    )}

                </tbody>
            </Table> :
            <Alert color="danger" className="w-50 text-center mx-auto" style={{ border: '2px solid var(--brand)' }}>
                Seems like you have nothing here! Please try to take Quizzes.
            </Alert>
    );
};

export default ScoresTable;