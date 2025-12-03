import { useState, useEffect } from 'react';
import { Row, Col, TabContent, Nav, NavItem, NavLink } from 'reactstrap';
import { useSelector } from 'react-redux';
import classnames from 'classnames';

import TopRow from './utils/TopRow';
import SystemDashboard from './statistics/SystemDashboard';
import NotAuthenticated from '@/components/users/NotAuthenticated';
import UsersTabPane from './users/UsersTabPane';
import QuizzesTabPane from './quizzing/quizzes/QuizzesTabPane';
import ScoresTabPane from '@/components/dashboard/scores/ScoresTabPane';
import SchoolsTabPane from '@/components/dashboard/schools/SchoolsTabPane';
import CategoriesTabPane from './quizzing/categories/CategoriesTabPane';
import PostCategoriesTabPane from './posts/blog/PostCategoriesTabPane';
import BlogPostsTabPane from './posts/blog/BlogPostsTabPane';
import DownloadsTabPane from './downloads/DownloadsTabPane';
import CommentsTabPane from './comments/CommentsTabPane';
import CommunicationsTabPane from './posts/adverts/CommunicationsTabPane';

const Dashboard = () => {

    const { user, isAuthenticated } = useSelector(state => state.users);
    const [activeTab, setActiveTab] = useState(localStorage.getItem('activeTab') || '1');

    // Lifecycle methods
    useEffect(() => {
        if (user && user.role === 'Visitor') {
            setActiveTab('4');
        }
    }, [user]);

    const toggle = tab => {
        if (activeTab !== tab) {
            setActiveTab(tab);
            localStorage.setItem('activeTab', tab);
        }
    };

    if (!isAuthenticated) return <NotAuthenticated />;
    return (<>
        <TopRow />
        <Row className="m-lg-5 mx-2">
            <Col sm="12" className="px-0 mb-4 mb-sm-0 d-flex justify-content-around">
                <Nav tabs className="dashboard-navbar d-block d-sm-flex mb-0 mb-lg-5 p-2 border rounded border-success bg-light text-uppercase fw-bolder">
                    {
                        // If the user is Admin or Creator
                        user.role !== 'Visitor' ?
                            <>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: activeTab === '1' })}
                                        onClick={() => { toggle('1'); }}>
                                        <u>Categories</u>
                                    </NavLink>
                                </NavItem>

                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: activeTab === '2' })}
                                        onClick={() => { toggle('2'); }}>
                                        <u>Quizzes</u>
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: activeTab === '3' })}
                                        onClick={() => { toggle('3'); }}>
                                        <u>Schools</u>
                                    </NavLink>
                                </NavItem>
                            </> : null}

                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === '4' })}
                            onClick={() => { toggle('4'); }}>
                            <u>Scores</u>
                        </NavLink>
                    </NavItem>

                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === '5' })}
                            onClick={() => { toggle('5'); }}>
                            <u>Downloads</u>
                        </NavLink>
                    </NavItem>

                    { // When not a visitor
                        user.role !== 'Visitor' ?
                            <>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: activeTab === '6' })}
                                        onClick={() => { toggle('6'); }}>
                                        <u>BP Categories</u>
                                    </NavLink>
                                </NavItem>

                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: activeTab === '7' })}
                                        onClick={() => { toggle('7'); }}>
                                        <u>Blog Posts</u>
                                    </NavLink>
                                </NavItem> </> : null}

                    {
                        // Admin only
                        user.role?.includes('Admin') ?
                            <>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: activeTab === '8' })}
                                        onClick={() => { toggle('8'); }}>
                                        <u>Users</u>
                                    </NavLink>
                                </NavItem>

                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: activeTab === '9' })}
                                        onClick={() => { toggle('9'); }}>
                                        <u>Comments</u>
                                    </NavLink>
                                </NavItem>

                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: activeTab === '10' })}
                                        onClick={() => { toggle('10'); }}>
                                        <u>Communications</u>
                                    </NavLink>
                                </NavItem>

                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: activeTab === '11' })}
                                        onClick={() => { toggle('11'); }}>
                                        <u>System</u>
                                    </NavLink>
                                </NavItem>

                            </> : null
                    }
                </Nav>
            </Col>

            <Col sm="12" className="px-0">
                <TabContent activeTab={activeTab}>

                    {user.role !== 'Visitor' ?
                        <>
                            <CategoriesTabPane />
                            <QuizzesTabPane />
                            <SchoolsTabPane />
                        </> : null}

                    {/* Any authenticated user */}
                    <ScoresTabPane />
                    <DownloadsTabPane />

                    { // When not a visitor
                        user.role !== 'Visitor' ?
                            <>
                                <PostCategoriesTabPane />
                                <BlogPostsTabPane />
                            </> : null}

                    { // Admins only
                        user.role?.includes('Admin') ?
                            <>
                                <UsersTabPane />
                                <CommentsTabPane />
                                <CommunicationsTabPane />
                                <div className={activeTab === '11' ? 'd-block' : 'd-none'}>
                                    <SystemDashboard />
                                </div>
                            </> : null}
                </TabContent>
            </Col>
        </Row>
    </>);
};

export default Dashboard;
