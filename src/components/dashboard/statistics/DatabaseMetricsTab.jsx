import { Row, Col, TabPane, Card, CardBody, CardTitle, Table, Badge } from 'reactstrap';

const DatabaseMetricsTab = ({ services }) => {

    const totalDataSizeMB = services?.reduce((acc, s) => acc + (s.value?.dbStats?.dataSize || 0), 0);
    const totalIndexSizeMB = services?.reduce((acc, s) => acc + (s.value?.dbStats?.indexSize || 0), 0);
    const totalStorageSizeMB = services?.reduce((acc, s) => acc + (s.value?.dbStats?.storageSize || 0), 0);

    const overview = {
        totalDataSize: (totalDataSizeMB / (1024 * 1024)).toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' MB',
        totalIndexSize: (totalIndexSizeMB / (1024 * 1024)).toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' MB',
        totalStorageSize: (totalStorageSizeMB / (1024 * 1024)).toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' MB'
    };

    const serviceRows = services?.sort((a, b) => b?.value?.dbStats?.dataSize - a?.value?.dbStats?.dataSize).map((service, index) => (
        <tr key={index}>
            <td className="font-weight-bold text-capitalize">{service?.value?.service}</td>
            <td>
                <Badge color={service?.value?.status === 'healthy' ? 'success' : 'danger'}>
                    {service?.value?.status}
                </Badge>
            </td>
            <td>
                {service?.value?.dbStats?.dataSize ?
                    (service?.value?.dbStats?.dataSize / 1024 / 1024).toFixed(2) + ' MB' :
                    'N/A'
                }
            </td>
            <td>
                {service?.value?.dbStats?.indexSize ?
                    (service?.value?.dbStats?.indexSize / 1024 / 1024).toFixed(2) + ' MB' :
                    'N/A'
                }
            </td>
            <td>
                {service?.value?.dbStats?.storageSize ?
                    (service?.value?.dbStats?.storageSize / 1024 / 1024).toFixed(2) + ' MB' :
                    'N/A'
                }
            </td>
            <td>
                {service?.value?.dbStats?.collections ?
                    service?.value?.dbStats?.collections :
                    'N/A'
                }
            </td>
            <td>
                {service?.value?.dbStats?.objects ?
                    service?.value?.dbStats?.objects :
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

export default DatabaseMetricsTab
