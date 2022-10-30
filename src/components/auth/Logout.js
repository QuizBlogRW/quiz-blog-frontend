import React from 'react'
import { NavLink, Button } from 'reactstrap'
import powerOff from '../../images/power-off.svg'
import { connect } from 'react-redux'
import { logout } from '../../redux/auth/auth.actions'

const Logout = ({ logout }) => {

  const logingout = () => {
    var signOut = window.confirm("Log out?")

    if (signOut) {
      logout()
      window.setTimeout(() => window.location.href = "/", 1000)
    }

    else return null
  }

  return (
    <>
      <NavLink onClick={logingout} href="#" className="m-lg-0 px-sm-3">
        <Button color="warning" size="sm" className="p-1">
          <img src={powerOff} alt="logout to quiz blog" width="16" height="16" />
          <span className='ml-1'>Sign Out</span>
        </Button>
      </NavLink>
    </>
  )
}

export default connect(null, { logout })(Logout)