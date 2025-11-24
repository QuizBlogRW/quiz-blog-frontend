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
                    <h2 className="text-primary mb-0">
                        <i className="fas fa-database me-2" /> Database Metrics
                    </h2>
                </Col>
                <Col md="6" className="text-md-end mt-2 mt-md-0">
                    <small className="text-muted me-2">Last updated: {lastUpdated ?? "—"}</small>
                    <Button color="outline-primary" size="sm" onClick={fetchDataMetrics} disabled={loading}>
                        {loading ? (
                            <>
                                <Spinner size="sm" /> <span className="ms-1">Refreshing</span>
                            </>
                        ) : (
                            <>
                                <i className="fas fa-sync-alt me-1" /> Refresh
                            </>
                        )}
                    </Button>
                </Col>
            </Row>

            {/* Error */}
            {fetchError && (
                <Row className="mb-3">
                    <Col>
                        <Alert color="danger" className="mb-0">
                            <i className="fas fa-exclamation-triangle me-2" />
                            {fetchError}
                        </Alert>
                    </Col>
                </Row>
            )}

            {/* Loading */}
            {loading && !dataMetrics && (
                <Row>
                    <Col>
                        <Card className="shadow-sm">
                            <CardBody className="text-center py-5">
                                <Spinner size="lg" />
                                <div className="mt-2 text-muted">Loading database metrics…</div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Overview */}
            {dataMetrics && (
                <Row className="mb-4">
                    <Col md="4" sm="12">
                        <Card className="shadow-sm h-100 border-0">
                            <CardBody>
                                <CardTitle tag="h6" className="mb-3 text-primary">
                                    Overview
                                </CardTitle>
                                <ul className="list-unstyled mb-0">
                                    <li><strong>Total Data Size:</strong> {formatBytes(totals.dataSize)}</li>
                                    <li><strong>Total Index Size:</strong> {formatBytes(totals.indexSize)}</li>
                                    <li><strong>Total Storage Size:</strong> {formatBytes(totals.storageSize)}</li>
                                    <li>
                                        <strong>Databases Healthy:</strong>{" "}
                                        <Badge color={dataMetrics.summary?.databasesHealthy ? "success" : "danger"}>
                                            {dataMetrics.summary?.databasesHealthy ? "Yes" : "No"}
                                        </Badge>
                                    </li>
                                    <li>
                                        <strong>Redis Healthy:</strong>{" "}
                                        <Badge color={dataMetrics.summary?.redisHealthy ? "success" : "danger"}>
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
                        <Col md="6" lg="4" key={db.name}>
                            <DatabaseCard db={db} />
                        </Col>
                    ))}
                    {redis && (
                        <Col md="6" lg="4">
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
