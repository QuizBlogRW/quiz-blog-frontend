import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import ReactLoading from "react-loading";
import LoginModal from '../auth/LoginModal'
import { Row, Col, Toast, ToastBody, ToastHeader } from 'reactstrap';
import { connect } from 'react-redux'
// import { PDFDownloadLink } from "@react-pdf/renderer";
// import PdfDocument from "./PdfDocument";
import { getTakerScores } from '../../redux/scores/scores.actions'
import SpinningBubbles from '../rLoading/SpinningBubbles';
import moment from 'moment'

const ReportsAdmin = ({ auth, scores, getTakerScores }) => {

    const acScores = scores && scores.takerScores
    const currentUser = auth && auth.user

    useEffect(() => {
        if (currentUser) {
            if (currentUser.role === 'Admin' || currentUser.role === 'Creator') {
                getTakerScores(currentUser._id)
            }
            else {
                // Redirect to home
                alert('You are not allowed to view this!')
                window.location.href = "/"
            }
        }
    }, [getTakerScores, currentUser]);

    return (

        auth.isAuthenticated ?

            !scores.isLoading ?

                <>
                    <Row className="text-center m-3 mb-1 m-lg-5 d-flex justify-content-center past-scores">
                        <h3 className="mb-0 font-weight-bolder">Your past scores</h3>
                    </Row>

                    <Row className="mx-0 mb-4">

                        {acScores && acScores.map(score => (

                            <Col sm="3" key={score._id} className="px-2 mt-2 admin-toast">
                                <Toast>
                                    <ToastHeader className="text-success">
                                        <strong>{score.quiz && score.quiz.title}</strong>&nbsp;
                                        <small className="d-flex align-items-center">
                                            ({score.category && score.category.title})
                                        </small>
                                    </ToastHeader>

                                    <ToastBody>
                                        {score.review && score.review.questions.length > 0 ?

                                            <Link to={`/review-quiz/${score.id}`} className="font-weight-bold text-info">
                                                Review answers
                                            </Link> :
                                            <p className="text-danger">Review unavailable!</p>}

                                        <p className="mt-1">Score:&nbsp;
                                            <strong className="text-warning">
                                                {score.marks}/{score.out_of}
                                            </strong>
                                        </p>

                                        {currentUser.role === 'Admin' ?
                                            // <PDFDownloadLink
                                            //     document={<PdfDocument review={score.review} />}
                                            //     fileName={`${score.review.title && score.review.title.split(' ').join('-')}.pdf`}
                                            //     style={{
                                            //         textDecoration: "none",
                                            //         padding: "3px 5px",
                                            //         color: "white",
                                            //         backgroundColor: "#157a6e",
                                            //         border: "1px solid #ffc107",
                                            //         borderRadius: "4px",
                                            //         display: "block",
                                            //         width: "fit-content"
                                            //     }}
                                            // >
                                            //     {({ blob, url, loading, error }) =>
                                            //         loading ? 'Preparing document...' : 'Download pdf'
                                            //     }
                                            // </PDFDownloadLink> 
                                            <p>Not available</p>
                                            
                                            : null}

                                        <small className="text-center">
                                            On {moment(new Date(score.test_date))
                                                    .format('YYYY-MM-DD, HH:MM')}
                                        </small>
                                    </ToastBody>
                                </Toast>

                            </Col>
                        ))}

                    </Row></> :

                <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
                    <ReactLoading type="cylon" color="#33FFFC" />&nbsp;&nbsp;&nbsp;&nbsp; <br />
                </div> :

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

// Map  state props
const mapStateToProps = state => ({
    scores: state.scoresReducer
});

export default connect(mapStateToProps, { getTakerScores })(ReportsAdmin)