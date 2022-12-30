import React, {useState} from 'react'
import { Alert, Progress } from 'reactstrap'
import { connect } from 'react-redux'

const Notification = ({ errorsState, progress, errors, successful, }) => {

  // Alert
  const [visible, setVisible] = useState(true)
  const onDismiss = () => setVisible(false)

  return (
    <>
      {/* Error frontend*/}
      {
        errorsState.length > 0 ?
          errorsState.map(err =>
            <Alert color="danger" isOpen={visible} toggle={onDismiss} key={Math.floor(Math.random() * 1000)} className='border border-warning'>
              {err}
            </Alert>) :
          null
      }

      {/* Error backend */}
      {
        errors.id ?
          <Alert isOpen={visible} toggle={onDismiss} color='danger' className='border border-warning'>
            <small>{errors.msg && errors.msg}</small>
          </Alert> :
          successful.id ?
            <Alert color='success' isOpen={visible} toggle={onDismiss} className='border border-warning'>
              <small>{successful.msg && successful.msg}</small>
            </Alert> : null
      }

      {progress &&
        <div className={`${errors.id || successful.msg ? 'd-none' : ''} text-center text-danger font-weight-bolder`}>
          {progress - 1}%
          <Progress animated color="info" value={progress - 1} className='mb-2' />
        </div>}

    </>
  )
}

// Map the question to state props
const mapStateToProps = state => ({
  errors: state.errorReducer,
  successful: state.successReducer
})

export default connect(mapStateToProps, null)(Notification)