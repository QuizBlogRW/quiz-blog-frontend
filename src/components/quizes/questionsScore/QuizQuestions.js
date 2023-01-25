import React, { useState, useEffect, lazy, Suspense, useContext } from 'react'
import { Container, Spinner } from 'reactstrap'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { getOneQuiz } from '../../../redux/quizes/quizes.actions'
import { v4 as uuidv4 } from 'uuid'
import ScoreSection from './ScoreSection'
import QuestionsView from './QuestionsView'
import SimilarQuizes from './SimilarQuizes'
import LoadingQuestions from '../../rLoading/LoadingQuestions'
import NoQuestions from './NoQuestions'
import Unavailable from './Unavailable'
import RelatedNotes from './RelatedNotes'
import { categoriesContext } from '../../../appContexts'

const ResponsiveAd = lazy(() => import('../../adsenses/ResponsiveAd'))
const GridMultiplex = lazy(() => import('../../adsenses/GridMultiplex'))

const QuizQuestions = ({ qZ, getOneQuiz }) => {

    const categories = useContext(categoriesContext)

    // Access route parameters & get the quiz
    const { quizSlug } = useParams()
    useEffect(() => { getOneQuiz(quizSlug) }, [getOneQuiz, quizSlug])
    const [newScoreId, setNewScoreId] = useState();

    // Question setup
    const thisQuiz = qZ && qZ.oneQuiz
    const qnsLength = thisQuiz && thisQuiz.questions && thisQuiz.questions.length
    const [curQnIndex, setCurQnIndex] = useState(0)
    const currentQn = thisQuiz && thisQuiz.questions[curQnIndex]
    const curQnOpts = currentQn && currentQn.answerOptions

    // Dealing with answers
    const trueAnsNbr = curQnOpts && curQnOpts.filter(aOpt => aOpt.isCorrect === true).length

    // Checked and User choices
    const [selected, setSelected] = useState('')
    const [checkedState, setCheckedState] = useState([])
    useEffect(() => { curQnOpts && setCheckedState(new Array(curQnOpts.length).fill(false)) }, [curQnOpts])

    const [choices, setChoices] = useState(0)
    const [curQnUsrTrueChoices, setCurQnUsrTrueChoices] = useState(0)
    useEffect(() => { selected && setChoices(selected.filter(value => value).length) }, [selected])
    useEffect(() => { selected && setCurQnUsrTrueChoices(selected.filter(value => (value === 'true')).length) }, [selected])

    // Scores & Review
    const [score, setScore] = useState(0)
    const [showScore, setShowScore] = useState(false)
    const [quizToReview, setQuizToReview] = useState({})
    const passMark = thisQuiz.category && thisQuiz.category._id === '60e9a2ba82f7830015c317f1' ? 80 : 50
    const reviewDetails = { review: quizToReview && quizToReview }

    // Function to change selected answer
    const handleOnChange = (event, position) => {
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item)

        setCheckedState(updatedCheckedState)

        const selectedAnswer = updatedCheckedState.map(

            (curSelState, index) => {
                var ansArr = ''
                if (curSelState === true) {
                    return ansArr + curQnOpts[index].isCorrect
                }
                return ansArr
            })

        setSelected(selectedAnswer)

        // Review answers
        curQnOpts
            .forEach(opt => {
                if (event && event.target.value === opt.answerText) {
                    if (opt.choosen === undefined) {
                        opt.choosen = true
                    }
                    else if (opt.choosen === true) {
                        opt.choosen = false
                    }
                    else if (opt.choosen === false) {
                        opt.choosen = true
                    }
                }
                else {
                    if (opt.choosen === undefined) {
                        opt.choosen = false
                    }
                }
            })

        // Preparing the review
        setQuizToReview({
            ...quizToReview,
            id: uuidv4(),
            title: thisQuiz.title,
            description: thisQuiz.description,
            questions: thisQuiz.questions
        })
        setNewScoreId(uuidv4())
    }

    // Going to next question
    const goToNextQuestion = (currentIndex, QuestionsLength) => {
        currentIndex + 1 < QuestionsLength ?
            setCurQnIndex(currentIndex + 1) : setShowScore(true)
    }

    if (trueAnsNbr === choices) {
        if (trueAnsNbr === curQnUsrTrueChoices) {
            setScore(score + 1)
        }
        goToNextQuestion(curQnIndex, qnsLength)
        setCheckedState([])
        setSelected('')
        setChoices(0)
        setCurQnUsrTrueChoices(0)
    }

    if (!qZ.isLoading) {

        return (

            thisQuiz ?

                qnsLength > 0 ?

                    <div key={Math.floor(Math.random() * 1000)}>
                        <Container className="main d-flex flex-column justify-content-center rounded border border-primary my-5 py-4 w-80">

                            {showScore ?
                                <ScoreSection
                                    score={score}
                                    qnsLength={qnsLength}
                                    thisQuiz={thisQuiz}
                                    toReview={reviewDetails.review}
                                    quizToReview={quizToReview}
                                    passMark={passMark}
                                    newScoreId={newScoreId} /> :

                                <QuestionsView
                                    qnsLength={qnsLength}
                                    curQnIndex={curQnIndex}
                                    currentQn={currentQn}
                                    curQnOpts={curQnOpts}
                                    checkedState={checkedState}
                                    selected={selected}
                                    score={score}
                                    handleOnChange={handleOnChange}
                                    goToNextQuestion={goToNextQuestion}
                                    setCurQnIndex={setCurQnIndex} />}
                        </Container>

                        {showScore ?
                            <>
                                <SimilarQuizes
                                    thisQId={thisQuiz && thisQuiz._id}
                                    categories={categories.allcategories}
                                    categoryId={thisQuiz.category && thisQuiz.category._id} />

                                <Suspense fallback={<div className="p-1 m-1 d-flex justify-content-center align-items-center w-100">
                                    <Spinner color="primary" />
                                </div>}>
                                    <div className='w-100'>
                                        <ResponsiveAd />
                                    </div>
                                </Suspense>

                                <RelatedNotes
                                    ccatgID={thisQuiz.category && thisQuiz.category.courseCategory} />

                                <Suspense fallback={<div className="p-1 m-1 d-flex justify-content-center align-items-center">
                                    <Spinner color="primary" />
                                </div>}>
                                    <GridMultiplex />
                                </Suspense>
                            </> : null}
                    </div> :

                    <NoQuestions /> :

                <Unavailable title='Quiz' link='/allposts' more='quizes' />
        )
    }

    else {
        return (<LoadingQuestions />)
    }
}

const mapStateToProps = state => ({
    qZ: state.quizesReducer
})

export default connect(mapStateToProps, { getOneQuiz })(QuizQuestions)