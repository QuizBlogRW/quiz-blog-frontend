import { Card, Button, CardTitle, CardText, Alert } from 'reactstrap';
import DeleteIcon from '@/images/trash.svg';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { deleteContact } from '@/redux/slices/contactsSlice';
import { useSelector, useDispatch } from 'react-redux';

const ChatCard = ({ openChat }) => {

    const dispatch = useDispatch();

    const { user } = useSelector(state => state.auth);
    const { isLoading, allContacts, userContacts } = useSelector(state => state.contacts);
    const contactsToUse = allContacts && ((user?.role?.includes('Admin') || user?.role === 'Creator')) ? allContacts : userContacts;

    return (
        isLoading ?
            <Alert color="success" className="w-100 w-lg-50 mt-4 text-center mx-auto" style={{ border: '2px solid var(--brand)' }}>
                Loading...
            </Alert> :
            contactsToUse && contactsToUse.length > 0 ?
                <>
                    {contactsToUse && contactsToUse.map(contact => {

                        const { _id, contact_name, email, message, contact_date, replies } = contact;
                        const formattedDate = moment(new Date(contact_date)).format('DD MMM YYYY, HH:mm');

                        return (
                            <Card body key={_id}
                                className="m-1 p-1 mb-2"
                                style={{ height: '150px!important', overflowY: 'unset!important' }}>

                                <CardTitle onClick={() => openChat(_id)}
                                    className="p-1 d-flex justify-content-between"
                                    style={{ fontSize: '.65rem', backgroundColor: 'honeydew' }}>
                                    <small style={{ width: '80%' }}>
                                        <b style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} className='d-block overflow-hidden'>
                                            {contact_name}
                                        </b>
                                        ({email})
                                    </small>

                                    {replies && replies.length > 0 ?
                                        <b
                                            className='border bg-secondary text-warning text-center'
                                            style={{ padding: '4px', borderRadius: '50%', verticalAlign: 'middle', width: '25px', height: '25px', fontSize: '.65rem' }}>
                                            {replies.length}
                                        </b> :
                                        null}
                                </CardTitle>

                                <CardText onClick={() => openChat(_id)}
                                    style={{ fontSize: '.7rem', marginLeft: '6px' }}>
                                    {message}
                                </CardText>
                                <div className="d-flex justify-content-between p-1" style={{ backgroundColor: 'whitesmoke' }}>
                                    <small className="d-flex align-items-center text-info" style={{ fontSize: '.65rem' }}>
                                        <i>
                                            {formattedDate === 'Invalid date' ? '' : formattedDate}
                                        </i>
                                    </small>

                                    <Button size="sm" color="link" className={`me-2 ${user?.role?.includes('Admin') ? '' : 'd-none'}`} onClick={() => dispatch(deleteContact(_id))}>
                                        <img src={DeleteIcon} alt="" width="16" height="16" />
                                    </Button>
                                </div>
                            </Card>
                        )
                    })}
                </> :
                <Alert color="danger" className="w-100 w-lg-50 mt-4 text-center mx-auto" style={{ border: '2px solid var(--brand)' }}>
                    {user?.role !== 'Visitor' ? 'No messages yet!' : <Link to='/contact'>➕ Start new chat with us</Link>}
                </Alert>
    );
};

export default ChatCard;
