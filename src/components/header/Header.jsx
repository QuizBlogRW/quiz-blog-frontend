import { useState, useContext, useEffect } from 'react'
import { Navbar, NavbarBrand, NavLink, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, ListGroup, ListGroupItem } from 'reactstrap'
import { Link, useLocation } from "react-router-dom"
import { useSelector } from 'react-redux'
import Logout from '@/components/auth/Logout'
import CatDropdown from './CatDropdown'
import logo from '@/images/quizLogo.svg'
import { logRegContext } from '@/contexts/appContexts'
import EditPictureModal from '@/components/auth/EditPictureModal'

const Header = ({ textContent }) => {

    const { user } = useSelector(state => state.auth)
    const { toggleL, toggleR } = useContext(logRegContext)
    const userId = user && user._id

    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [logoutModal, setLogoutModal] = useState(false)

    const toggleDropdown = () => setDropdownOpen(prevState => !prevState)
    const toggleLogoutModal = () => setLogoutModal(prevState => !prevState)

    // location hook from react-router-dom    
    let location = useLocation()

    // intersection observer
    const [scrollPosition, setScrollPosition] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY)
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const isScrolled = scrollPosition > 70

    // small accessibility improvements: add aria labels and Escape-to-close behavior to auth dropdown
    const renderAuthLinks = () => (
        <span className={`mx-0 p-0 d-flex align-items-center toDashboard header-user ${isScrolled ? 'scrolled' : ''}`}>
            <EditPictureModal />
            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} onKeyDown={(e) => { if (e.key === 'Escape') setDropdownOpen(false) }}>
                <DropdownToggle aria-haspopup={true} aria-expanded={dropdownOpen} aria-label="Open profile menu" className='mx-0 px-0'>
                    <span className='profileDropDown mx-0 px-0'>
                        <i className={`fa-solid fa-chevron-${dropdownOpen ? 'up' : 'down'}`} aria-hidden="true"></i>
                    </span>
                </DropdownToggle>

                <DropdownMenu role="menu" aria-label="Profile menu">
                    <DropdownItem header>
                        <ListGroup>
                            <ListGroupItem className='bg-warning'>
                                <h6 className='mb-0 fw-bolder text-white text-uppercase'>{user && user.name ? user?.name?.split(" ")[0] : ''}</h6>
                            </ListGroupItem>
                            {renderProfileLinks()}
                        </ListGroup>
                    </DropdownItem>
                    <DropdownItem text>
                        <Link to="/dashboard" className="text-white" onClick={toggleDropdown}>Dashboard</Link>
                    </DropdownItem>
                    <DropdownItem text>
                        <Link to={`/edit-profile/${user && user._id}`} className="text-white" onClick={toggleDropdown}>Edit Profile</Link>
                    </DropdownItem>
                    <Logout userId={userId} logoutModal={logoutModal} toggleLogoutModal={toggleLogoutModal} />
                </DropdownMenu>
            </Dropdown>
        </span>
    )

    const renderProfileLinks = () => (
        <>
            <ListGroupItem>
                {user && user.school ? (
                    <Link to={`/edit-profile/${user && user._id}`}>
                        <span className={`${user && !user.school ? 'text-danger' : ''}`}>
                            {(user && user.school.title)}
                        </span>
                    </Link>
                ) : (
                    <Link to={`/edit-profile/${user && user._id}`}>Please add a school</Link>
                )}
            </ListGroupItem>
            <ListGroupItem>
                {user && user.level ? (
                    <Link to={`/edit-profile/${user && user._id}`}>
                        <span className={`${user && !user.level ? 'text-danger' : ''}`}>
                            {(user && user.level.title)}
                        </span>
                    </Link>
                ) : (
                    <Link to={`/edit-profile/${user && user._id}`}>Please add a level</Link>
                )}
            </ListGroupItem>
            <ListGroupItem>
                {user && user.faculty ? (
                    <Link to={`/edit-profile/${user && user._id}`}>
                        <span className={`${user && !user.faculty ? 'text-danger' : ''}`}>
                            {(user && user.faculty.title)}
                        </span>
                    </Link>
                ) : (
                    <Link to={`/edit-profile/${user && user._id}`}>Please add a faculty</Link>
                )}
            </ListGroupItem>
            <ListGroupItem>
                {user && user.year ? (
                    <Link to={`/edit-profile/${user && user._id}`}>
                        <span className={`${user && !user.year ? 'text-danger' : ''}`}>
                            {(user && user.year)}
                        </span>
                    </Link>
                ) : (
                    <Link to={`/edit-profile/${user && user._id}`}>Please add a year</Link>
                )}
            </ListGroupItem>
        </>
    )

    const renderGuestLinks = () => (
        <>
            <span className="me-1 me-md-4 login-modal">
                <NavLink onClick={toggleL} className={`header-cta ${isScrolled ? 'scrolled' : ''}`}>
                    {textContent || 'Login'}
                </NavLink>
            </span>
            <span className="me-0 register-modal">
                <NavLink onClick={toggleR} className={`header-cta register ${isScrolled ? 'scrolled' : ''}`}>
                    Register
                </NavLink>
            </span>
        </>
    )

    if (location.pathname.startsWith('/statistics')) {
        return null
    }

    return (
        <header className={`sticky-top site-header ${isScrolled ? 'scrolled' : ''}`} role="banner">
            <Navbar light expand="lg" className="px-0 px-lg-5 pb-2 pt-1 py-md-3">
                <NavbarBrand href="/" className='mb-1 site-brand' aria-label="Quiz-Blog home">
                    <img src={logo} alt="Quiz-Blog Logo" className="site-logo" />
                </NavbarBrand>
                <div className="collapse px-1 px-sm-2 py-1 mx-1 m-sm-0 nav-items">
                    {location.pathname !== '/' && (
                        <Button color="success" size="md" className="ms-1 me-2 px-md-2 me-md-4 back-home d-none d-sm-inline-flex">
                            <Link to="/" className="back-home-link text-white">
                                Back Home
                            </Link>
                        </Button>
                    )}
                    <CatDropdown />
                    <span className="me-1 ms-sm-4 me-md-4">
                        <Link to="/course-notes" className="nav-link-custom">Notes</Link>
                    </span>
                    <span className="me-1 me-md-4">
                        <Link to="/blog" className="nav-link-custom">Blog</Link>
                    </span>
                    <span className="me-1 me-md-4">
                        <Link to="/about" className="nav-link-custom">About</Link>
                    </span>
                    <span className="me-1 me-md-4">
                        <Link to="/contact" className="nav-link-custom">Contact</Link>
                    </span>
                    {user ? renderAuthLinks() : renderGuestLinks()}
                </div>
            </Navbar>
        </header>
    )
}

export default Header
