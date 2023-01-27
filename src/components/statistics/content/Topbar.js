import React, { useState, useContext } from "react"
import { Navbar, Button, NavbarToggler, Collapse, Nav, NavItem, NavLink } from "reactstrap"
import { Link } from "react-router-dom"
import Logout from '../../auth/Logout'
import { currentUserContext } from '../../../appContexts'

const Topbar = ({ toggleSidebar }) => {

  // context 
  const currentUser = useContext(currentUserContext)

  const [topbarIsOpen, setTopbarOpen] = useState(true)
  const toggleTopbar = () => setTopbarOpen(!topbarIsOpen)

  const userName = currentUser && currentUser.name

  return (
    <Navbar color="light" light 
    className="navbar shadow-sm p-3 my-2 bg-white rounded" expand="md"
      style={{ position: "sticky", top: "0", zIndex: "2"}}>

      <Button color="info" onClick={toggleSidebar}>
        <i className="fa fa-align-left mr-2"></i>
      </Button>

      <NavbarToggler onClick={toggleTopbar} />
      <Collapse isOpen={topbarIsOpen} navbar>

        <strong className="font-weight-bold ml-4">
          {userName && userName}
          </strong>

        <Nav className="ml-auto align-items-center" navbar>

          <NavItem>
            <NavLink tag={Link} to={"/"} className="text-success font-weight-bold">
              Home
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink tag={Link} to={"/webmaster"} className="text-success font-weight-bold">
              Webmaster
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink tag={Link} to={"/course-notes"} className="text-success font-weight-bold">
              Notes
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink tag={Link} to={"/blog"} className="text-success font-weight-bold">
              Blog
            </NavLink>
          </NavItem>

          <NavItem>
              <Logout />
          </NavItem>

        </Nav>

      </Collapse>
    </Navbar>
  )
}
export default Topbar
