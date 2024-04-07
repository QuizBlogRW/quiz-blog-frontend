import React, { useState } from 'react'
import { Alert, Progress } from 'reactstrap'
import { useSelector } from "react-redux"

const Notification = ({ errorsState, progress, initFn }) => {
  // console.log(initFn)

  const errors = useSelector(state => state.error)
  const successful = useSelector(state => state.success)
  // console.log(errors)
  // console.log(successful)

  // Alert
  const [visible, setVisible] = useState(true)
  const onDismiss = () => setVisible(false)

  return (
    <div className='mb-2 mt-4'>
      {/* Error frontend*/}
      {
        errorsState && errorsState.length > 0 ?
          errorsState.map(err =>
            <Alert color="danger" isOpen={visible} toggle={onDismiss} key={Math.floor(Math.random() * 1000)} className='border border-warning'>
              {err}
            </Alert>) :
          null
      }

      {/* Error backend */}
      {/* {console.log(errors)} */}
      {
        errors && errors.id === initFn && initFn !== 'replyContact' ? 
          <Alert isOpen={visible} toggle={onDismiss} color='danger' className='border border-warning'>
            <small>
              {errors.msg && errors.msg.msg ? errors.msg.msg : errors.msg}
            </small>
          </Alert> :
          successful && successful.id === initFn && initFn !== 'replyContact' ? 
            <Alert color='success' isOpen={visible} toggle={onDismiss} className='border border-warning'>
              <small>
                {successful.msg && successful.msg.msg ? successful.msg.msg : successful.msg}
              </small>
            </Alert> : null
      }

      {progress &&
        <div className={`text-center text-danger fw-bolder`}>
          {progress - 1}%
          <Progress animated color="info" value={progress - 1} className='mb-2' />
        </div>}
    </div>
  )
}

export default Notification