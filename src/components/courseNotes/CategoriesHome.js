import React from 'react';
import { Jumbotron, Button } from 'reactstrap'
import LoginModal from '../auth/LoginModal'
import SpinningBubbles from '../rLoading/SpinningBubbles';

const CategoriesHome = ({ auth }) => {

    return (
        auth.isAuthenticated ?

            <Jumbotron className="mx-3">
                <h3 className="font-weight-bold mb-lg-4 categories-home-head">Hello, {auth.user && auth.user ? auth.user.name : ''}!</h3>

                <p className="lead">This is Quiz Blog simple courses and resources portal, a nice way to explore different resources that can give you enough information related to your learning and your course success.</p>
                <hr className="my-2" />
                <p className="text-muted">It is divided into categories, according to what you need you can choose from the navigation and start viewing and downloading any resource you need to learn from.</p>

                <p style={{ color: "#157A6E" }}>It does not matter where you go and what you study, what matters most is what you share with yourself and the world. <br />
                    <small className="text-info"><i><b>- Santosh Kalwar</b></i></small></p>

                <p className="font-weight-bolder share-text">
                    <i className="fa fa-share-alt"></i> &nbsp;
                    So, if you find this interesting, please don't forget share it with your friends via &nbsp;
                    <Button color="success" className="ml-1 py-1 px-2 mb-0 share-btn">
                        <i className="fa fa-whatsapp"></i>&nbsp;
                        <a className="text-white" href={`https://api.whatsapp.com/send?phone=whatsappphonenumber&text=View course notes shared by Quiz Blog by logging on
                        \nhttps://www.quizblog.rw/course-notes`}>Share</a>
                    </Button>
                </p>
            </Jumbotron> :

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
    );
};

export default CategoriesHome;