import React from 'react'
import EditUser from './EditUser';
import trash from '../../images/trash.svg';
import uploadimage from '../../images/uploadimage.svg';
import moment from 'moment'

import { Col, Toast, ToastBody, ToastHeader } from 'reactstrap';

const UserToast = ({ auth, user, fromSearch, deleteUser }) => {

    return (
        <Col sm="3" key={user._id} className={`mt-3 users-toast`}>

            <Toast>
                <ToastHeader className="text-dark overflow-auto">
                    <strong>{user.email}</strong>
                    <div className="actions text-secondary d-flex">
                        <img src={trash} alt="" width="16" height="16" className="mx-4 mt-1" onClick={() => deleteUser(user._id)} />
                        <EditUser auth={auth} uId={user._id} uName={user.name} uRole={user.role} uEmail={user.email} />
                    </div>
                </ToastHeader>

                <ToastBody className={` ${fromSearch ? 'bg-light text-dark' : ''}`}>

                    <div className="userDetails d-flex align-items-center justify-content-around">
                        <div className="details d-flex flex-column w-50 p-1">
                            <p className="font-weight-bold text-truncate text-info">{user.name}</p>
                            <small className='font-weight-bolder text-primary text-truncate text-capitalize'>{(user.school && user.school.title) || 'No School'}</small>
                            <small className='font-weight-bolder text-truncate text-capitalize text-dark'>{(user.faculty && user.faculty.title) || 'No Faculty'}</small>
                            <small className='font-weight-bolder text-secondary text-truncate text-capitalize'>{(user.level && user.level.title) || 'No Level'}</small>

                            <small className='font-weight-bolder text-secondary text-truncate text-capitalize pt-3'><i>Registered on {moment(new Date(user && user.register_date))
                                .format('YYYY-MM-DD, HH:MM')}</i></small>
                        </div>

                        <div className="illustration d-flex flex-column w-50">
                            <span className='illustration-image p-1 border rounded border-secondary'>
                                <img src={user.image || uploadimage} alt='Profile illustration' />
                            </span>
                            <p className="font-weight-bold text-center text-white bg-dark mt-2"><u>{user.role}</u></p>
                        </div>
                    </div>
                </ToastBody>
            </Toast>

        </Col>
    )
}

export default UserToast