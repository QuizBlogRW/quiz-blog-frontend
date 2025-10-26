import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Card, CardBody, Alert, Spinner, TabContent, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import './SystemDashboard.css';
import { toggle } from './utils';
import DatabaseMetricsTab from './DatabaseMetricsTab';
import SystemMetricsTab from './SystemMetricsTab';

const SystemDashboard = () => {

    const { user, isAuthenticated } = useSelector(state => state.auth);
    const [dashboardStats, setDashboardStats] = useState(null);

    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [activeTab, setActiveTab] = useState('1');
    const [lastUpdated, setLastUpdated] = useState(null);

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        // Only fetch data if user is authenticated and has admin role
        if (isAuthenticated && user && (user.role === 'Admin' || user.role === 'SuperAdmin')) {
            fetchAllMetrics();

            // Auto-refresh every 30 seconds
            const interval = setInterval(fetchAllMetrics, 60000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated, user]);

    const fetchAllMetrics = async () => {

        // Double-check authentication
        if (!isAuthenticated || !user || (user.role !== 'Admin' && user.role !== 'SuperAdmin')) {
            setFetchError('Access denied. Admin privileges required.');
            return;
        }

        try {
            setLoading(true);

            // Use existing endpoints - prioritize working ones
            const dashRes = await axios.get(`${apiUrl}/api/statistics/dashboard-stats`);

            if (dashRes.status === 200 && dashRes.data) {
                setDashboardStats(dashRes.data);
                setFetchError(null);
            }

            setLastUpdated(new Date().toLocaleTimeString());
        } catch (err) {
            console.error('Error fetching metrics:', err);
            setFetchError('Failed to fetch system metrics! Check statistics logs for error.');
            setLastUpdated(new Date().toLocaleTimeString());
        } finally {
            setLoading(false);
        }
    };

    if (loading && !dashboardStats) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <Spinner color="primary" size="sm" />
                <span className="ms-3">Loading system statistics...</span>
            </div>
        );
    }

    // Check authentication and role before rendering
    if (!isAuthenticated || !user) {
        return (
            <div className="system-dashboard p-4">
                <Alert color="warning">
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Please log in to access the System Dashboard.
                </Alert>
            </div>
        );
    }

    if (user.role !== 'Admin' && user.role !== 'SuperAdmin') {
        return (
            <div className="system-dashboard p-4">
                <Alert color="danger">
                    <i className="fas fa-shield-alt me-2"></i>
                    Access denied. Admin privileges required to view the System Dashboard.
                </Alert>
            </div>
        );
    }

    return (
        <div className="system-dashboard p-4">
            <Row className="mb-4">
                <Col>
                    <div className="d-flex justify-content-between align-items-center">
                        <h2 className="text-primary">
                            <i className="fas fa-tachometer-alt me-2"></i>
                            System Dashboard
                        </h2>
                        <div className="text-muted">
                            Last updated: {lastUpdated}
                            <button className="btn btn-sm btn-outline-primary ms-2" onClick={fetchAllMetrics} disabled={loading}>
                                <i className="fas fa-sync-alt"></i> Refresh
                            </button>
                        </div>
                    </div>
                </Col>
            </Row>

            {fetchError && (
                <Alert color={fetchError.includes('Note:') ? 'warning' : 'danger'} className="mb-4">
                    <i className={`fas ${fetchError.includes('Note:') ? 'fa-info-circle' : 'fa-exclamation-triangle'} me-2`}></i>
                    {fetchError}
                </Alert>
            )}

            {/* Overview Cards */}
            {dashboardStats && (
                <Row className="mb-4">
                    <Col lg="3" md="6" className="mb-3">
                        <Card className="border-left-primary h-100" onClick={
                            // redirect to users page
                            () => window.location.href = '/statistics/new-50-users'
                        } style={{ cursor: 'pointer' }}>
                            <CardBody>
                                <div className="d-flex align-items-center">
                                    <div>
                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                            Total Users
                                        </div>
                                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                                            {dashboardStats.totalUsers?.toLocaleString() || 0}
                                        </div>
                                    </div>
                                    <div className="ms-auto">
                                        <i className="fas fa-users fa-2x text-gray-300"></i>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg="3" md="6" className="mb-3">
                        <Card className="border-left-success h-100" onClick={
                            // redirect to quizzes page
                            () => window.location.href = '/statistics/top-10-quizzes'
                        } style={{ cursor: 'pointer' }}>
                            <CardBody>
                                <div className="d-flex align-items-center">
                                    <div>
                                        <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                            Total Quizzes
                                        </div>
                                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                                            {dashboardStats.totalQuizzes?.toLocaleString() || 0}
                                        </div>
                                    </div>
                                    <div className="ms-auto">
                                        <i className="fas fa-question-circle fa-2x text-gray-300"></i>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg="3" md="6" className="mb-3">
                        <Card className="border-left-warning h-100" onClick={
                            // redirect to downloads page
                            () => window.location.href = '/statistics/top-10-notes'
                        } style={{ cursor: 'pointer' }}>
                            <CardBody>
                                <div className="d-flex align-items-center">
                                    <div>
                                        <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                            Total Downloads
                                        </div>
                                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                                            {dashboardStats.totalDownloads?.toLocaleString() || 0}
                                        </div>
                                    </div>
                                    <div className="ms-auto">
                                        <i className="fas fa-download fa-2x text-gray-300"></i>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg="3" md="6" className="mb-3">
                        <Card className="border-left-info h-100" onClick={
                            // redirect to scores page
                            () => window.location.href = '/statistics/top-10-quizzing-users'
                        } style={{ cursor: 'pointer' }}>
                            <CardBody>
                                <div className="d-flex align-items-center">
                                    <div>
                                        <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                                            Total Scores
                                        </div>
                                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                                            {dashboardStats.totalScores?.toLocaleString() || 0}
                                        </div>
                                    </div>
                                    <div className="ms-auto">
                                        <i className="fas fa-chart-bar fa-2x text-gray-300"></i>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            )}

            <p className='m-3 w-100'>
                For more statistics, click here <button className="btn btn-sm btn-outline-warning ms-2">
                    <a href={'/statistics'} style={{ color: 'var(--brand)', fontWeight: 'bolder' }}>Statistics</a>
                </button>
            </p>

            {/* Tabs Navigation */}
            <Nav tabs className="mb-4">
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === '1' })}
                        onClick={() => toggle('1', activeTab, setActiveTab)}
                    >
                        <i className="fas fa-server me-2"></i>System Metrics
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === '2' })}
                        onClick={() => toggle('2', activeTab, setActiveTab)}
                    >
                        <i className="fas fa-database me-2"></i>Database Metrics
                    </NavLink>
                </NavItem>
            </Nav>

            <TabContent activeTab={activeTab}>

                {/* System Metrics Tab */}
                <SystemMetricsTab services={dashboardStats?.servicesHealth} />

                {/* Database Metrics Tab */}
                <DatabaseMetricsTab services={dashboardStats?.servicesHealth} />
            </TabContent>
        </div>
    );
};

export default SystemDashboard;
