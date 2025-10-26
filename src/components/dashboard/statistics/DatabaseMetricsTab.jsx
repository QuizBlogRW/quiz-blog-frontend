import { Row, Col, TabPane, Card, CardBody, CardTitle, Table, Badge } from 'reactstrap';

const DatabaseMetricsTab = ({ services }) => {

    const totalDataSizeMB = services?.reduce((acc, s) => acc + (s.dbStats?.dataSize || 0), 0);
    const totalIndexSizeMB = services?.reduce((acc, s) => acc + (s.dbStats?.indexSize || 0), 0);
    const totalStorageSizeMB = services?.reduce((acc, s) => acc + (s.dbStats?.storageSize || 0), 0);

    const overview = {
        totalDataSize: (totalDataSizeMB / (1024 * 1024)).toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' MB',
        totalIndexSize: (totalIndexSizeMB / (1024 * 1024)).toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' MB',
        totalStorageSize: (totalStorageSizeMB / (1024 * 1024)).toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' MB'
    };

    const serviceRows = services?.sort((a, b) => b?.dbStats?.dataSize - a?.dbStats?.dataSize).map((service, index) => (
        <tr key={index}>
            <td className="font-weight-bold text-capitalize">{service?.service}</td>
            <td>
                <Badge color={service?.status === 'healthy' ? 'success' : 'danger'}>
                    {service?.status}
                </Badge>
            </td>
            <td>
                {service?.dbStats?.dataSize ?
                    (service?.dbStats?.dataSize / 1024 / 1024).toFixed(2) + ' MB' :
                    'N/A'
                }
            </td>
            <td>
                {service?.dbStats?.indexSize ?
                    (service?.dbStats?.indexSize / 1024 / 1024).toFixed(2) + ' MB' :
                    'N/A'
                }
            </td>
            <td>
                {service?.dbStats?.storageSize ?
                    (service?.dbStats?.storageSize / 1024 / 1024).toFixed(2) + ' MB' :
                    'N/A'
                }
            </td>
            <td>
                {service?.dbStats?.collections ?
                    service?.dbStats?.collections :
                    'N/A'
                }
            </td>
            <td>
                {service?.dbStats?.objects ?
                    service?.dbStats?.objects :
                    'N/A'
                }
            </td>
        </tr>
    ));

    return (
        <TabPane tabId="2">
            <Row className="mb-4">
                {/* Database Overview */}
                <Col lg="6" className='mb-4'>
                    <Card>
                        <CardBody>
                            <CardTitle tag="h5">
                                <i className="fas fa-database me-2"></i>
                                Database Overview
                            </CardTitle>
                            <Table borderless size="sm">
                                <tbody>
                                    <tr>
                                        <td><strong>Total Data Size:</strong></td>
                                        <td>{overview.totalDataSize}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Total Index Size:</strong></td>
                                        <td>{overview.totalIndexSize}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Total Storage Size:</strong></td>
                                        <td>{overview.totalStorageSize}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </Col>

                {/* Service Database Details */}
                <Col lg="12">
                    <Card>
                        <CardBody>
                            <CardTitle tag="h5">
                                <i className="fas fa-list me-2"></i>
                                Service Database Details
                            </CardTitle>
                            <Table striped responsive>
                                <thead>
                                    <tr>
                                        <th>Database</th>
                                        <th>Status</th>
                                        <th>Data Size</th>
                                        <th>Index Size</th>
                                        <th>Storage Size</th>
                                        <th>Collections</th>
                                        <th>Objects</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {serviceRows}
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </TabPane>
    );
};

export default DatabaseMetricsTab;
