import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Row,
    Col,
    Card,
    CardBody,
    Alert,
    Spinner,
    TabContent,
    Nav,
    NavItem,
    NavLink,
} from "reactstrap";
import classnames from "classnames";
import { useNavigate } from "react-router-dom";

import { getSummaryStats } from "@/redux/slices/statisticsSlice";

import DatabaseMetricsTab from "./DatabaseMetricsTab";
import SystemMetricsTab from "./SystemMetricsTab";
import NotAuthenticated from '@/components/users/NotAuthenticated';
import Unauthorized from '@/components/users/Unauthorized';
import "./SystemDashboard.css";

const useAccess = () => {
    const { user, isAuthenticated } = useSelector(state => state.users);
    const isAdmin = isAuthenticated && user?.role?.includes("Admin");
    return { user, isAuthenticated, isAdmin };
};

const useSummaryStats = (enabled) => {
    const dispatch = useDispatch();
    const { summaryStats, isLoading, error } = useSelector(
        (s) => s.statistics
    );
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        if (!enabled) return;

        const fetchStats = () => {
            dispatch(getSummaryStats());
            setLastUpdated(new Date().toLocaleTimeString());
        };

        fetchStats(); // initial load

        const interval = setInterval(fetchStats, 60000);
        return () => clearInterval(interval);
    }, [enabled, dispatch]);

    return { summaryStats, isLoading, error, lastUpdated };
};

const StatCard = ({ title, value, icon, color, onClick }) => (
    <Col lg="3" md="6" className="mb-3">
        <Card
            className={`border-left-${color} h-100`}
            onClick={onClick}
            style={{ cursor: "pointer" }}
        >
            <CardBody>
                <div className="d-flex align-items-center">
                    <div>
                        <div
                            className={`text-xs font-weight-bold text-${color} text-uppercase mb-1`}
                        >
                            {title}
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                            {value?.toLocaleString() || 0}
                        </div>
                    </div>

                    <div className="ms-auto">
                        <i className={`fas ${icon} fa-2x text-gray-300`} />
                    </div>
                </div>
            </CardBody>
        </Card>
    </Col>
);

const LoadingScreen = () => (
    <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "400px" }}
    >
        <Spinner color="success" size="sm" />
        <span className="ms-3">Loading system statistics...</span>
    </div>
);

const SystemDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isAuthenticated, isAdmin } = useAccess();
    const { summaryStats, isLoading, error, lastUpdated } =
        useSummaryStats(isAdmin);

    // Persist active tab
    const [activeTab, setActiveTab] = useState("1");

    useEffect(() => {
        const saved = localStorage.getItem("activeMetric");
        if (saved) setActiveTab(saved);
    }, []);

    const changeTab = (tab) => {
        setActiveTab(tab);
        localStorage.setItem("activeMetric", tab);
    };

    if (!isAuthenticated) return <NotAuthenticated />;
    if (!isAdmin) return <Unauthorized />;
    if (isLoading && (!summaryStats || !summaryStats?.totalUsers)) return <LoadingScreen />;

    return (
        <div className="system-dashboard p-4">
            {/* Header */}
            <Row className="mb-4">
                <Col>
                    <div className="d-flex justify-content-between align-items-center">
                        <h2 className="text-primary">
                            <i className="fas fa-tachometer-alt me-2"></i>
                            System Dashboard
                        </h2>

                        <div className="text-muted">
                            Last updated: {lastUpdated}
                            <button
                                className="btn btn-sm btn-outline-primary ms-2"
                                onClick={() => dispatch(getSummaryStats())}
                                disabled={error}
                            >
                                <i className="fas fa-sync-alt"></i> Refresh
                            </button>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Error */}
            {error && (
                <Alert
                    color={error.includes("Note:") ? "warning" : "danger"}
                    className="mb-4"
                >
                    <i
                        className={`fas ${error.includes("Note:")
                            ? "fa-info-circle"
                            : "fa-exclamation-triangle"
                            } me-2`}
                    ></i>
                    {error}
                </Alert>
            )}

            {/* Metrics Summary */}
            {summaryStats && (
                <Row className="mb-4">
                    <StatCard
                        title="Total Users"
                        value={summaryStats.totalUsers}
                        icon="fa-users"
                        color="primary"
                        onClick={() => navigate("/statistics/new-50-users")}
                    />

                    <StatCard
                        title="Total Quizzes"
                        value={summaryStats.totalQuizzes}
                        icon="fa-question-circle"
                        color="success"
                        onClick={() => navigate("/statistics/top-10-quizzes")}
                    />

                    <StatCard
                        title="Total Downloads"
                        value={summaryStats.totalDownloads}
                        icon="fa-download"
                        color="warning"
                        onClick={() => navigate("/statistics/top-10-notes")}
                    />

                    <StatCard
                        title="Total Scores"
                        value={summaryStats.totalScores}
                        icon="fa-chart-bar"
                        color="info"
                        onClick={() => navigate("/statistics/top-10-quizzing-users")}
                    />
                </Row>
            )}

            {/* More Stats Button */}
            <p className="m-3 w-100">
                For more statistics, click here{" "}
                <button className="btn btn-sm btn-outline-warning ms-2">
                    <a
                        href="/statistics"
                        style={{ color: "var(--brand)", fontWeight: "bolder" }}
                    >
                        Statistics
                    </a>
                </button>
            </p>

            {/* Tabs */}
            <Nav tabs className="mb-4">
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === "1" })}
                        onClick={() => changeTab("1")}
                    >
                        <i className="fas fa-server me-2"></i>System Metrics
                    </NavLink>
                </NavItem>

                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === "2" })}
                        onClick={() => changeTab("2")}
                    >
                        <i className="fas fa-database me-2"></i>Database Metrics
                    </NavLink>
                </NavItem>
            </Nav>

            {/* Tab Content */}
            <TabContent activeTab={activeTab}>
                <SystemMetricsTab />
                <DatabaseMetricsTab />
            </TabContent>
        </div>
    );
};

export default SystemDashboard;
