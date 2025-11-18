import { Col, Toast, ToastBody, ToastHeader } from 'reactstrap';
import EditUser from './EditUser';
import uploadimage from '@/images/uploadimage.svg';
import moment from 'moment';
import ImageWithFallback from '@/utils/ImageWithFallback';
import DeleteModal from '@/utils/DeleteModal';
import { deleteUser } from '@/redux/slices/authSlice';
import { useSelector } from 'react-redux';

const UserToast = ({ userToUse, fromSearch }) => {

    const { user } = useSelector(state => state.auth);

    if (!userToUse) return null;
    const { _id, name, email, image, role, register_date } = userToUse;
    const formattedDate = moment(new Date(register_date)).format('DD MMM YYYY, HH:mm');

    return (
        <Col sm="3" key={_id} className={'mt-3 users-toast'}>

            <Toast fade={false}>
                <ToastHeader className="text-dark overflow-auto">
                    <strong>{email}</strong>

                    {user?.role?.includes('Admin') ?
                        <div className="actions text-secondary d-flex">
                            <DeleteModal deleteFnName="deleteUser" deleteFn={deleteUser} delID={_id} delTitle={name} />
                            <EditUser userToUse={userToUse} />
                        </div> :
                        <span></span>}

                </ToastHeader>

                <ToastBody className={` ${fromSearch ? 'bg-light text-dark' : ''}`}>

                    <div className="userDetails flex-column d-flex align-items-center justify-content-around">
                        <div className="details d-flex flex-column p-1">
                            <small className='fw-bolder text-primary text-truncate text-capitalize'>{(name)}</small>
                        </div>

                        <div className="illustration d-flex flex-column w-50">
                            <span className='illustration-image p-1 border rounded border-secondary'>
                                {/* <img src={user.image || uploadimage} alt='Profile illustration' /> */}
                                {image && <ImageWithFallback
                                    src={image}
                                    fallbackSrc={uploadimage}
                                    alt="profile illustration"
                                />
                                }
                            </span>
                            <p className="fw-bolder text-center text-white bg-dark mt-1"><u>{role}</u></p>
                            <small className='fw-bolder text-secondary text-truncate text-capitalize'>
                                <i>
                                    {formattedDate === 'Invalid date' ? '' : `Registered on ${formattedDate}`}
                                </i>
                            </small>
                        </div>
                    </div>
                </ToastBody>
            </Toast>

        </Col>
    );
};

export default UserToast;
