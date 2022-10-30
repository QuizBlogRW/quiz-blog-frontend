import React, { useEffect } from 'react'
import ReactLoading from "react-loading"
import LoginModal from '../auth/LoginModal'
import Webmaster from '../webmaster/Webmaster'
import { Link, useParams } from 'react-router-dom'
import { Row, Table, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import { connect } from 'react-redux'
import { setRankingScores } from '../../redux/scores/scores.actions'
import SpinningBubbles from '../rLoading/SpinningBubbles'
import AddVideo from './AddVideo'

const QuizRanking = ({ auth, scores, setRankingScores }) => {

    const { quizID } = useParams()
    const currentUser = auth && auth.user

    useEffect(() => {
        setRankingScores(quizID)
    }, [setRankingScores, quizID])

    const rankings = scores && scores.rankingScores
    const cTitle = rankings[0] && rankings[0].category && rankings[0].category.title
    const qTitile = rankings[0] && rankings[0].quiz && rankings[0].quiz.title

    var i = 1;

    return (

        auth.isAuthenticated ?

            currentUser.role !== 'Visitor' ?
                <>
                        <div className="mt-5 mx-5 single-category">
                            <Row className="mb-0 mb-lg-3 mx-0 d-flex justify-content-around align-items-center">
                                <Breadcrumb>
                                    <BreadcrumbItem>
                                    <Link to="/webmaster">{cTitle && cTitle}</Link>
                                    </BreadcrumbItem>
                                <BreadcrumbItem active>{qTitile && qTitile}&nbsp; - Ranking</BreadcrumbItem>
                                </Breadcrumb>

                            {currentUser && currentUser.role === 'Admin' ?
                                <AddVideo quizID={quizID}/> : null}

                            </Row>
                        </div>
                    <Row className="mx-2 mx-lg-5">

                        {scores.isLoading ?
                            <div className="d-flex justify-content-center align-items-center" style={{ height: "40vh" }}>
                                <ReactLoading type="spinningBubbles" color="#33FFFC" />
                            </div> :

                            currentUser && currentUser.role === 'Admin' ?

                                <Table hover responsive>

                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Quiz Name</th>
                                            <th>Marks</th>
                                            <th>Out of</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {rankings && rankings.map(rank => (

                                            rank && rank.quiz && quizID === rank.quiz._id ?
                                                <tr key={rank._id}>
                                                    <th scope="row">{i++}</th>
                                                    <td>{rank.taken_by ? rank.taken_by.name : 'No name'}</td>
                                                    <td>{rank.taken_by ? rank.taken_by.email : 'No mail'}</td>
                                                    <td>{rank.quiz.title}</td>
                                                    <td>{rank.marks}</td>
                                                    <td>{rank.out_of}</td>
                                                </tr> : null))}
                                    </tbody>
                                </Table> :
                                <p className="d-block text-danger text-uppercase font-weight-bolder vh-100">
                                    You are not allowed to view this ...
                                    </p>
                        }

                    </Row>
                </> :
                <Webmaster auth={auth} /> :

            // If not authenticated or loading
            <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
                {
                    auth.isLoading ?
                        <SpinningBubbles /> :
                        <LoginModal
                            textContent={'Login first'}
                            textColor={'text-danger font-weight-bolder my-5 border rounded'}
                            isAuthenticated={auth.isAuthenticated} />
                }
            </div>
    )
}

const mapStateToProps = state => ({
    error: state.errorReducer,
    scores: state.scoresReducer
})

export default connect(mapStateToProps, { setRankingScores })(QuizRanking)