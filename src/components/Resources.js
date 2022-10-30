import React, { useEffect } from 'react'
import { Row, Col, Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap';
import LoginModal from './auth/LoginModal'
import ReactLoading from "react-loading";
import { getResources } from '../redux/resources/resources.actions'
import img from '../images/resourceImg.svg'
import { connect } from 'react-redux'
import SpinningBubbles from './rLoading/SpinningBubbles';

const Resources = ({ auth, resources, getResources }) => {

    useEffect(() => {
        getResources()
    }, [getResources])

    return (

        auth.isAuthenticated ?

            resources.isLoading ?

                <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
                    <ReactLoading type="cylon" color="#33FFFC" />&nbsp;&nbsp;&nbsp;&nbsp; <br />
                </div> :

                <>
                    <Row className="text-center m-3 mb-1 m-lg-3 d-flex justify-content-center past-scores">
                        <h3 className="mb-0 font-weight-bolder">Useful Resources</h3>
                    </Row>

                    <Row className="mb-lg-5 px-lg-3">
                        {resources && resources.allResources.map(resource =>
                            <Col key={resource._id} sm="6" className="mt-2 resouces-card">

                                <Card className="d-flex flex-row">
                                    <CardImg top width="100%" src={img} alt="Card image cap" className="w-25 pl-1" />
                                    <CardBody className="py-3 w-75">
                                        <CardTitle tag="h6" className="text-info font-weight-bold mb-1">{resource.title}</CardTitle>
                                        <CardSubtitle tag="small" className="mb-2 text-muted font-weight-bolder">{resource.category.title}</CardSubtitle>
                                        <CardText><small>{resource.description}</small></CardText>
                                        <Button size="sm" color="success">
                                            <a href={resource.resource_file} className="text-white">Download</a></Button>
                                    </CardBody>
                                </Card>
                            </Col>)}
                    </Row> </> :

            // If not authenticated or loading
            <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
                {
                    resources.isLoading ?
                       <SpinningBubbles /> :
                        <LoginModal />
                }
            </div>
    )
}

const mapStateToProps = state => ({
    auth: state.authReducer,
    resources: state.resourcesReducer
})

export default connect(mapStateToProps, { getResources })(Resources)