import React from "react"
import { Container } from "reactstrap"
import { Outlet } from "react-router-dom"

import Topbar from "./Topbar"

const Content = ({ sidebarIsOpen, toggleSidebar, auth }) => (
  <Container fluid className={sidebarIsOpen ? "content is-open" : "content"}>

    <Topbar toggleSidebar={toggleSidebar} auth={auth} />

    <Outlet />
  </Container>
)

export default Content
