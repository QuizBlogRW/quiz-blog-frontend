import React, { useEffect, useState, lazy, Suspense } from 'react'
import { Col, Row, Button, Spinner } from 'reactstrap'
import ReactLoading from "react-loading"
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getChQuizes } from '../../../redux/challenges/challengeQuizzes/challengeQuizzes.actions'

const ResponsiveAd = lazy(() => import('../../adsenses/ResponsiveAd'))
const SquareAd = lazy(() => import('../../adsenses/SquareAd'))
const Challenge = lazy(() => import('./Challenge'))

const Challenges = ({ getChQuizes, chQz }) => {

    const [limit] = useState(10)
    const chAllQzs = chQz && chQz.allChQuizzes
    const chFistLen = chAllQzs && chAllQzs[0] && chAllQzs[0].questions && chAllQzs[0].questions.length

    // Lifecycle methods
    useEffect(() => {
        getChQuizes(limit)
    }, [getChQuizes, limit])

    return (

        chFistLen > 5 ?
            <>
                <Row sm="12" className="px-1 px-lg-4 my-1">
                    {/* Google responsive 1 ad */}
                    <ResponsiveAd />
                </Row>

                <Row className="m-1 m-sm-3 p-1 px-sm-5 challenges">

                    {/* <Col sm="8" className="px-1 px-lg-4 mt-md-2"> */}
                    <Col sm="12" className="px-0 px-sm-5">
                        <h3 className="mt-0 mt-lg-3 pt-4 py-lg-3 text-danger text-center font-weight-bold">CHALLENGES</h3>

                        {chQz.isLoading ?
                            <div className="p-5 m-5 d-flex justify-content-center align-items-center">
                                <ReactLoading type="spokes" color="#33FFFC" />
                            </div> :
                            <>
                                {chAllQzs && chAllQzs
                                    .map(chall => (
                                        <Suspense key={chall._id} fallback={<div className="p-3 m-3 d-flex justify-content-center align-items-center">
                                            <Spinner style={{ width: '8rem', height: '8rem' }} />
                                        </div>}>
                                            <Challenge chall={chall} />
                                        </Suspense>
                                    ))}

                                {/* All challenges */}
                                <div className="mt-sm-5 mb-sm-4 d-flex justify-content-center">
                                    <Link to="/all-challenges">
                                        <Button outline color="warning" className='view-all-btn'>
                                            View all challenges
                                        </Button>
                                    </Link>
                                </div>
                            </>
                        }
                    </Col>
                </Row>
                <Row className="my-1">
                    {/* Google square ad */}
                    <SquareAd />
                </Row>
            </> : null
    )
}

const mapStateToProps = state => ({
    chQz: state.challengeQuizesReducer
})

export default connect(mapStateToProps, { getChQuizes })(Challenges)