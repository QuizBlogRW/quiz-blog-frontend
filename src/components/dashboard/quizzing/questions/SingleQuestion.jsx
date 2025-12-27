import { useEffect } from 'react';
import {
    Row,
    ListGroup,
    ListGroupItem,
    Breadcrumb,
    BreadcrumbItem,
} from 'reactstrap';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Dashboard from '../../Dashboard';
import { getOneQuestion, deleteQuestion } from '@/redux/slices/questionsSlice';
import EditIcon from '@/images/edit.svg';
import ChangeQuiz from './ChangeQuiz';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import QuestionComments from '../../../quizzes/review/questionComments/QuestionComments';
import DeleteModal from '@/utils/DeleteModal';
import NotAuthenticated from '@/components/users/NotAuthenticated';

const renderExplanation = text =>
    text
        ? text.split(' ').map((word, i) =>
            word.startsWith('http') ? (
                <a key={i} href={word} target="_blank" rel="noreferrer">
                    {word}{' '}
                </a>
            ) : (
                word + ' '
            )
        )
        : null;

const SingleQuestion = () => {
    const dispatch = useDispatch();
    const { questionID } = useParams();

    const { oneQuestion, isLoading } = useSelector(state => state.questions);
    const { isAuthenticated, user } = useSelector(state => state.users);

    useEffect(() => {
        dispatch(getOneQuestion(questionID));
    }, [dispatch, questionID]);

    if (!isAuthenticated) return <NotAuthenticated />;
    if (user?.role === 'Visitor') return <Dashboard />;
    if (isLoading) return <QBLoadingSM />;

    if (!oneQuestion) {
        return (
            <Row className="m-3 p-3 text-danger justify-content-center">
                <Breadcrumb>
                    <BreadcrumbItem>Question unavailable!</BreadcrumbItem>
                </Breadcrumb>
            </Row>
        );
    }

    const { category, quiz, created_by, answerOptions } = oneQuestion;

    const canEdit =
        user?.role?.includes('Admin') ||
        (created_by && user._id === created_by._id);

    return (
        <div className="mt-3 mt-lg-5 mx-3 mx-lg-5">
            {/* Breadcrumb */}
            <Row className="mb-3">
                <Breadcrumb>
                    <BreadcrumbItem>
                        <Link to={`/category/${category._id}`}>{category.title}</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <Link to={`/view-quiz/${quiz.slug}`}>{quiz.title}</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>View Question</BreadcrumbItem>
                </Breadcrumb>
            </Row>

            {/* Main Card */}
            <Row className="border rounded shadow-sm p-3 p-lg-4 text-primary bg-white">
                {/* Header */}
                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center mb-3">
                    <h4 className="fw-bold mb-2 mb-lg-0">
                        {oneQuestion.questionText}
                    </h4>

                    {canEdit && (
                        <div className="d-flex align-items-center gap-2">
                            <ChangeQuiz
                                questionID={oneQuestion._id}
                                questionCatID={category._id}
                                oldQuizID={quiz._id}
                            />
                            <DeleteModal
                                deleteFn={deleteQuestion}
                                delID={oneQuestion._id}
                                delTitle={oneQuestion.questionText}
                            />
                            <Link
                                to={`/edit-question/${oneQuestion._id}`}
                                className="d-inline-flex align-items-center"
                            >
                                <img
                                    src={EditIcon}
                                    alt="Edit"
                                    width={16}
                                    height={16}
                                />
                            </Link>
                        </div>
                    )}
                </div>

                {/* Image */}
                {oneQuestion.question_image && (
                    <div className="my-3 text-center">
                        <img
                            src={oneQuestion.question_image}
                            className="img-fluid rounded"
                            alt="Question"
                        />
                    </div>
                )}

                {/* Meta */}
                <div className="mb-3 text-muted">
                    <small>
                        Duration: <strong>{oneQuestion.duration}</strong> seconds
                    </small>
                </div>

                {/* Answers */}
                <ListGroup flush>
                    {answerOptions.map((opt, i) => (
                        <div key={opt._id} className="mb-3">
                            <ListGroupItem
                                className="fw-semibold"
                                color={opt.isCorrect ? 'success' : ''}
                            >
                                {i + 1}. {opt.answerText}
                            </ListGroupItem>

                            {opt.explanations && (
                                <div className="border rounded bg-light p-2 mt-1">
                                    <small className="text-dark">
                                        {renderExplanation(opt.explanations)}
                                    </small>
                                </div>
                            )}
                        </div>
                    ))}
                </ListGroup>
            </Row>

            {/* Comments */}
            <Row className="my-4">
                <QuestionComments
                    questionID={oneQuestion._id}
                    quizID={quiz._id}
                    fromSingleQuestion
                />
            </Row>
        </div>
    );
};

export default SingleQuestion;
