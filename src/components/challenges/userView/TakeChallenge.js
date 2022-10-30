import React, { useState, useEffect } from 'react'
import { Container, Button } from 'reactstrap'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { getOneChQuiz } from '../../../redux/challenges/challengeQuizzes/challengeQuizzes.actions'
import { v4 as uuidv4 } from 'uuid'
import ScoreSection from './ScoreSection'
import QuestionsViewChallenge from './QuestionsViewChallenge'
import LoadingQuestions from '../../rLoading/LoadingQuestions'
import NoQuestions from './NoQuestions'
import Unavailable from './Unavailable'

const TakeChallenge = ({ chQz, getOneChQuiz, auth }) => {

    // Access route parameters & get the challenge
    const { challengeId } = useParams()
    useEffect(() => { getOneChQuiz(challengeId) }, [getOneChQuiz, challengeId])

    // Question setup
    const thisChQz = chQz && chQz.oneChQuiz
    const qnsLength = thisChQz && thisChQz.questions && thisChQz.questions.length
    const chDur = thisChQz && thisChQz.duration
    const [curQnIndex, setCurQnIndex] = useState(0)
    const currentQn = thisChQz && thisChQz.questions[curQnIndex]
    const curQnOpts = currentQn && currentQn.answerOptions

    // Dealing with answers
    const trueAnsNbr = curQnOpts && curQnOpts.filter(aOpt => aOpt.isCorrect === true).length

    // Checked and User choices
    const [selected, setSelected] = useState([])
    const [checkedState, setCheckedState] = useState([])
    useEffect(() => { curQnOpts && setCheckedState(new Array(curQnOpts.length).fill(false)) }, [curQnOpts])

    const [choices, setChoices] = useState(0)
    const [curQnUsrTrueChoices, setCurQnUsrTrueChoices] = useState(0)
    useEffect(() => { selected && setChoices(selected.filter(value => value).length) }, [selected])
    useEffect(() => { selected && setCurQnUsrTrueChoices(selected.filter(value => (value === 'true')).length) }, [selected])

    // Scores & Review
    const [score, setScore] = useState(0)
    const [showScore, setShowScore] = useState(false)
    const [chToReview, setChToReview] = useState({})
    const passMark = 50
    const reviewDetails = { review: chToReview && chToReview }

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
        setChToReview({
            ...chToReview,
            id: uuidv4(),
            title: thisChQz.title,
            description: thisChQz.description,
            questions: thisChQz.questions
        })
    }

    // Going to next question
    const goToNextQuestion = (currentIndex, QuestionsLength) => {
        setSelected([])
        currentIndex + 1 < QuestionsLength ?
            setCurQnIndex(currentIndex + 1) : setShowScore(true)
    }

    if (trueAnsNbr === choices) {
        if (trueAnsNbr === curQnUsrTrueChoices) {
            setScore(score + 1)
        }
        // setCheckedState([])
        setChoices(0)
        setCurQnUsrTrueChoices(0)
    }

    if (!chQz.isLoading) {

        return (

            thisChQz ?

                qnsLength > 0 ?

                    <div key={Math.floor(Math.random() * 1000)}>
                        <Container className="main d-flex flex-column justify-content-center rounded border border-primary my-5 py-4 w-80">

                            {showScore ?
                                <ScoreSection
                                    score={score}
                                    qnsLength={qnsLength}
                                    thisChQz={thisChQz}
                                    auth={auth}
                                    toReview={reviewDetails.review}
                                    chToReview={chToReview}
                                    passMark={passMark} /> :

                                <QuestionsViewChallenge
                                    qnsLength={qnsLength}
                                    curQnIndex={curQnIndex}
                                    currentQn={currentQn}
                                    curQnOpts={curQnOpts}
                                    checkedState={checkedState}
                                    selected={selected}
                                    score={score}
                                    chDur={chDur}
                                    setShowScore={setShowScore}
                                    handleOnChange={handleOnChange}
                                    setCurQnIndex={setCurQnIndex} />
                            }

                            <Button
                                className={`mt-lg-5 ml-lg-auto ${showScore ? 'd-none' : null}`}
                                color={curQnIndex + 1 === qnsLength ? 'danger' : 'info'}
                                onClick={() => goToNextQuestion(curQnIndex, qnsLength)}>
                                {curQnIndex + 1 === qnsLength ? "End Challenge" : "Next Question"}
                            </Button>
                        </Container>

                    </div> :

                    <NoQuestions /> :

                <Unavailable title='Challenge' link='/allposts' more='challenges' />
        )
    }

    else { return (<LoadingQuestions />) }
}

const mapStateToProps = state => ({ chQz: state.challengeQuizesReducer })

export default connect(mapStateToProps, { getOneChQuiz })(TakeChallenge)