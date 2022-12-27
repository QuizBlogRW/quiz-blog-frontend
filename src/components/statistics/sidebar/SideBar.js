import React from "react"
import '@fortawesome/fontawesome-free/css/fontawesome.min.css'
import { NavItem, NavLink, Nav } from "reactstrap"
import { Link } from "react-router-dom"

import SubMenu from "./SubMenu"

const SideBar = ({ isOpen, toggle }) => (

  <div className={isOpen ? "sidebar is-open" : "sidebar"}>

    <div className="sidebar-header">
      <span color="info" onClick={toggle} style={{ color: "#fff" }}>
        &times;
      </span>
      <h3>Quiz Blog Statistics</h3>
    </div>

    <div className="side-menu">
      <Nav vertical className="list-unstyled pb-3">

        <p>Titles</p>

        <SubMenu title="Users" icon={'user'} items={submenus[0]} />
        <SubMenu title="Users Stats" icon={'group'} items={submenus[1]} />
        <SubMenu title="Quizzes" icon={'keyboard-o'} items={submenus[2]} />
        <SubMenu title="Notes" icon={'book'} items={submenus[3]} />

        <NavItem>
          <NavLink tag={Link} to={"/statistics/about"}>
            <i className="fa fa-address-book mr-2"></i>
            About
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink tag={Link} to={"/statistics/blogposts"}>
            <i className="fa fa-info mr-2"></i>
            Blog Posts
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink tag={Link} to={"/statistics/faqs"}>
            <i className="fa fa-question mr-2"></i>
            FAQs
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink tag={Link} to={"/statistics/contacts"}>
            <i className="fa fa-address-card-o mr-2"></i>
            Contacts
          </NavLink>
        </NavItem>
        
      </Nav>
    </div>
  </div>
);

const submenus = [
  [
    {
      title: "50 Newest Users",
      target: "new-50-users",
    },
    {
      title: "20 With Image",
      target: "20-with-image",
    },
    {
      title: "20 With School",
      target: "20-with-school",
    },
    {
      title: "20 With Level",
      target: "20-with-level",
    },
    {
      title: "20 With Faculty",
      target: "20-with-faculty",
    },
    {
      title: "20 With Interests",
      target: "20-with-interests",
    },
    {
      title: "20 With About",
      target: "20-with-about",
    },
  ],
  [
    {
      title: "Top 20 Quizzing",
      target: "top-20-quizzing",
    },
    {
      title: "Top 20 Downloaders",
      target: "top-20-downloaders",
    },
  ],
  [
    {
      title: "Top 20 Quizzes",
      target: "top-20-quizzes",
    },
    {
      title: "Quizzes Stats",
      target: "quizzes-stats",
    },
  ],
  [
    {
      title: "Top 20 Notes",
      target: "top-20-notes",
    },
    {
      title: "Notes Stats",
      target: "notes-stats",
    },
  ],
];

export default SideBar;
