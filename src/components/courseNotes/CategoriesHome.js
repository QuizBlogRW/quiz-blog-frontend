import React, { lazy, Suspense, useContext } from 'react'
import { Jumbotron, Button, Spinner } from 'reactstrap'
import LoginModal from '../auth/LoginModal'
import SpinningBubbles from '../rLoading/SpinningBubbles'
import { authContext, currentUserContext } from '../../appContexts'

const GridMultiplex = lazy(() => import('../adsenses/GridMultiplex'))

const CategoriesHome = () => {

    const auth = useContext(authContext)
    const currentUser = useContext(currentUserContext)

    return (
        auth.isAuthenticated ?
            <>
                <Jumbotron className="mx-3 d-flex justify-content-center align-items-center flex-column">
                    <h3 className="font-weight-bold my-lg-4 categories-home-head">Hello, {currentUser && currentUser ? currentUser.name : ''}!</h3>

                    <p className="lead">
                        Discover the user-friendly courses and resource portal at Quiz-Blog, where you can access a vast array of valuable information to enhance your learning and achieve academic success.
                    </p>

                    <hr className="" />

                    <p className="text-muted">
                        With its well-organized categories, you can seamlessly choose the content you require through the navigation, making it effortless to access and download any resource, thus enhancing your overall learning experience.
                    </p>

                    <p style={{ color: "#157A6E" }} className="font-weight-bolder my-4">
                        <center>
                            It does not matter where you go and what you study, what matters most is what you share with yourself and the world. <br />
                            <small className="text-info">
                                <i><b>- Santosh Kalwar</b></i></small>
                        </center>
                    </p>

                    <p className="share-text my-5 text-center">
                        <i className="fa fa-share-alt"></i> &nbsp;
                        So, if you find this interesting, please don't forget to share it with your friends via social media or any other means you prefer.&nbsp;
                        <Button color="success" className="ml-1 py-1 px-2 mb-0 share-btn">
                            <i className="fa fa-whatsapp"></i>&nbsp;
                            <a className="text-white" href={`https://api.whatsapp.com/send?phone=whatsappphonenumber&text=View course notes shared by Quiz-Blog by logging on
                        \nhttps://www.quizblog.rw/course-notes`}>Share</a>
                        </Button>
                    </p>
                </Jumbotron>

                {/* GridMultiplex Ad in a Suspense */}
                <Suspense fallback={<div className="p-3 m-3 d-flex justify-content-center align-items-center">
                    <Spinner style={{ width: '5rem', height: '5rem' }} />{' '}
                </div>}>
                    <GridMultiplex />
                </Suspense>


            </> :

            // If not authenticated or loading
            <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
                {
                    auth.isLoading ?
                        <SpinningBubbles /> :
                        <LoginModal
                            textContent={'Login first'}
                            textColor={'text-danger font-weight-bolder my-5 border rounded'} />
                }
            </div>
    );
};

export default CategoriesHome;