import { useState, useRef, useEffect } from 'react'
import { Link } from "react-router-dom"
import { useSelector } from 'react-redux'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap'

const CatDropdown = ({ clr }) => {

    const categories = useSelector(state => state.categories)
    const [isOpen, setIsOpen] = useState(false)
    const toggle = () => setIsOpen(prev => !prev)
    const toggleRef = useRef(null)

    // close on Escape for accessibility
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape' && isOpen) setIsOpen(false)
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [isOpen])

    // close when clicking outside (simple guard)
    useEffect(() => {
        const onDoc = (e) => {
            if (isOpen && toggleRef.current && !toggleRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('click', onDoc)
        return () => document.removeEventListener('click', onDoc)
    }, [isOpen])

    if (categories.isLoading) return null

    const count = categories.allcategories ? categories.allcategories.length : 0

    return (
        <Dropdown innerRef={toggleRef} isOpen={isOpen} toggle={toggle} className="profileDropDown position-static">

            <DropdownToggle className="bg-transparent border-0 profileDropDown-btn cat-dropdown-toggle" aria-haspopup="menu" aria-expanded={isOpen} aria-label="Open quizzes categories">
                <span className='me-1'>
                    Quizzes <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'} ms-lg-1`} aria-hidden="true"></i>
                </span>
            </DropdownToggle>

            <DropdownMenu className="cat-dropdown-menu" onClick={() => setIsOpen(false)} role="menu" aria-label="Quizzes categories menu">
                <DropdownItem header className="d-flex justify-content-between align-items-center">
                    <strong className="text-uppercase">Categories</strong>
                    <small className="text-muted">{count} {count === 1 ? 'category' : 'categories'}</small>
                </DropdownItem>

                <DropdownItem text className="text-uppercase d-flex justify-content-end align-items-center">
                    <Button className="cat-close-btn btn-sm" onClick={() => setIsOpen(false)} aria-label="Close categories">Close</Button>
                </DropdownItem>

                {(!categories.allcategories || categories.allcategories.length === 0) && (
                    <DropdownItem text className="my-1 text-muted">
                        No categories available
                    </DropdownItem>
                )}

                {categories.allcategories && categories.allcategories.map(category => (
                    <DropdownItem text key={category._id} className="my-1 text-uppercase">
                        <Link to={`/category/${category._id}`} className="text-decoration-none cat-dropdown-link" onClick={() => setIsOpen(false)} aria-label={`Open category ${category.title}`}>
                            {category.title}
                        </Link>
                    </DropdownItem>))}
            </DropdownMenu>
        </Dropdown>
    )
}

export default CatDropdown