import React, { useEffect, Suspense } from 'react'
import { Col, Row, Spinner } from 'reactstrap'
import ReactLoading from "react-loading"
import { connect } from 'react-redux'
import { getChQuizes } from '../../../redux/challenges/challengeQuizzes/challengeQuizzes.actions'

import ResponsiveAd from '../../adsenses/ResponsiveAd'
import SquareAd from '../../adsenses/SquareAd'
import Challenge from '../../posts/challenges/Challenge'

const AllChallenges = ({ getChQuizes, chQz }) => {

    // Lifecycle methods
    useEffect(() => {
        getChQuizes()
    }, [getChQuizes])

    return (

        <>
            <Row sm="12" className="px-1 px-lg-4 my-1 w-100">
                {/* Google responsive 1 ad */}
                <div className='w-100'>
                    <ResponsiveAd />
                </div>
            </Row>

            <Row className="m-1 m-sm-3 p-1 px-sm-5 challenges">

                {/* <Col sm="8" className="px-1 px-lg-4 mt-md-2"> */}
                <Col sm="12" className="px-0 px-sm-5">
                    <h3 className="mt-0 mt-lg-3 pt-4 py-lg-3 text-danger text-center font-weight-bold">ALL CHALLENGES</h3>

                    {chQz.isLoading ?
                        <div className="p-5 m-5 d-flex justify-content-center align-items-center">
                            <ReactLoading type="spokes" color="#33FFFC" />
                        </div> :
                        <>
                            {chQz && chQz.allChQuizzes
                                .map(chall => (
                                    <Suspense key={chall._id} fallback={<div className="p-3 m-3 d-flex justify-content-center align-items-center">
                                        <Spinner style={{ width: '8rem', height: '8rem' }} />
                                    </div>}>
                                        <Challenge chall={chall} />
                                    </Suspense>
                                ))}
                        </>
                    }
                </Col>
            </Row>
            <Row className='w-100'>
                <Col sm="12" className='w-100'>
                    <SquareAd />
                </Col>
            </Row>
        </>
    )
}

const mapStateToProps = state => ({
    chQz: state.challengeQuizesReducer
})

export default connect(mapStateToProps, { getChQuizes })(AllChallenges)