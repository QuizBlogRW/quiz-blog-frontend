// SystemMetricsTab.jsx
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import {
    Row,
    Col,
    TabPane,
    Card,
    CardBody,
    CardTitle,
    ListGroup,
    ListGroupItem,
    Badge,
    Progress,
    Spinner,
    Alert,
    Button,
} from "reactstrap";
import { useSelector } from "react-redux";
import { formatUptime, getServiceStatusColor } from "./utils"; // keep your helpers

// --- Helper: pick color for usage bars ---
const usageColor = (value) => {
    // value is percent 0..100
    if (value >= 85) return "danger";
    if (value >= 65) return "warning";
    return "success";
};

// --- Lightweight number animation (smooth increment) ---
const useAnimatedNumber = (value, duration = 500) => {
    const [display, setDisplay] = useState(value ?? 0);
    const rafRef = useRef(null);
    const startRef = useRef(null);
    const fromRef = useRef(display);

    useEffect(() => {
        const start = performance.now();
        const from = fromRef.current ?? value ?? 0;
        const to = value ?? 0;
        const diff = to - from;

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        const step = (ts) => {
            const t = Math.min(1, (ts - start) / duration);
            const eased = t < 0.5 ? (2 * t * t) : (-1 + (4 - 2 * t) * t); // easeInOutQuad-like
            setDisplay(from + diff * eased);
            if (t < 1) {
                rafRef.current = requestAnimationFrame(step);
            } else {
                fromRef.current = to;
            }
        };
        rafRef.current = requestAnimationFrame(step);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [value, duration]);

    return display;
};

const SystemMetricsTab = () => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [systemMetrics, setSystemMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    useEffect(() => {
        if (isAuthenticated && user && user.role?.includes("Admin")) {
            fetchSystemMetrics();
            const interval = setInterval(fetchSystemMetrics, 60000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated, user]);

    const fetchSystemMetrics = async () => {
        if (!isAuthenticated || !user || user.role?.includes("Admin") === false) {
            setFetchError("Access denied. Admin privileges required.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const res = await axios.get(`${apiUrl}/api/statistics/system-metrics`);
            if (res.status === 200 && res.data) {
                setSystemMetrics(res.data);
                setFetchError(null);
            } else {
                setFetchError("Unexpected response from metrics endpoint.");
            }
            setLastUpdated(new Date().toLocaleTimeString());
        } catch (err) {
            setFetchError(
                "Failed to fetch system metrics! Check statistics logs for error."
            );
            setLastUpdated(new Date().toLocaleTimeString());
        } finally {
            setLoading(false);
        }
    };

    // Animated numbers
    const cpuUsageAnimated = useAnimatedNumber(
        systemMetrics?.system?.cpuUsagePercentage ?? 0,
        450
    );
    const memoryUsageAnimated = useAnimatedNumber(
        Math.ceil(systemMetrics?.system?.memoryUsagePercent ?? 0),
        450
    );
    const processMemAnimated = useAnimatedNumber(
        systemMetrics?.process?.memoryUsage?.heapUsed
            ? (100 *
                (systemMetrics.process.memoryUsage.heapUsed /
                    systemMetrics.process.memoryUsage.heapTotal))
            : 0,
        450
    );

    // small safe getters
    const safe = (v, d = "N/A") =>
        v === undefined || v === null ? d : v;

    return (
        <TabPane tabId="1">
            <Row className="mb-4">
                <Col>
                    <div className="d-flex justify-content-between align-items-center">
                        <h2 className="text-primary mb-0">
                            <i className="fas fa-tachometer-alt me-2" />
                            System Metrics
                        </h2>

                        <div className="text-muted d-flex align-items-center">
                            <small className="me-2">Last updated: {lastUpdated ?? "—"}</small>
                            <Button
                                color="outline-primary"
                                size="sm"
                                onClick={fetchSystemMetrics}
                                disabled={loading}
                            >
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
                        </div>
                    </div>
                </Col>
            </Row>

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

            {/* Loading skeleton */}
            {loading && !systemMetrics && (
                <Row>
                    <Col>
                        <Card className="shadow-sm">
                            <CardBody className="text-center py-5">
                                <Spinner size="lg" />
                                <div className="mt-2 text-muted">Loading system metrics…</div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            )}

            {systemMetrics && (
                <Row>
                    {/* System Info */}
                    <Col md="4" sm="12" className="mb-4">
                        <Card className="shadow-sm h-100 border-0" style={{ borderRadius: 12 }}>
                            <CardBody>
                                <CardTitle tag="h6" className="mb-3 text-primary">
                                    <i className="fas fa-server me-2" />
                                    System Info
                                </CardTitle>

                                <ListGroup flush>
                                    <ListGroupItem className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <i className="fas fa-heartbeat me-2 text-muted" />
                                            <strong>Status</strong>
                                        </div>
                                        <Badge color={getServiceStatusColor(systemMetrics.status)}>
                                            {safe(systemMetrics.status)}
                                        </Badge>
                                    </ListGroupItem>

                                    <ListGroupItem className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <i className="fas fa-desktop me-2 text-muted" />
                                            OS
                                        </div>
                                        <div>{safe(systemMetrics.system?.os)}</div>
                                    </ListGroupItem>

                                    <ListGroupItem className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <i className="fas fa-layer-group me-2 text-muted" />
                                            Platform
                                        </div>
                                        <div>{safe(systemMetrics.system?.platform)}</div>
                                    </ListGroupItem>

                                    <ListGroupItem className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <i className="fas fa-cubes me-2 text-muted" />
                                            Architecture
                                        </div>
                                        <div>{safe(systemMetrics.system?.architecture)}</div>
                                    </ListGroupItem>

                                    <ListGroupItem className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <i className="fas fa-code me-2 text-muted" />
                                            Node
                                        </div>
                                        <div>{safe(systemMetrics.process?.nodeVersion)}</div>
                                    </ListGroupItem>

                                    <ListGroupItem className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <i className="fas fa-clock me-2 text-muted" />
                                            Uptime
                                        </div>
                                        <div>
                                            {systemMetrics.system?.uptimeSeconds
                                                ? formatUptime(systemMetrics.system.uptimeSeconds)
                                                : "N/A"}
                                        </div>
                                    </ListGroupItem>
                                </ListGroup>
                            </CardBody>
                        </Card>
                    </Col>

                    {/* Performance */}
                    <Col md="4" sm="12" className="mb-4">
                        <Card className="shadow-sm h-100 border-0" style={{ borderRadius: 12 }}>
                            <CardBody>
                                <CardTitle tag="h6" className="mb-3 text-primary">
                                    <i className="fas fa-tachometer-alt me-2" />
                                    Performance
                                </CardTitle>

                                <ListGroup flush>
                                    <ListGroupItem>
                                        <div className="d-flex justify-content-between mb-1">
                                            <div>
                                                <i className="fas fa-microchip me-2 text-muted" />
                                                <strong>CPU Usage</strong>
                                            </div>
                                            <div className="text-end" style={{ minWidth: 60 }}>
                                                {Math.round(cpuUsageAnimated)}%
                                            </div>
                                        </div>

                                        <Progress
                                            value={Math.min(100, Math.max(0, cpuUsageAnimated))}
                                            animated
                                            striped={false}
                                            className="progress-sm"
                                            color={usageColor(Math.round(cpuUsageAnimated))}
                                            style={{ height: 8, transition: "width 450ms ease" }}
                                        />
                                    </ListGroupItem>

                                    <ListGroupItem className="mt-2">
                                        <div className="d-flex justify-content-between mb-1">
                                            <div>
                                                <i className="fas fa-memory me-2 text-muted" />
                                                <strong>Memory Usage</strong>
                                            </div>
                                            <div className="text-end" style={{ minWidth: 60 }}>
                                                {Math.round(memoryUsageAnimated)}%
                                            </div>
                                        </div>

                                        <Progress
                                            value={Math.min(100, Math.max(0, memoryUsageAnimated))}
                                            animated
                                            striped={false}
                                            className="progress-sm"
                                            color={usageColor(Math.round(memoryUsageAnimated))}
                                            style={{ height: 8, transition: "width 450ms ease" }}
                                        />
                                    </ListGroupItem>

                                    <ListGroupItem className="d-flex justify-content-between align-items-center mt-3">
                                        <div>
                                            <i className="fas fa-check-circle me-2 text-muted" />
                                            <strong>Healthy</strong>
                                        </div>
                                        <div>{systemMetrics.summary?.healthy ? "Yes" : "No"}</div>
                                    </ListGroupItem>

                                    <ListGroupItem className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <i className="fas fa-meteor me-2 text-muted" />
                                            <strong>Event Loop OK</strong>
                                        </div>
                                        <div>{systemMetrics.summary?.eventLoopOK ? "Yes" : "No"}</div>
                                    </ListGroupItem>

                                    <ListGroupItem className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <i className="fas fa-layer-group me-2 text-muted" />
                                            <strong>CPU Cores</strong>
                                        </div>
                                        <div>{safe(systemMetrics.system?.cpuCount)}</div>
                                    </ListGroupItem>
                                </ListGroup>
                            </CardBody>
                        </Card>
                    </Col>

                    {/* Process Metrics */}
                    <Col md="4" sm="12" className="mb-4">
                        <Card className="shadow-sm h-100 border-0" style={{ borderRadius: 12 }}>
                            <CardBody>
                                <CardTitle tag="h6" className="mb-3 text-primary">
                                    <i className="fas fa-cogs me-2" />
                                    Process Metrics
                                </CardTitle>

                                <ListGroup flush>
                                    <ListGroupItem className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <i className="fas fa-check me-2 text-muted" />
                                            <strong>Process CPU User</strong>
                                        </div>
                                        <div>{safe(systemMetrics.process?.cpuUsage?.user, "0")}</div>
                                    </ListGroupItem>

                                    <ListGroupItem className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <i className="fas fa-cog me-2 text-muted" />
                                            <strong>Process CPU System</strong>
                                        </div>
                                        <div>{safe(systemMetrics.process?.cpuUsage?.system, "0")}</div>
                                    </ListGroupItem>

                                    <ListGroupItem>
                                        <div className="d-flex justify-content-between mb-1">
                                            <div>
                                                <i className="fas fa-hdd me-2 text-muted" />
                                                <strong>Process Memory</strong>
                                            </div>
                                            <div className="text-end" style={{ minWidth: 60 }}>
                                                {processMemAnimated.toFixed(2)}%
                                            </div>
                                        </div>

                                        <Progress
                                            value={Math.min(100, Math.max(0, processMemAnimated))}
                                            animated
                                            striped={false}
                                            className="progress-sm"
                                            color={usageColor(processMemAnimated)}
                                            style={{ height: 8, transition: "width 450ms ease" }}
                                        />
                                    </ListGroupItem>

                                    <ListGroupItem className="d-flex justify-content-between align-items-center mt-3">
                                        <div>
                                            <i className="fas fa-stopwatch me-2 text-muted" />
                                            <strong>Process Uptime</strong>
                                        </div>
                                        <div>
                                            {systemMetrics.process?.uptimeSeconds
                                                ? formatUptime(systemMetrics.process.uptimeSeconds)
                                                : "N/A"}
                                        </div>
                                    </ListGroupItem>

                                    <ListGroupItem className="pt-3">
                                        <small className="text-muted">
                                            <i className="fas fa-info-circle me-1" />
                                            Values auto-refresh every 60s. Click Refresh to update manually.
                                        </small>
                                    </ListGroupItem>
                                </ListGroup>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* optional debug console */}
            {/* <pre className="mt-3">{JSON.stringify(systemMetrics, null, 2)}</pre> */}

            {/* Inline styles for small progress smoothing & spacing */}
            <style jsx>{`
        .progress-sm {
          border-radius: 6px;
          overflow: hidden;
          box-shadow: inset 0 -1px 0 rgba(255, 255, 255, 0.08);
        }
        .list-group-item {
          border: 0;
          padding-left: 0;
          padding-right: 0;
          padding-top: 0.6rem;
          padding-bottom: 0.6rem;
        }
        .card {
          background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,250,250,0.98));
        }
        @media (prefers-reduced-motion: reduce) {
          .progress-sm {
            transition: none !important;
          }
        }
      `}</style>
        </TabPane>
    );
};

export default SystemMetricsTab;
