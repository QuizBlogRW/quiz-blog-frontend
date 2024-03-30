import React, { useState, useContext } from "react"
import { Button } from "reactstrap"
import SideBar from "./sidebar/SideBar"
import Content from "./content/Content"
import Dashboard from "../dashboard/Dashboard"
import QBLoadingSM from "../rLoading/QBLoadingSM"
import "./statistics.css"
import { authContext, logRegContext } from "../../appContexts"

const Statistics = () => {

  // context
  const auth = useContext(authContext)
  const { toggleL } = useContext(logRegContext)

  const [sidebarIsOpen, setSidebarOpen] = useState(true)
  const toggleSidebar = () => setSidebarOpen(!sidebarIsOpen)

  return (

    auth.isAuthenticated ?

      auth.user.role !== 'Visitor' ?

        <div className="Statistics wrapper">
          <SideBar toggle={toggleSidebar} isOpen={sidebarIsOpen} />
          <Content toggleSidebar={toggleSidebar} sidebarIsOpen={sidebarIsOpen} />
        </div> :

        <Dashboard /> :

      // If not authenticated or loading
      <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
        {
          auth.isLoading ?
            <QBLoadingSM /> :
            <Button color="link" className="fw-bolder my-5 border rounded" onClick={toggleL} style={{ backgroundColor: "#ffc107", color: "#157A6E", fontSize: "1.5vw", boxShadow: "-2px 2px 1px 2px #157A6E", border: "2px solid #157A6E" }}>
              Login first
            </Button>
        }
      </div>
  )
}

export default Statistics
