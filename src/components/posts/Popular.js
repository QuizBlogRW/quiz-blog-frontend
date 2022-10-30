import React, { useEffect, lazy } from 'react'
import { ListGroup, ListGroupItem, Badge, Card, CardImg, CardBody, CardText } from 'reactstrap'
import { connect } from 'react-redux'
import uploadimage from '../../images/avatar.svg'
import { getPopularToday, getUserOfMonth } from '../../redux/scores/scores.actions'
import SpinningBubbles from '../rLoading/SpinningBubbles';

const SquareAd = lazy(() => import('../adsenses/SquareAd'))

const Popular = ({ getPopularToday, popularQuizes, getUserOfMonth }) => {

    useEffect(() => {
        getPopularToday()
        getUserOfMonth()
    }, [getPopularToday, getUserOfMonth])

    const userOfTheMonth = popularQuizes && popularQuizes.monthlyUser && popularQuizes.monthlyUser._id

    return (

        <>
            {/* Google square ad */}
            <span className="d-block d-lg-none">
                <SquareAd />
            </span>

            <div className="popular my-2 mt-3 mt-lg-5 py-3 d-flex flex-column flex-lg-row justify-content-between">

                <div className={`w-75 mx-lg-2 ${popularQuizes && popularQuizes.popularQuizes.length > 0 ? '' : 'd-none'}`}>
                    <h6 className="text-uppercase font-weight-bold mb-3 mb-lg-4 text-center"><u>Top 3 Popular Quizes Today</u></h6>

                    {!popularQuizes.isLoading ?
                        <ListGroup numbered="true" >

                            {popularQuizes && popularQuizes.popularQuizes.map((popQz, i) => (
                                <ListGroupItem href={`/view-quiz/${popQz._id && popQz._id.slug}`} tag="a" color="success" className="d-flex justify-content-between" key={i}>
                                    <span>{i + 1}. {popQz._id && popQz._id.qTitle}</span>
                                    <Badge color="info">{popQz.count}</Badge>
                                </ListGroupItem>
                            ))}
                        </ListGroup> :
                        <SpinningBubbles title="popular quizes today" />}
                </div>

                <div className="month-user px-1 w-25">
                    <h6 className="text-uppercase font-weight-bold mb-3 mb-lg-4 text-center"><u>User of the Month</u></h6>

                    <Card className="p-0 px-1 pt-1 monthly-user">
                        <span><CardImg src={userOfTheMonth.uPhoto || uploadimage} top width="100%" /></span>
                        <hr className="m-0 mt-1" />
                        <CardBody className="p-1">
                            <CardText>
                                <small className="text-muted font-weight-bold">{userOfTheMonth && userOfTheMonth.uName}</small>
                            </CardText>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => ({ popularQuizes: state.scoresReducer })

export default connect(mapStateToProps, { getPopularToday, getUserOfMonth })(Popular)