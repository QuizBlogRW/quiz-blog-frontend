import React, { useState, useEffect, useContext } from 'react'
import { Row, Button, Table, Alert } from 'reactstrap'
import { connect } from 'react-redux'
import { getLogs, deleteLog } from '../../redux/logs/logs.actions'
import trash from '../../images/trash.svg'
import LoginModal from '../auth/LoginModal'
import SpinningBubbles from '../rLoading/SpinningBubbles'
import { authContext } from '../../appContexts'

const UserLogs = ({ getLogs, deleteLog, userLogs }) => {

  const auth = useContext(authContext)

  useEffect(() => { getLogs() }, [getLogs])
  const [logsState, setLogsState] = useState([])
  useEffect(() => { setLogsState(userLogs && userLogs.logs) }, [userLogs])
  const isAuthenticated = auth && auth.isAuthenticated
  const curUser = auth.user && auth.user.role

  return (

    !isAuthenticated ?

      // If not authenticated or loading
      <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
        {
          auth.isLoading ?
            <SpinningBubbles title='logs' /> :
            <LoginModal
              textContent={'Login first to access logs'}
              textColor={'text-danger font-weight-bolder my-5 border rounded'} />
        }
      </div> :

      curUser === 'Admin' ?
        <div className='mx-4 my-5'>
          <Row className="add-school mt-lg-5 mx-lg-5 px-lg-5 py-lg-3 d-flex justify-content-around align-items-center border rounded">
            <h5 className='font-weight-bolder text-info d-none d-sm-block'>TODAY'S USER LOGS - IN & OUT</h5>
          </Row>

          {
            userLogs.isLoading ?
              <SpinningBubbles title='logs' /> :

              logsState && logsState.length === 0 ?

                <Alert color="danger" className="mt-lg-5 mx-lg-5 px-lg-5 py-lg-3 text-center">
                  No logs available yet!
                </Alert> :

                <Row className='mx-0 px-0'>
                  <Table bordered className='all-scores table-success mt-lg-5' hover responsive striped size="sm">
                    <thead className='text-uppercase table-dark'>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Logged in</th>
                        <th scope="col">Expire at</th>
                        <th scope="col">❌</th>
                      </tr>
                    </thead>

                    <tbody>
                      {logsState && logsState.map((usrLog, index) => (
                        <tr key={usrLog._id}>
                          <th scope="row" className="table-dark">{index + 1}</th>
                          <td className='text-uppercase'>
                            {usrLog.userId && usrLog.userId.name.split(' ').slice(0, 2).join(' ')}
                          </td>
                          <td className='text-lowercase'>{usrLog.userId && usrLog.userId.email}</td>
                          <td>{usrLog.loggedInAt.split('T').slice(0, 2).join(' at ')}</td>
                          <td>{usrLog.expiresAt.split('T').slice(0, 2).join(' at ')}</td>
                          <td className="table-dark">
                            <Button size="sm" color="link" className="mt-0 p-0" onClick={() => deleteLog(usrLog._id)}>
                              <img src={trash} alt="" width="16" height="16" />
                            </Button>
                          </td>
                        </tr>))}
                    </tbody>
                  </Table>
                </Row>
          }

        </div> : <Alert color="danger">Access Denied!</Alert>
  )
}
const mapStateToProps = state => ({
  userLogs: state.logsReducer
})

export default connect(mapStateToProps, { getLogs, deleteLog })(UserLogs)