import React, { useEffect } from 'react'
import { Row, Alert } from 'reactstrap'
import { connect } from 'react-redux'
import { getChQuizes, deleteChQuiz } from '../../../redux/challenges/challengeQuizzes/challengeQuizzes.actions'
import LoginModal from '../../auth/LoginModal'
import SpinningBubbles from '../../rLoading/SpinningBubbles'
import ChallengesTable from './ChallengesTable'

const Challenges = ({ auth, chQuizzes, getChQuizes, deleteChQuiz, categories }) => {

    const chQuizzesToUse = chQuizzes && chQuizzes.allChQuizzes

    // Lifecycle methods
    useEffect(() => {
        getChQuizes()
    }, [getChQuizes])
    const isAuthenticated = auth && auth.isAuthenticated
    const userLoading = auth && auth.isLoading
    const currentUser = auth && auth.user
    const curUserRole = currentUser && currentUser.role

    return (
        !isAuthenticated ?

            // If not authenticated or loading
            <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
                {
                    userLoading ?
                        <SpinningBubbles title='subscribers' /> :
                        <LoginModal
                            textContent={'Login first to access subscribers'}
                            textColor={'text-danger font-weight-bolder my-5 border rounded'}
                            isAuthenticated={isAuthenticated} />
                }
            </div> :
            curUserRole === 'Admin' ?
                <div className='mx-4 my-5'>

                    {chQuizzes.isLoading ?
                        <SpinningBubbles title='quizzes' /> :

                        <Row>
                            <ChallengesTable
                                chQuizzesToUse={chQuizzesToUse}
                                deleteChQuiz={deleteChQuiz}
                                categories={categories}
                                currentUser={currentUser} />
                        </Row>
                    }

                </div> : <Alert color="danger">Access Denied!</Alert>
    )
}

const mapStateToProps = state => ({
    chQuizzes: state.challengeQuizesReducer
})

export default connect(mapStateToProps, { getChQuizes, deleteChQuiz })(Challenges)