import { useState, useEffect, useMemo, useCallback } from "react";
import { Container } from "reactstrap";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createScore } from "@/redux/slices/scoresSlice";
import { v4 as uuidv4 } from "uuid";

import QBLoadingSM from "@/utils/rLoading/QBLoadingSM";
import QuestionsView from "./QuestionsView";
import NoQuestions from "./questionsScore/NoQuestions";
import Unavailable from "./questionsScore/Unavailable";

import { calculateMarks } from "@/utils/quizUtils";

const QuizQuestions = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    const { quizSlug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const thisQuiz = location.state;

    // Index
    const qnsLength = thisQuiz?.questions?.length || 0;
    const [curQnIndex, setCurQnIndex] = useState(0);
    const currentQn = thisQuiz?.questions?.[curQnIndex];

    // Per-question answer states
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        if (currentQn?.answerOptions) {
            setAnswers(currentQn.answerOptions.map(() => false));
        }
    }, [currentQn]);

    // Review object
    const initialReview = useMemo(() => ({
        title: thisQuiz?.title,
        description: thisQuiz?.description,
        questions: JSON.parse(JSON.stringify(thisQuiz?.questions || [])),
    }), []);

    const [quizToReview, setQuizToReview] = useState(initialReview);
    const [saving, setSaving] = useState(false);

    // When user clicks an answer
    const handleOnChange = (pos) => {
        setAnswers(prev =>
            prev.map((v, i) => (i === pos ? !v : v))
        );

        // update review stored object
        const updated = [...quizToReview.questions];
        updated[curQnIndex].answerOptions[pos].choosen =
            !updated[curQnIndex].answerOptions[pos].choosen;

        setQuizToReview({ ...quizToReview, questions: updated });
    };

    // Memo score object
    const scoreToSave = useMemo(() => {

        const marks = Math.floor(calculateMarks(quizToReview.questions));

        return {
            id: uuidv4(),
            marks,
            out_of: qnsLength,
            category: thisQuiz?.category?._id,
            quiz: thisQuiz?._id,
            review: quizToReview,
            taken_by: user?._id,
        };
    }, [quizToReview, qnsLength, thisQuiz, user]);

    // Save score
    const saveScore = useCallback(async () => {
        if (!user?._id) return null; // Not logged in

        setSaving(true);

        try {
            const saved = await dispatch(createScore(scoreToSave)).unwrap();
            setSaving(false);
            return saved?._id || null;
        } catch {
            setSaving(false);
            return null;
        }
    }, [dispatch, scoreToSave, user]);

    // Move to next question
    const goToNextQuestion = useCallback(async () => {
        if (curQnIndex + 1 < qnsLength) {
            setCurQnIndex(i => i + 1);
            return;
        }

        const finalMarks = Math.floor(calculateMarks(quizToReview.questions));
        const mongoScoreID = await saveScore();

        navigate(`/quiz-results/${quizSlug}`, {
            state: {
                score: finalMarks,
                qnsLength,
                passMark: thisQuiz?.category?._id === "60e9a2ba82f7830015c317f1" ? 80 : 50,
                thisQuiz,
                quizToReview,
                mongoScoreID,
                scoreToSaveID: scoreToSave.id,
            }
        });
    }, [curQnIndex, qnsLength, quizToReview, saveScore, navigate, quizSlug, thisQuiz]);

    // Auto-advance when user selected all correct options
    useEffect(() => {
        if (!currentQn?.answerOptions) return;

        const correctCount = currentQn.answerOptions.filter(o => o.isCorrect).length;
        const selectedCount = answers.filter(v => v).length;

        if (selectedCount === correctCount) {
            const timer = setTimeout(goToNextQuestion, 200);
            return () => clearTimeout(timer);
        }
    }, [answers, currentQn, goToNextQuestion]);

    if (!thisQuiz) return <Unavailable title="Quiz" link="/all-quizzes" />;
    if (qnsLength === 0) return <NoQuestions />;
    if (saving) return <QBLoadingSM />;

    return (
        <div className="py-3 d-flex justify-content-center align-items-center flex-column">
            <Container className="main mx-auto flex-column justify-content-center rounded border border-primary my-5 py-4 w-80">
                <QuestionsView
                    qnsLength={qnsLength}
                    curQnIndex={curQnIndex}
                    currentQn={currentQn}
                    curQnOpts={currentQn?.answerOptions}
                    checkedState={answers}
                    selected={answers}
                    handleOnChange={(e, i) => handleOnChange(i)}
                    goToNextQuestion={goToNextQuestion}
                />
            </Container>
        </div>
    );
};

export default QuizQuestions;
