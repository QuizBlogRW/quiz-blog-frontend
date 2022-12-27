import React, { useState } from "react"
import SideBar from "./sidebar/SideBar"
import Content from "./content/Content"
import Webmaster from "../webmaster/Webmaster"
import SpinningBubbles from "../rLoading/SpinningBubbles"
import LoginModal from "../auth/LoginModal"
import "./statistics.css"

const Statistics = ({ auth }) => {
  const [sidebarIsOpen, setSidebarOpen] = useState(true)
  const toggleSidebar = () => setSidebarOpen(!sidebarIsOpen)

  return (

    auth.isAuthenticated ?

      auth.user.role !== 'Visitor' ?

        <div className="Statistics wrapper">
          <SideBar toggle={toggleSidebar} isOpen={sidebarIsOpen} />
          <Content toggleSidebar={toggleSidebar} sidebarIsOpen={sidebarIsOpen} auth={auth} />
        </div> :

        <Webmaster auth={auth} /> :

      // If not authenticated or loading
      <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
        {
          auth.isLoading ?
            <SpinningBubbles /> :
            <LoginModal
              textContent={'Login first'}
              textColor={'text-danger font-weight-bolder my-5 border rounded'}
              isAuthenticated={auth.isAuthenticated} />
        }
      </div>
  )
}

export default Statistics
