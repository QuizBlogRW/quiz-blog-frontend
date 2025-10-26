import { Row, Col, TabPane, Card, CardBody, CardTitle, Table, Badge } from 'reactstrap';
import { formatUptime, getServiceStatusColor } from './utils';

const SystemMetricsTab = ({ services }) => {

    return (
        <TabPane tabId="1">
            {services && (
                <Row>
                    {/* Service Health */}
                    <Col lg="12" className="mb-4">
                        <Card>
                            <CardBody>
                                <CardTitle tag="h5">
                                    <i className="fas fa-heartbeat me-2"></i>
                                    Service Health
                                </CardTitle>
                                <Table borderless size="sm">
                                    <thead>
                                        <tr>
                                            <th>Service</th>
                                            <th>Status</th>
                                            <th>Uptime</th>
                                            <th>Platform</th>
                                            <th>Architecture</th>
                                            <th>CPUs</th>
                                            <th>Memory Usage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {services?.map((service, index) => (
                                            <tr key={index}>
                                                <td className="font-weight-bold text-capitalize">{service?.service}</td>
                                                <td>
                                                    <Badge color={getServiceStatusColor(service?.status)}>
                                                        {service?.status}
                                                    </Badge>
                                                </td>
                                                <td>{service?.system?.uptime ? formatUptime(service?.system?.uptime) : 'N/A'}</td>
                                                <td>{service?.system?.platform}</td>
                                                <td>{service?.system?.architecture}</td>
                                                <td>{service?.system?.cpus}</td>
                                                <td>{Math.ceil((service?.system?.freeMemory * 100) / service?.system?.totalMemory)}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            )}
        </TabPane>
    );
};

export default SystemMetricsTab;
