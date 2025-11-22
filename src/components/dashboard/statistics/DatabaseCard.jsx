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

    return (
        db?.stats &&
        <Card className="shadow-sm h-100 border-0 mb-4" style={{ borderRadius: 12 }}>
            <CardBody>
                <CardTitle tag="h6" className="mb-3 text-primary">
                    <i className="fas fa-server me-2" /> {db.name}
                </CardTitle>
                <ListGroup flush>
                    <ListGroupItem className="d-flex justify-content-between">
                        <div>Status</div>
                        <Badge color={db.connected ? "success" : "danger"}>
                            {db.connected ? "Connected" : "Disconnected"}
                        </Badge>
                    </ListGroupItem>

                    <ListGroupItem className="d-flex justify-content-between">
                        <div>Latency</div>
                        <div>{latency.toFixed(0)} ms</div>
                    </ListGroupItem>

                    <ListGroupItem>
                        <div className="d-flex justify-content-between mb-1">
                            <div>Data Size</div>
                            <div>{(db.stats?.dataSize / 1024 / 1024).toFixed(2)} MB</div>
                        </div>
                        <Progress
                            value={Math.min(100, (db.stats?.dataSize / (1024 * 1024 * 100)).toFixed(0))}
                            animated
                            className="progress-sm"
                            color={usageColor(db.stats?.dataSize / (1024 * 1024 * 100))}
                            style={{ height: 8 }}
                        />
                    </ListGroupItem>

                    <ListGroupItem className="d-flex justify-content-between">
                        <div>Index Size</div>
                        <div>{(db.stats?.indexSize / 1024 / 1024).toFixed(2)} MB</div>
                    </ListGroupItem>
                    <ListGroupItem className="d-flex justify-content-between">
                        <div>Storage Size</div>
                        <div>{(db.stats?.storageSize / 1024 / 1024).toFixed(2)} MB</div>
                    </ListGroupItem>
                    <ListGroupItem className="d-flex justify-content-between">
                        <div>Collections</div>
                        <div>{safe(db.stats?.collections)}</div>
                    </ListGroupItem>
                    <ListGroupItem className="d-flex justify-content-between">
                        <div>Objects</div>
                        <div>{safe(db.stats?.objects)}</div>
                    </ListGroupItem>
                </ListGroup>
            </CardBody>
        </Card>
    );
};

export default DatabaseCard;
