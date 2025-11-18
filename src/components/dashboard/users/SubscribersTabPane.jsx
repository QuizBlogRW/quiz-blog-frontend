import { useEffect } from 'react';
import { Row, TabPane, Table } from 'reactstrap';
import { getSubscribers, deleteSubscriber } from '@/redux/slices/subscribersSlice';
import { useSelector, useDispatch } from 'react-redux';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import moment from 'moment';
import DeleteModal from '@/utils/DeleteModal';

const SubscribersTabPane = () => {

    // Redux
    const dispatch = useDispatch();
    const { isLoading, subscribedUsers } = useSelector(state => state.subscribers);

    // Lifecycle methods
    useEffect(() => { dispatch(getSubscribers()); }, [dispatch]);

    return (
        <TabPane tabId="6" className='mx-4'>
            {
                isLoading ?
                    <QBLoadingSM title='subscribers' /> :
                    subscribedUsers && <Row>
                        <Table bordered className='all-scores table-success' hover responsive striped size="sm">
                            <thead className='text-uppercase table-dark'>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Subscription Date</th>
                                    <th scope="col">❌</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subscribedUsers?.map((subscribedUser, index) => {
                                    const { name, email, createdAt, _id } = subscribedUser
                                    const formattedDate = moment(new Date(createdAt)).format('DD MMM YYYY, HH:mm');
                                    return (
                                        <tr key={_id}>
                                            <th scope="row" className="table-dark">{index + 1}</th>
                                            <td className='text-uppercase'>
                                                {name.split(' ').slice(0, 2).join(' ')}
                                            </td>
                                            <td className='text-lowercase'>{email}</td>
                                            <td>
                                                {formattedDate === 'Invalid date' ? '' : formattedDate}
                                            </td>
                                            <td className="table-dark">
                                                <DeleteModal deleteFnName="deleteSubscriber" deleteFn={deleteSubscriber} delID={_id} delTitle={name} />
                                            </td>
                                        </tr>)
                                })}
                            </tbody>
                        </Table>
                    </Row>
            }

        </TabPane>
    );
};

export default SubscribersTabPane;
