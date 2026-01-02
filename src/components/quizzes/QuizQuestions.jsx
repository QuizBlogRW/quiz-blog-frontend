import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createScore } from "@/redux/slices/scoresSlice";
import { v4 as uuidv4 } from "uuid";

import QBLoadingSM from "@/utils/rLoading/QBLoadingSM";
import QuestionsView from "./QuestionsView";
import NoQuestions from "./questionsScore/NoQuestions";
import Unavailable from "./questionsScore/Unavailable";
import { notify } from "@/utils/notifyToast";

import { calculateMarks } from "@/utils/quizUtils";

const QuizQuestions = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { quizSlug } = useParams();

    const { user, isAuthenticated } = useSelector((state) => state.users);

    const thisQuiz = location.state;

    // Index and navigation
    const qnsLength = thisQuiz?.questions?.length || 0;
    const [curQnIndex, setCurQnIndex] = useState(0);

    const currentQn = useMemo(
        () => thisQuiz?.questions?.[curQnIndex],
        [thisQuiz?.questions, curQnIndex]
    );

    // Per-question answer states
    const [answers, setAnswers] = useState([]);

    // Initialize answers when question changes
    useEffect(() => {
        if (currentQn?.answerOptions) {
            setAnswers(currentQn.answerOptions.map(() => false));
        }
    }, [currentQn]);

    // Review object - memoize initial state
    const initialReview = useMemo(() => {
        if (!thisQuiz?.questions) return null;

        return {
            title: thisQuiz.title,
            description: thisQuiz.description,
            questions: thisQuiz.questions.map((q) => ({
                ...q,
                answerOptions: q.answerOptions.map((a) => ({ ...a, choosen: false })),
            })),
        };
    }, [thisQuiz]);

    const [quizToReview, setQuizToReview] = useState(initialReview);
    const [saving, setSaving] = useState(false);

    // Prevent double navigation
    const isNavigatingRef = useRef(false);

    // Generate stable ID for the score
    const scoreId = useRef(uuidv4()).current;

    // Handle answer selection
    const handleOnChange = useCallback((pos) => {
        setAnswers((prev) => prev.map((v, i) => (i === pos ? !v : v)));

        // Update review stored object immutably
        setQuizToReview((prev) => {
            const updated = [...prev.questions];
            const currentQuestion = { ...updated[curQnIndex] };
            const updatedOptions = [...currentQuestion.answerOptions];

            updatedOptions[pos] = {
                ...updatedOptions[pos],
                choosen: !updatedOptions[pos].choosen,
            };

            currentQuestion.answerOptions = updatedOptions;
            updated[curQnIndex] = currentQuestion;

            return { ...prev, questions: updated };
        });
    }, [curQnIndex]);

    // Memoized score object
    const scoreToSave = useMemo(() => {
        if (!quizToReview?.questions) return null;

        const marks = Math.floor(calculateMarks(quizToReview.questions));

        return {
            id: scoreId,
            marks,
            out_of: qnsLength,
            category: thisQuiz?.category?._id,
            quiz: thisQuiz?._id,
            review: quizToReview,
            taken_by: user?._id,
        };
    }, [quizToReview, qnsLength, thisQuiz, user?._id, scoreId]);

    // Save score for authenticated users
    const saveScore = useCallback(async () => {
        if (!isAuthenticated || !user?._id) {
            return null; // Guest - will be saved after login
        }

        setSaving(true);

        try {
            const result = await dispatch(createScore(scoreToSave)).unwrap();
            return result?._id || null;
        } catch (error) {
            console.error("Failed to save score:", error);
            notify("Could not save your score. Please try again.", "error");
            return null;
        } finally {
            setSaving(false);
        }
    }, [dispatch, scoreToSave, isAuthenticated, user?._id]);

    // Calculate pass mark based on category
    const passMark = useMemo(() => {
        const drivingTestCategoryId = "60e9a2ba82f7830015c317f1";
        return thisQuiz?.category?._id === drivingTestCategoryId ? 80 : 50;
    }, [thisQuiz?.category?._id]);

    // Finish quiz and navigate to results
    const finishQuiz = useCallback(async () => {
        // Prevent double navigation
        if (isNavigatingRef.current) return;
        isNavigatingRef.current = true;

        const finalMarks = Math.floor(calculateMarks(quizToReview.questions));
        const mongoScoreID = await saveScore();

        navigate(`/quiz-results/${quizSlug}`, {
            state: {
                score: finalMarks,
                qnsLength,
                passMark,
                thisQuiz,
                quizToReview,
                mongoScoreID,
                scoreToSaveID: scoreToSave?.id,
            },
        });
    }, [
        quizToReview,
        saveScore,
        navigate,
        quizSlug,
        qnsLength,
        passMark,
        thisQuiz,
        scoreToSave,
    ]);

    // Move to next question or finish quiz
    const goToNextQuestion = useCallback(() => {
        if (curQnIndex + 1 < qnsLength) {
            setCurQnIndex((i) => i + 1);
        } else {
            finishQuiz();
        }
    }, [curQnIndex, qnsLength, finishQuiz]);

    // Auto-advance when user selected all correct options
    useEffect(() => {
        if (!currentQn?.answerOptions) return;

        const correctCount = currentQn.answerOptions.filter((o) => o.isCorrect).length;
        const selectedCount = answers.filter((v) => v).length;

        // Only auto-advance if user selected exactly the right number of answers
        if (selectedCount === correctCount && correctCount > 0) {
            const timer = setTimeout(goToNextQuestion, 400);
            return () => clearTimeout(timer);
        }
    }, [answers, currentQn, goToNextQuestion]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e) => {
            // Number keys 1-9 for selecting answers
            if (e.key >= '1' && e.key <= '9') {
                const index = parseInt(e.key) - 1;
                if (index < (currentQn?.answerOptions?.length || 0)) {
                    handleOnChange(index);
                }
            }
            // Enter or Space to go to next question
            if ((e.key === 'Enter' || e.key === ' ') && !saving) {
                e.preventDefault();
                goToNextQuestion();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentQn, handleOnChange, goToNextQuestion, saving]);

    // Prevent accidental navigation away
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (curQnIndex > 0 && curQnIndex < qnsLength - 1) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [curQnIndex, qnsLength]);

    // Guards - early returns
    if (!thisQuiz) {
        return <Unavailable title="Quiz" link="/all-quizzes" />;
    }

    if (qnsLength === 0) {
        return <NoQuestions />;
    }

    if (saving) {
        return <QBLoadingSM />;
    }

    if (!currentQn) {
        return <QBLoadingSM />;
    }

    return (
        <div className="mx-auto flex-column justify-content-center rounded border border-primary my-5 py-4">
            <QuestionsView
                qnsLength={qnsLength}
                curQnIndex={curQnIndex}
                currentQn={currentQn}
                curQnOpts={currentQn.answerOptions}
                checkedState={answers}
                selected={answers}
                handleOnChange={(e, i) => handleOnChange(i)}
                goToNextQuestion={goToNextQuestion}
            />
        </div>
    );
};

export default QuizQuestions;
