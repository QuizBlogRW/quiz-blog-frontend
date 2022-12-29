import React from "react"
import { Container } from "reactstrap"
import { Outlet } from "react-router-dom"

import Topbar from "./Topbar"
import Charts from "./Charts"

const Content = ({ sidebarIsOpen, toggleSidebar, auth }) => (
  <Container fluid className={sidebarIsOpen ? "content is-open" : "content"}>

    <Topbar toggleSidebar={toggleSidebar} auth={auth} />
    
    {
      (window.location.pathname === "/statistics" || window.location.pathname === "/statistics/") && <Charts />
    }

    <Outlet />
  </Container>
)

export default Content
