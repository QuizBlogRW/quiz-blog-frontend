import React from 'react'
import { Toast, ToastHeader, ToastBody } from 'reactstrap'
import moment from 'moment'

const Comment = ({ comment }) => {

    return (
        <div>
            <Toast style={{ maxWidth: '100%' }}>
                <ToastHeader icon="warning" className="text-success">
                    {comment.sender && comment.sender.name}
                    <small className="ml-2 px-1 text-dark bg-danger">
                        {comment.createdAt && moment(comment.createdAt).format('YYYY-MM-DD, HH:MM')}
                    </small>
                </ToastHeader>
                <ToastBody className='text-secondary'>
                    {comment.comment}
                </ToastBody>
            </Toast>
        </div>
    )
}

export default Comment