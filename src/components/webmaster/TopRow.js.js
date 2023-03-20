import React, { useContext } from 'react'
import { Row, Alert, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import dashimg from '../../images/dashboard.svg'
import { currentUserContext, onlineListContext } from '../../appContexts'

const TopRow = () => {

  const onlineList = useContext(onlineListContext)
  const currentUser = useContext(currentUserContext)
  let isAdminOnline = false

  // Find through online list if there is atleast one user with SuperAdmin, Admin or Creator role
  onlineList.forEach(user => {
    if (user.role === 'SuperAdmin' || user.role === 'Admin' || user.role === 'Creator') {
      isAdminOnline = true
    }
  })

  // animate the button on hover
  const animatedButton = 'btn btn-warning btn-lg btn-block text-center text-uppercase font-weight-bold shadow-sm animated infinite pulse blink_me'

  return (
    <Row className="mx-1 m-lg-4 px-lg-5 d-flex justify-content-around align-items-center text-primary">

      <div className="dashboard-img d-none d-sm-block">
        <img src={dashimg} alt="dashimg" />
      </div>
      <div className='text-center m-2 m-sm-0'>
        <Alert className='border border-warning'>
          <h4 className="alert-heading">
            <strong>{currentUser && currentUser.name}</strong>
          </h4>
          <p>
            <strong>Welcome to the {currentUser && currentUser.role} dashboard page</strong>
          </p>
          <hr />
          {currentUser.role !== 'Visitor' ?
            <p className="mb-0">
              Here you can add, edit and remove features, cheers!!
            </p> :
            <p className="mb-0">
              Here you can view your scores, downloads and contacts, cheers!!
            </p>
          }
        </Alert>
      </div>

      <div className="">

        {currentUser.role !== 'Visitor' ?
          <ul className="list-unstyled">
            {currentUser.role === 'Admin' || currentUser.role === 'SuperAdmin' ?
              <>
                <li>
                  <small><strong><u>
                    <Link to="/statistics" className="text-info p-0">Statistics</Link>
                  </u></strong></small>
                </li>

                <li>
                  <small><strong><u>
                    <Link to="/broadcasts" className="text-info p-0">Broadcasts</Link>
                  </u></strong></small>
                </li>

                <li>
                  <small><strong><u>
                    <Link to="/subscribers" className="text-info p-0">Subscribers</Link>
                  </u></strong></small>
                </li>

                <li>
                  <small><strong><u>
                    <Link to="/challenges" className="text-info p-0">Challenges</Link>
                  </u></strong></small>
                </li>

                <li>
                  <small><strong><u>
                    <Link to="/logs" className="text-info p-0">User Logs</Link>
                  </u></strong></small>
                </li>
              </> : null}

            <li>
              <small><strong><u>
                <Link to="/schools" className="text-info p-0">Schools</Link>
              </u></strong></small>
            </li>

            <li>
              <small><strong><u>
                <Link to="/contact-chat" className="text-info p-0">Chat</Link>
              </u></strong></small>
            </li>

          </ul> :

          <>
            {
              // IF ADMIN IS ONLINE, SHOW THE CHAT BUTTON
              isAdminOnline ?
                <Button className={animatedButton}>
                  <Link to="/contact-chat" className="text-success p-0">Chat with us now</Link>
                </Button> :
                null}

          </>}
      </div>

    </Row>
  )
}

export default TopRow