import React, { useState } from "react"
import { Collapse, NavItem, NavLink } from "reactstrap"
import { Link } from "react-router-dom"

const SubMenu = ({ icon, title, items }) => {

  const [collapsed, setCollapsed] = useState(true)
  const toggle = () => setCollapsed(!collapsed)

  return (
    <div>
      <NavItem onClick={toggle} className={!collapsed ? "menu-open" : ""}>

        <NavLink className="dropdown-toggle">
          <i className={`fa fa-${icon} mr-2`}></i>
          {title}
        </NavLink>
      </NavItem>

      <Collapse isOpen={!collapsed} navbar className={!collapsed ? "items-menu mb-1" : "items-menu"}>

        {items.map((item, index) => (
          <NavItem key={index} className="pl-4">
            <NavLink tag={Link} to={`/statistics/${item.target}`}>
              {item.title}
            </NavLink>
          </NavItem>
        ))}
      </Collapse>
    </div>
  )
}

export default SubMenu
