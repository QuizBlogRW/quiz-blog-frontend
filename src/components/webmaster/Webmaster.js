import React, { useState, useEffect, useContext } from 'react'
import { Row, Col, TabContent, Nav, NavItem, NavLink } from 'reactstrap'
import classnames from 'classnames'
import LoginModal from '../auth/LoginModal'
import ScoresTabPane from './ScoresTabPane'
import CategoriesTabPane from '../categories/CategoriesTabPane'
import QuizesTabPane from '../quizes/QuizesTabPane'
import UsersTabPane from '../users/UsersTabPane'
import PostCategoriesTabPane from '../blog/bPCategories/PostCategoriesTabPane'
import BlogPostsTabPane from '../blog/blogPosts/BlogPostsTabPane'
import DownloadsTabPane from './DownloadsTabPane'
import ContactsTabPane from '../contacts/ContactsTabPane'
import SpinningBubbles from '../rLoading/SpinningBubbles'
import CommentsTabPane from '../quizes/review/questionComments/CommentsTabPane'
import AdvertsTabPane from './adverts/AdvertsTabPane'
import TopRow from './TopRow.js'
import { authContext, socketContext, onlineListContext, currentUserContext } from '../../appContexts'

// NOTIFICATIONS
import { useToasts } from 'react-toast-notifications';

const Webmaster = () => {

    // Notifications
    const { addToast } = useToasts();

    // Context
    const auth = useContext(authContext)
    const socket = useContext(socketContext)
    const onlineList = useContext(onlineListContext)
    const currentUser = useContext(currentUserContext)

    // State
    const [activeTab, setActiveTab] = useState('1')

    // Lifecycle methods
    useEffect(() => {
        if (currentUser && currentUser.role === 'Visitor') {
            setActiveTab('3')
        }
    }, [currentUser])

    // Display notification if user is connected
    useEffect(() => {
        if (currentUser && currentUser.role !== 'Visitor') {
            addToast(`Welcome ${currentUser.name}!`, {
                appearance: 'success',
                autoDismiss: true,
            })

            // Receiving the last joined user
            socket.on('backJoinedUser', joinedUser => {
                if (currentUser.role !== 'Visitor') {
                    addToast(`${joinedUser.username} is online!`, {
                        appearance: 'info',
                        autoDismiss: true,
                    })
                }
            })
        }
    }, [currentUser, socket, addToast])

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab)
    }

    // render
    return (
        auth.isAuthenticated ?
            <>
                <TopRow currentUser={currentUser} socket={socket} onlineList={onlineList} />
                <Row className="m-lg-5 mx-2">
                    <Col sm="12" className="px-0 mb-4 mb-sm-0 d-flex justify-content-around">

                        <Nav tabs className="webmaster-navbar d-block d-sm-flex mb-0 mb-lg-5 p-2 border rounded border-success bg-light text-uppercase font-weight-bolder">

                            {
                                // If the user is Admin or Creator
                                currentUser.role !== 'Visitor' ?
                                    <>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: activeTab === '1' })}
                                                onClick={() => { toggle('1') }}>
                                                <u>Categories</u>
                                            </NavLink>
                                        </NavItem>

                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: activeTab === '2' })}
                                                onClick={() => { toggle('2') }}>
                                                <u>Quizes</u>
                                            </NavLink>
                                        </NavItem>
                                    </> : null}

                            <NavItem>
                                <NavLink
                                    className={classnames({ active: activeTab === '3' })}
                                    onClick={() => { toggle('3') }}>
                                    <u>Scores</u>
                                </NavLink>
                            </NavItem>

                            <NavItem>
                                <NavLink
                                    className={classnames({ active: activeTab === '4' })}
                                    onClick={() => { toggle('4') }}>
                                    <u>Downloads</u>
                                </NavLink>
                            </NavItem>

                            <NavItem>
                                <NavLink
                                    className={classnames({ active: activeTab === '5' })}
                                    onClick={() => { toggle('5') }}>
                                    <u>Contacts</u>
                                </NavLink>
                            </NavItem>

                            { // CAUSING PROBLEMS WHEN VISITOR IS LOGGED IN
                                currentUser.role !== 'Visitor' ?
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: activeTab === '7' })}
                                            onClick={() => { toggle('7') }}>
                                            <u>BP Categories</u>
                                        </NavLink>
                                    </NavItem> : null}

                            <NavItem>
                                <NavLink
                                    className={classnames({ active: activeTab === '8' })}
                                    onClick={() => { toggle('8') }}>
                                    <u>Blog Posts</u>
                                </NavLink>
                            </NavItem>

                            {
                                // Admin only
                                currentUser.role === 'Admin' || currentUser.role === 'SuperAdmin' ?
                                    <>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: activeTab === '6' })}
                                                onClick={() => { toggle('6') }}>
                                                <u>Users</u>
                                            </NavLink>
                                        </NavItem>

                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: activeTab === '9' })}
                                                onClick={() => { toggle('9') }}>
                                                <u>Comments</u>
                                            </NavLink>
                                        </NavItem>

                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: activeTab === '10' })}
                                                onClick={() => { toggle('10') }}>
                                                <u>Adverts</u>
                                            </NavLink>
                                        </NavItem>

                                    </> : null
                            }

                        </Nav>
                    </Col>

                    <Col sm="12" className="px-0">
                        <TabContent activeTab={activeTab}>

                            {currentUser.role !== 'Visitor' ?
                                <>
                                    <CategoriesTabPane />
                                    <QuizesTabPane />
                                </> : null}

                            {/* Any user authenticated */}
                            <ScoresTabPane />
                            <DownloadsTabPane />
                            <ContactsTabPane />

                            { // CAUSING PROBLEMS WHEN VISITOR IS LOGGED IN
                                currentUser.role !== 'Visitor' ?
                                    <PostCategoriesTabPane /> : null}

                            <BlogPostsTabPane />

                            {currentUser.role === 'Admin' || currentUser.role === 'SuperAdmin' ?
                                <>
                                    <UsersTabPane />
                                    <CommentsTabPane />
                                    <AdvertsTabPane />
                                </> : null}
                        </TabContent>
                    </Col>

                </Row>
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
    )
}

export default Webmaster