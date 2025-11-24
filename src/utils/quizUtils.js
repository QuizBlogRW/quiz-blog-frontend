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
