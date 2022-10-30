import React from 'react'
import { Link } from "react-router-dom";
import EditQuiz from './EditQuiz';
import trash from '../../images/trash.svg';
import AddIcon from '../../images/plus.svg';
import { Col, Toast, ToastBody, ToastHeader } from 'reactstrap';

const QuizToast = ({ auth, categories, quiz, deleteQuiz }) => {

    return (

        <Col sm="3" key={quiz._id} className="mt-3 quiz-toast">

            <Toast>
                <ToastHeader className="text-success">
                    <Link to={`/quiz-ranking/${quiz._id}`}>
                        <strong>{quiz.title}</strong>
                        <small>&nbsp;(Ranking)</small>
                    </Link>

                    <div className="actions text-secondary d-flex">
                        <img src={trash} alt="" width="16" height="16" className="mr-3 mt-1" onClick={() => deleteQuiz(quiz._id)} />

                        <EditQuiz auth={auth} categories={categories} quizToEdit={quiz && quiz} />

                        <Link to={`/questions-create/${quiz.slug}`} className="text-secondary">
                            <img src={AddIcon} alt="" width="12" height="12" className="" /> <small>Questions</small>
                        </Link>
                    </div>
                </ToastHeader>

                <ToastBody>
                    {quiz.description}
                    <br />
                    <small className="mb-2 text-success font-weight-bold">
                        🧑 By {quiz.created_by && quiz.created_by.name}
                    </small>
                    <br />
                    <br />

                    {quiz.questions && quiz.questions.length > 0 ?
                        <>
                            <p className="font-weight-bold">Questions ({quiz.questions.length})</p>

                            {quiz && quiz.questions.map((question, index) =>
                                <ul key={question._id} className="pl-1">
                                    <li style={{ listStyle: "none" }}>
                                        {index + 1}.&nbsp;

                                        <Link to={`/view-question/${question._id}`}>
                                            {question.questionText}
                                        </Link>
                                        <strong className="text-danger">&nbsp;
                                            ({question.answerOptions.length} answers)</strong>
                                    </li>
                                </ul>
                            )}</> :
                        <p className="font-weight-bold text-danger">No questions</p>}

                </ToastBody>

            </Toast>

        </Col>)
};

export default QuizToast;