import { Link } from 'react-router-dom';
import { Col, Toast, ToastBody, ToastHeader } from 'reactstrap';

import EditQuiz from './EditQuiz';
import DeleteModal from '@/utils/DeleteModal';
import AddIcon from '@/images/plus.svg';
import { deleteQuiz } from '@/redux/slices/quizzesSlice';

const QuizToast = ({ fromSearch, quiz }) => {
    
    const toastClass = fromSearch
        ? 'bg-warning text-success py-3 px-1 px-sm-3 my-2 my-sm-3 border'
        : 'py-3 px-1 px-sm-3 my-2 my-sm-3 border';

    const linkClass = fromSearch ? 'text-success' : 'text-success';
    const questionLinkClass = fromSearch ? 'text-success' : 'text-primary';

    return (
        <Col sm="3" className="mt-3 quiz-toast">
            <Toast className={toastClass} fade={false}>
                <ToastHeader className="d-flex justify-content-between align-items-start">
                    <Link
                        to={`/quiz-ranking/${quiz._id}`}
                        state={quiz}
                        className={`mb-0 ${linkClass} text-uppercase`}
                    >
                        {quiz.title} <small>&nbsp;(Ranking)</small>
                    </Link>

                    <div className="d-flex gap-2 mt-3">
                        <DeleteModal
                            deleteFn={deleteQuiz}
                            delID={quiz._id}
                            delTitle={quiz.title}
                        />
                        <EditQuiz quizToEdit={quiz} />
                        <Link to={`/questions-create/${quiz.slug}`} className="text-secondary d-flex align-items-center gap-1">
                            <img src={AddIcon} alt="Add" width="12" height="12" />
                            <small>Questions</small>
                        </Link>
                    </div>
                </ToastHeader>

                <ToastBody>
                    <p>{quiz.description}</p>

                    {quiz?.questions?.length > 0 ? (
                        <>
                            <p className="fw-bolder">Questions ({quiz.questions.length})</p>
                            <ul className="pl-0">
                                {quiz.questions.map((question, idx) => (
                                    <li key={question._id} className="mb-1 list-unstyled">
                                        {idx + 1}.{' '}
                                        <Link
                                            to={`/view-question/${question._id}`}
                                            className={questionLinkClass}
                                        >
                                            {question.questionText}
                                        </Link>{' '}
                                        <strong className="text-danger">
                                            ({question.answerOptions?.length} answers)
                                        </strong>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <p className="fw-bolder text-danger">No questions</p>
                    )}
                </ToastBody>
            </Toast>
        </Col>
    );
};

export default QuizToast;
