import React, { useState, useContext } from "react"
import SideBar from "./sidebar/SideBar"
import Content from "./content/Content"
import Webmaster from "../webmaster/Webmaster"
import SpinningBubbles from "../rLoading/SpinningBubbles"
import LoginModal from "../auth/LoginModal"
import "./statistics.css"
import { authContext } from "../../appContexts"

const Statistics = () => {

  // context
  const auth = useContext(authContext)

  const [sidebarIsOpen, setSidebarOpen] = useState(true)
  const toggleSidebar = () => setSidebarOpen(!sidebarIsOpen)

  return (

    auth.isAuthenticated ?

      auth.user.role !== 'Visitor' ?

        <div className="Statistics wrapper">
          <SideBar toggle={toggleSidebar} isOpen={sidebarIsOpen} />
          <Content toggleSidebar={toggleSidebar} sidebarIsOpen={sidebarIsOpen} />
        </div> :

        <Webmaster /> :

      // If not authenticated or loading
      <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
        {
          auth.isLoading ?
            <SpinningBubbles /> :
            <LoginModal
              textContent={'Login first'}
              textColor={'text-danger font-weight-bolder my-5 border rounded'} />
        }
      </div>
  )
}

export default Statistics
