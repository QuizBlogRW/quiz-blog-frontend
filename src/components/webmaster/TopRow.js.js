import React from 'react'
import { Row, Alert } from 'reactstrap'
import { Link } from 'react-router-dom'
import dashimg from '../../images/dashboard.svg'

const TopRow = ({ currentUser }) => {

  return (
    <Row className="m-lg-4 px-lg-5 d-flex justify-content-around align-items-center text-primary">

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
          null}
      </div>

    </Row>
  )
}

export default TopRow