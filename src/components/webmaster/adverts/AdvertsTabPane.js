import React, { useEffect } from 'react'
import { Row, Col, Card, Button, CardTitle, CardText, TabPane, Alert, CardImg } from 'reactstrap'
import { Link } from "react-router-dom"
// import EditAdvert from './EditAdvert'
import DeleteAdvert from './DeleteAdvert'
import CreateAdvert from './CreateAdvert'
import SpinningBubbles from '../../rLoading/SpinningBubbles'
import { clearErrors } from '../../../redux/error/error.actions'
import { clearSuccess } from '../../../redux/success/success.actions'
import { connect } from 'react-redux'
import { getAdverts } from '../../../redux/adverts/adverts.actions'

const AdvertsTabPane = ({ auth, adverts, getAdverts }) => {

    const allAdverts = adverts && adverts.allAdverts

    // Lifecycle method
    useEffect(() => {
        getAdverts()
    }, [getAdverts])

    return (
        <TabPane tabId="10">

            <Button size="sm" outline color="info" className="m-3 mb-2 p-2 btn btn-warning">
                <CreateAdvert auth={auth} clearErrors={clearErrors} clearSuccess={clearSuccess} />
            </Button>

            {adverts.isLoading ?

                <SpinningBubbles title='adverts' /> :

                allAdverts && allAdverts.length < 1 ?
                    <Alert color="danger" className="w-100 text-center">
                        No adverts created yet!
                    </Alert> :

                    <Row>
                        {allAdverts && allAdverts.map(advert => (

                            <Col sm="6" className="mt-2" key={advert._id}>
                                <Card body>

                                    <CardTitle className='mb-4 d-flex justify-content-between'>
                                        <Link to={`/advert/${advert._id}`} className="text-success text-uppercase">
                                            {advert.caption}
                                        </Link>

                                        <Button size="sm" color="link" className="mx-2" >
                                            <DeleteAdvert
                                                advertCaption={advert.caption}
                                                advertID={advert._id} />
                                        </Button>
                                    </CardTitle>

                                    <Row style={{fontSize: ".7rem"}}>
                                        <Col sm="6">
                                            <CardText className='my-4'>{advert.owner}</CardText>
                                            <CardText className='my-4'>{advert.email}</CardText>
                                            <CardText className='my-4'>{advert.phone}</CardText>
                                        </Col>
                                        <Col sm="6">
                                            <CardImg top width="20px" src={advert && advert.advert_image} alt="Card image cap" />
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        ))}
                    </Row>
            }

        </TabPane>
    )
}

const mapStateToProps = state => ({
    errors: state.errorReducer,
    successful: state.successReducer,
    adverts: state.advertsReducer
})

export default connect(mapStateToProps, { getAdverts, clearErrors, clearSuccess })(AdvertsTabPane)