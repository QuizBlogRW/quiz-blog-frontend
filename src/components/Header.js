import React, { useState, useContext } from 'react'
import { Collapse, Navbar, NavbarBrand, Nav, NavbarText, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, ListGroup, ListGroupItem } from 'reactstrap'
import { Link, useLocation } from "react-router-dom"
import RegisterModal from './auth/RegisterModal'
import LoginModal from './auth/LoginModal'
import Logout from './auth/Logout'
import CatDropdown from './CatDropdown'
import logo from '../images/quizLogo.svg'
import '@fortawesome/fontawesome-free/css/fontawesome.min.css'
import EditPictureModal from './auth/EditPictureModal'
import { authContext, currentUserContext } from '../appContexts'

const Header = () => {

    // context
    const auth = useContext(authContext)
    const currentUser = useContext(currentUserContext)

    // state
    const [isOpen, setIsOpen] = useState(false)
    const toggle = () => setIsOpen(!isOpen)
    
    let location = useLocation()

    const authLinks = (
        <>
            <NavbarText className="mx-0 p-0 mr-1 text-warning d-flex justify-content-center align-items-center toDashboard">

                <EditPictureModal />

                <Link to="/#">
                    <small className="text-warning ml-2 d-none d-lg-flex">
                        {currentUser && currentUser ? currentUser.name.split(" ")[0] : ''}
                    </small>
                </Link>

                <Dropdown isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
                    <DropdownToggle>
                        <span className='profileDropDown mx-2 mx-lg-3'>
                            <i className={`fa fa-angle-${isOpen ? 'up' : 'down'}`}></i>
                        </span>
                    </DropdownToggle>

                    <DropdownMenu onClick={toggle}>
                        <DropdownItem header>
                            <ListGroup>

                                <ListGroupItem className='bg-warning'>
                                    <h6 className='mb-0 font-weight-bolder text-white text-uppercase'>{currentUser && currentUser ? currentUser.name.split(" ")[0] : ''}</h6></ListGroupItem>

                                <ListGroupItem>
                                    {currentUser && currentUser.school ?
                                        <Link to={`/edit-profile/${currentUser && currentUser._id}`}>
                                            <span className={`${currentUser && !currentUser.school ? 'text-danger' : ''}`}>
                                                {(currentUser && currentUser.school.title)}
                                            </span>
                                        </Link> :
                                        <Link to={`/edit-profile/${currentUser && currentUser._id}`}>
                                            Please add a school
                                        </Link>}
                                </ListGroupItem>

                                <ListGroupItem>
                                    {currentUser && currentUser.level ?
                                        <Link to={`/edit-profile/${currentUser && currentUser._id}`}>
                                            <span className={`${currentUser && !currentUser.level ? 'text-danger' : ''}`}>
                                                {(currentUser && currentUser.level.title)}
                                            </span>
                                        </Link> :
                                        <Link to={`/edit-profile/${currentUser && currentUser._id}`}>
                                            Please add a level
                                        </Link>}
                                </ListGroupItem>

                                <ListGroupItem>
                                    {currentUser && currentUser.faculty ?
                                        <Link to={`/edit-profile/${currentUser && currentUser._id}`}>
                                            <span className={`${currentUser && !currentUser.faculty ? 'text-danger' : ''}`}>
                                                {(currentUser && currentUser.faculty.title)}
                                            </span>
                                        </Link> :
                                        <Link to={`/edit-profile/${currentUser && currentUser._id}`}>
                                            Please add a faculty
                                        </Link>}
                                </ListGroupItem>

                                <ListGroupItem>
                                    {currentUser && currentUser.year ?
                                        <Link to={`/edit-profile/${currentUser && currentUser._id}`}>
                                            <span className={`${currentUser && !currentUser.year ? 'text-danger' : ''}`}>
                                                {(currentUser && currentUser.year)}
                                            </span>
                                        </Link> :
                                        <Link to={`/edit-profile/${currentUser && currentUser._id}`}>
                                            Please add a year
                                        </Link>}
                                </ListGroupItem>
                            </ListGroup>
                        </DropdownItem>

                        <DropdownItem text>
                            <Link to="/webmaster">
                                Dashboard
                            </Link>
                        </DropdownItem>

                        <DropdownItem text>
                            <Link to={`/edit-profile/${currentUser && currentUser._id}`}>
                                Edit Profile
                            </Link>
                        </DropdownItem>

                        <DropdownItem text className='d-flex'>
                            <Logout />
                        </DropdownItem>

                    </DropdownMenu>

                </Dropdown>
            </NavbarText>

            <NavbarText className="logout ml-1 d-none">
                <Logout />
            </NavbarText>
        </>)

    const guestLinks = (<>
        <NavbarText className="mr-1 login-modal">
            <LoginModal />
        </NavbarText>
        <NavbarText className="mr-1 register-modal">
            <RegisterModal />
        </NavbarText>
    </>)

    // If the route starts with /statistics, then don't show the footer
    if (location.pathname.startsWith('/statistics')) {
        return null

    } else
        return (
            <header style={{ boxShadow: "0 2px 10px -1px rgba(0,0,0,0.75)" }} className="sticky-top">

                <Navbar color="primary" light expand="lg" className="px-0 px-lg-5 py-md-3">
                    <NavbarBrand href="/" className="text-white" style={{ fontWeight: "900" }}>
                        <img src={logo} alt="Quiz Blog Logo" />
                    </NavbarBrand>

                    <Collapse navbar className="mx-2 py-1 m-sm-0">
                        <Nav className="mr-auto d-none d-lg-flex" navbar></Nav>

                        {
                            location.pathname !== '/' ?

                                <Button color="success" size="md" className="ml-1 mr-2 px-md-2 mr-md-4 back-home">
                                    <Link to="/" className="text-white back-home-link">Back Home</Link>
                                </Button> : null}

                        <CatDropdown />

                        <NavbarText className="mr-2 mr-md-4">
                            <Link to="/course-notes" className="text-white">Notes</Link>
                        </NavbarText>
                        <NavbarText className="mr-1 mr-md-4">
                            <Link to="/blog" className="text-white">Blog</Link>
                        </NavbarText>
                        <NavbarText className="mr-1 mr-md-4">
                            <Link to="/about" className="text-white">About</Link>
                        </NavbarText>
                        <NavbarText className="mr-0 mr-md-4">
                            <Link to="/contact" className="text-white">Contact</Link>
                        </NavbarText>
                        {auth.isAuthenticated ? authLinks : guestLinks}
                    </Collapse>

                </Navbar>
            </header>
        )
}

export default Header