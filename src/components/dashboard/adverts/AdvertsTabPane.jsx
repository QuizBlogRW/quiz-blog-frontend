import React, { useEffect, useContext } from 'react'
import { Row, Col, Card, Button, CardTitle, CardText, TabPane, Alert, CardImg } from 'reactstrap'
import { Link } from "react-router-dom"
import CreateAdvert from './CreateAdvert'
import QBLoadingSM from '../../rLoading/QBLoadingSM'
import { clearErrors } from '../../../redux/slices/errorSlice'
import { clearSuccess } from '../../../redux/slices/successSlice'
import { getAdverts, changeStatus, deleteAdvert } from '../../../redux/slices/advertsSlice'
import { useSelector, useDispatch } from "react-redux"
import adImage from '../../../images/quizLogo.svg'
import { currentUserContext } from '../../../appContexts'
import DeleteModal from '../../../utils/DeleteModal'

const AdvertsTabPane = () => {

    // Redux
    const dispatch = useDispatch()
    const adverts = useSelector(state => state.adverts)

    // context
    const currentUser = useContext(currentUserContext)

    const allAdverts = adverts && adverts.allAdverts
    const uRole = currentUser && currentUser.role

    // Lifecycle method
    useEffect(() => {
        dispatch(getAdverts())
    }, [dispatch])

    return (
        <TabPane tabId="10">

            <Button size="sm" outline color="info" className="m-3 mb-2 p-2 btn btn-warning">
                <CreateAdvert clearErrors={clearErrors} clearSuccess={clearSuccess} />
            </Button>

            {adverts.isLoading ?

                <QBLoadingSM title='adverts' /> :

                allAdverts && allAdverts.length < 1 ?
                    <Alert color="danger" className="w-50 text-center mx-auto" style={{ border: '2px solid #157A6E' }}>
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
                                        <DeleteModal deleteFnName="deleteAdvert" deleteFn={deleteAdvert} delID={advert._id} delTitle={advert.caption} />
                                    </CardTitle>

                                    <Row style={{ fontSize: ".7rem" }}>
                                        <Col sm="6">
                                            <CardText className='my-4'>{advert.owner}</CardText>
                                            <CardText className='my-4'>{advert.email}</CardText>
                                            <CardText className='my-4'>{advert.phone}</CardText>

                                            {uRole === "SuperAdmin" || uRole === "Admin" ?
                                                <span>
                                                    <Button color={`${advert.status === "Active" ? 'danger' : 'success'}`} className='mx-1 text-white text-uppercase'
                                                        onClick={() => dispatch(changeStatus({
                                                            advertID: advert && advert._id,
                                                            status: advert.status === "Active" ? "Inactive" : "Active"
                                                        }))}>
                                                        {advert.status === "Active" ? "Deactivate" : "Activate"}
                                                    </Button>
                                                </span>
                                                : null}
                                        </Col>

                                        <Col sm="6">
                                            <CardImg top width="20px" src={advert.advert_image ? advert.advert_image : adImage} alt="Card image cap" />
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

export default AdvertsTabPane