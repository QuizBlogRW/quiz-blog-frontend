import React, { useEffect, useContext } from 'react'
import { Row, Col, Card, Button, CardTitle, CardText, TabPane, Alert, CardImg } from 'reactstrap'
import { Link } from "react-router-dom"
import CreateAdvert from './CreateAdvert'
import QBLoadingSM from '../../rLoading/QBLoadingSM'
import { getAdverts, changeStatus, deleteAdvert } from '../../../redux/slices/advertsSlice'
import { useSelector, useDispatch } from "react-redux"
import adImage from '../../../images/quizLogo.svg'
import { currentUserContext } from '../../../appContexts'
import DeleteModal from '../../../utils/DeleteModal'

const AdvertsTabPane = () => {

    // Redux
    const dispatch = useDispatch()
    const adverts = useSelector(state => state.adverts)
    const { isLoading, allAdverts } = adverts

    // context
    const currentUser = useContext(currentUserContext)
    const uRole = currentUser && currentUser.role

    // Lifecycle method
    useEffect(() => {
        dispatch(getAdverts())
    }, [dispatch])
 
    
    return (
        <TabPane tabId="10">

            <Button size="sm" outline color="info" className="m-3 mb-2 p-2 btn btn-warning">
                <CreateAdvert />
            </Button>

            {isLoading ?

                <QBLoadingSM title='adverts' /> :

                allAdverts && allAdverts.length < 1 ?
                    <Alert color="danger" className="w-50 text-center mx-auto" style={{ border: '2px solid #157A6E' }}>
                        No adverts created yet!
                    </Alert> :

                    <Row>
                        {allAdverts && allAdverts.map(advert => (

                            <Col sm="6" className="mt-2" key={advert._id}>
                                <Card body style={{ height: "100%" }}>

                                    <CardTitle className='mb-4 d-flex justify-content-between'>
                                        <Link to={`/advert/${advert._id}`} className="text-success text-uppercase">
                                            {advert.caption}
                                        </Link>
                                        <DeleteModal deleteFnName="deleteAdvert" deleteFn={deleteAdvert} delID={advert._id} delTitle={advert.caption} />
                                    </CardTitle>

                                    <Row style={{ fontSize: ".7rem" }}>
                                        <Col sm="4">
                                            <CardText className='my-4'>{advert.owner}</CardText>
                                            <CardText className='my-4'>{advert.email}</CardText>
                                            <CardText className='my-4'>{advert.phone}</CardText>
                                            <CardText className='my-4 text-info'><u>{advert.link ? advert.link : "No link"}</u></CardText>

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
                                        <Col sm="8">
                                            <CardImg top style={{ maxWidth: "100%", height: "auto" }}
                                                src={advert.advert_image ? advert.advert_image : adImage} alt="Card image cap" />
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