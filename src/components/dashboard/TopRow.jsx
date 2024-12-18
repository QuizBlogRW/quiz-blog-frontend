import React from 'react'
import { Alert, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import dashimg from '../../images/dashboard.svg'
import { useSelector } from "react-redux"

const TopRow = () => {

  const currentUser = useSelector(state => state.auth && state.auth.user)

  // animate the button on hover
  const animatedButton = 'btn btn-warning btn-lg btn-block text-center text-uppercase fw-bolder shadow-sm animated infinite pulse blink_me'

  return (

    <div className="mx-1 m-lg-4 px-lg-5 d-flex justify-content-around align-items-center text-primary">

      <div className="dashboard-img d-none d-sm-inline w-auto">
        <img src={dashimg} alt="dashimg" />
      </div>

      <div className='text-center m-2 m-sm-0'>
        <Alert style={{ background: '#ffc107', color: '#157A6E', border: '2px solid #157A6E' }}>
          <h4 className="alert-heading">
            <strong>
              {currentUser && currentUser.name.toLowerCase().charAt(0).toUpperCase() + currentUser.name.slice(1)}
            </strong>
          </h4>
          <p>
            <strong>Welcome to the {currentUser && currentUser.role} dashboard page</strong>
          </p>
          <hr />
          {currentUser.role !== 'Visitor' ?
            <p className="mb-0">
              Here you can add, edit and remove features, cheers!!
            </p> :
            <p className="mb-0" style={{ fontSize: '.9rem', color: '#FFF' }}>
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
                    <Link to="/statistics" style={{ color: '#157A6E', fontWeight: 'bolder' }} className="p-0">Statistics</Link>
                  </u></strong></small>
                </li>

                <li>
                  <small><strong><u>
                    <Link to="/broadcasts" style={{ color: '#157A6E', fontWeight: 'bolder' }} className="p-0">Broadcasts</Link>
                  </u></strong></small>
                </li>

                <li>
                  <small><strong><u>
                    <Link to="/subscribers" style={{ color: '#157A6E', fontWeight: 'bolder' }} className="p-0">Subscribers</Link>
                  </u></strong></small>
                </li>
              </> : null}

            <li>
              <small><strong><u>
                <Link to="/schools" style={{ color: '#157A6E', fontWeight: 'bolder' }} className="p-0">Schools</Link>
              </u></strong></small>
            </li>

            <li>
              <small><strong><u>
                <Link to="/contact-chat" style={{ color: '#157A6E', fontWeight: 'bolder' }} className="p-0">Chat</Link>
              </u></strong></small>
            </li>

          </ul> :

          <>
            {
              <Button className={animatedButton}>
                <Link to="/contact-chat" className="text-success p-0">Chat with us now</Link>
              </Button>}

          </>}
      </div>

    </div>
  )
}

export default TopRow