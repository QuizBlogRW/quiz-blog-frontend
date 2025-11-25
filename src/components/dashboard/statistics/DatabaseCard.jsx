import { Card, CardBody, CardTitle, ListGroup, ListGroupItem, Badge, Progress } from "reactstrap";
import { useAnimatedNumber } from "./useAnimatedNumber";

const usageColor = (value) => {
    if (value >= 85) return "danger";
    if (value >= 65) return "warning";
    return "success";
};

const DatabaseCard = ({ db }) => {

    const latency = useAnimatedNumber(db.latencyMs ?? 0, 450);
    const safe = (v, d = "N/A") => (v === undefined || v === null ? d : v);
    const full = db.name == "Redis" ? 256 : 512;
    const usedMb = db.stats?.dataSize / 1024 / 1024;
    const percent = (usedMb / full) * 100;

    return (
        db?.stats &&
        <Card className="shadow-sm h-100 border-0" style={{ borderRadius: 14 }}>
            <CardBody>
                <CardTitle tag="h6" className="text-primary mb-3">
                    <i className="fas fa-server me-2" /> {db.name}
                </CardTitle>

                <ListGroup flush>
                    <ListGroupItem className="d-flex justify-content-between align-items-center">
                        <span>Status</span>
                        <Badge color={db.connected ? "success" : "danger"} pill>
                            {db.connected ? "Connected" : "Disconnected"}
                        </Badge>
                    </ListGroupItem>

                    <ListGroupItem className="d-flex justify-content-between">
                        <span>Latency</span>
                        <strong>{latency.toFixed(0)} ms</strong>
                    </ListGroupItem>

                    <ListGroupItem>
                        <div className="d-flex justify-content-between small mb-1">
                            <span>Data Size</span>
                            <span>
                                {usedMb.toFixed(2)} MB / {full} MB
                            </span>
                        </div>

                        <Progress
                            value={Math.min(100, percent)}
                            animated
                            className="progress-sm"
                            color={usageColor(percent)}
                            style={{ height: 8, borderRadius: 6 }}
                        />
                    </ListGroupItem>

                    <ListGroupItem className="d-flex justify-content-between">
                        <span>Index Size</span>
                        <span>{(db.stats.indexSize / 1024 / 1024).toFixed(2)} MB</span>
                    </ListGroupItem>

                    <ListGroupItem className="d-flex justify-content-between">
                        <span>Storage Size</span>
                        <span>{(db.stats.storageSize / 1024 / 1024).toFixed(2)} MB</span>
                    </ListGroupItem>

                    <ListGroupItem className="d-flex justify-content-between">
                        <span>Collections</span>
                        <strong>{safe(db.stats.collections)}</strong>
                    </ListGroupItem>

                    <ListGroupItem className="d-flex justify-content-between">
                        <span>Objects</span>
                        <strong>{safe(db.stats.objects)}</strong>
                    </ListGroupItem>
                </ListGroup>
            </CardBody>
        </Card>
    );
};

export default DatabaseCard;
