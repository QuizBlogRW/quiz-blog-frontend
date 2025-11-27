import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Row, Col, TabPane, Card, CardBody, CardTitle, Badge, Spinner, Alert, Button } from "reactstrap";
import DatabaseCard from "./DatabaseCard";
import { formatBytes } from "./utils";

const DatabaseMetricsTab = () => {

    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [dataMetrics, setDataMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    const fetchDataMetrics = useCallback(async () => {
        if (!isAuthenticated || !user?.role?.includes("Admin")) {
            setFetchError("Access denied. Admin privileges required.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const res = await axios.get(`${apiUrl}/api/statistics/data-metrics`);
            if (res.status === 200 && res.data) {
                setDataMetrics(res.data);
                setFetchError(null);
            } else {
                setFetchError("Unexpected response from metrics endpoint.");
            }
        } catch (err) {
            console.error("Error fetching data metrics:", err);
            setFetchError("Failed to fetch data metrics! Check statistics logs for error.");
        } finally {
            setLastUpdated(new Date().toLocaleTimeString());
            setLoading(false);
        }
    }, [isAuthenticated, user, apiUrl]);

    useEffect(() => {
        if (isAuthenticated && user?.role?.includes("Admin")) {
            fetchDataMetrics();
            const interval = setInterval(fetchDataMetrics, 60000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated, user, fetchDataMetrics]);

    const databases = dataMetrics ? Object.values(dataMetrics.databases) : [];
    const redis = dataMetrics?.redis;

    const totals = databases.reduce(
        (acc, db) => {
            acc.dataSize += db.stats?.dataSize || 0;
            acc.indexSize += db.stats?.indexSize || 0;
            acc.storageSize += db.stats?.storageSize || 0;
            return acc;
        },
        { dataSize: 0, indexSize: 0, storageSize: 0 }
    );

    return (
        <TabPane tabId="2">
            {/* Header */}
            <Row className="mb-4 align-items-center">
                <Col md="6">
                    <h2 className="mb-0" style={{ color: "var(--brand)" }}>
                        <i className="fas fa-database me-2" /> Database Metrics
                    </h2>
                </Col>

                <Col md="6" className="text-md-end mt-3 mt-md-0">
                    <small className="text-muted me-3">
                        <i className="fas fa-clock me-1" /> Last updated: {lastUpdated ?? "—"}
                    </small>

                    <Button
                        color="outline-primary"
                        size="sm"
                        className="fw-semibold px-3"
                        onClick={fetchDataMetrics}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Spinner size="sm" className="me-1" />
                                Refreshing...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-sync-alt me-1" />
                                Refresh
                            </>
                        )}
                    </Button>
                </Col>
            </Row>

            {/* Error */}
            {fetchError && (
                <Alert color="danger" className="shadow-sm border-0">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {fetchError}
                </Alert>
            )}

            {/* Loading */}
            {loading && !dataMetrics && (
                <Card className="shadow-sm border-0">
                    <CardBody className="text-center py-5">
                        <Spinner size="lg" />
                        <div className="mt-2 text-muted">Loading database metrics…</div>
                    </CardBody>
                </Card>
            )}

            {/* Overview */}
            {dataMetrics && (
                <Row className="mb-4">
                    <Col md="4" sm="12">
                        <Card className="shadow-sm h-100 border-0">
                            <CardBody>
                                <CardTitle tag="h6" className="text-primary mb-3">
                                    Overview
                                </CardTitle>

                                <ul className="list-unstyled small mb-0">
                                    <li className="mb-2">
                                        <strong>Total Data:</strong> {formatBytes(totals.dataSize)}
                                    </li>
                                    <li className="mb-2">
                                        <strong>Total Index:</strong> {formatBytes(totals.indexSize)}
                                    </li>
                                    <li className="mb-2">
                                        <strong>Total Storage:</strong> {formatBytes(totals.storageSize)}
                                    </li>

                                    <li className="mb-2 d-flex align-items-center">
                                        <strong className="me-2">Databases Healthy:</strong>
                                        <Badge color={dataMetrics.summary?.databasesHealthy ? "success" : "danger"} pill>
                                            {dataMetrics.summary?.databasesHealthy ? "Yes" : "No"}
                                        </Badge>
                                    </li>

                                    <li className="d-flex align-items-center">
                                        <strong className="me-2">Redis Healthy:</strong>
                                        <Badge color={dataMetrics.summary?.redisHealthy ? "success" : "danger"} pill>
                                            {dataMetrics.summary?.redisHealthy ? "Yes" : "No"}
                                        </Badge>
                                    </li>
                                </ul>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Database Cards */}
            {dataMetrics && (
                <Row>
                    {databases.map((db) => (
                        <Col className="mb-4" md="6" lg="4" key={db.name}>
                            <DatabaseCard db={db} />
                        </Col>
                    ))}
                    {redis && (
                        <Col className="mb-4" md="6" lg="4">
                            <DatabaseCard
                                db={{
                                    name: "Redis",
                                    connected: redis.connected,
                                    latencyMs: redis.latencyMs,
                                    stats: {
                                        dataSize: redis.memoryUsed ?? 0,
                                        indexSize: 0,
                                        storageSize: redis.memoryPeak ?? 0,
                                        collections: 0,
                                        objects: redis.keyCount ?? 0,
                                    },
                                }}
                            />
                        </Col>
                    )}
                </Row>
            )}
        </TabPane>
    );
};

export default DatabaseMetricsTab;
