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

      {(progress && !successful.id && !errors.id) ? <Progress animated color="warning" value={100} className='mb-2' /> : null}

    </>
  )
}

// Map the question to state props
const mapStateToProps = state => ({
  errors: state.errorReducer,
  successful: state.successReducer
})

export default connect(mapStateToProps, null)(Notification)