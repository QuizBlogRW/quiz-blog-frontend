export function calculateMarks(questions) {
    return questions
        .map(q => {
            const correct = q.answerOptions.filter(o => o.isCorrect).length;
            const chosenCorrect = q.answerOptions.filter(o => o.choosen && o.isCorrect).length;

            if (correct === 0) return 0;
            return chosenCorrect / correct;
        })
        .reduce((a, b) => a + b, 0);
}

// Calculate total duration of questions in minutes
export function calculateQuestionsDurationInMinutes(questions) {
    if (!questions || questions.length === 0) return 0;
    const totalSeconds = questions.reduce((sum, question) => {
        return sum + (question.duration || 30);
    }, 0);
    return Math.ceil(totalSeconds / 60);
};
