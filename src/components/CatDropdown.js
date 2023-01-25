import React, { useState, useContext } from 'react'
import { Link } from "react-router-dom"
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap'
import { categoriesContext } from '../appContexts'

const CatDropdown = () => {

    // context
    const categories = useContext(categoriesContext)

    const [isOpen, setIsOpen] = useState(false)
    const toggle = () => setIsOpen(!isOpen)

    return (
        categories.isLoading ? null :

            <Dropdown isOpen={isOpen} toggle={toggle} className="profileDropDown">
                <DropdownToggle className="bg-transparent border-0 px-0 profileDropDown-btn">
                    <span className='mx-1 mx-lg-3'>
                        Quizes <i className={`fa fa-angle-${isOpen ? 'up' : 'down'}`}></i>
                    </span>
                </DropdownToggle>

                <DropdownMenu style={{ backgroundColor: "#157A6E", width: "max-content" }} className="mt-3 mt-lg-4" onClick={toggle}>

                    <DropdownItem text className="my-3 text-uppercase d-flex justify-content-end align-items-center" onClick={toggle}>
                        {/* The close button */}
                        <Button className="btn-danger text-uppercase text-red">
                            X
                        </Button>
                    </DropdownItem>

                    {categories.allcategories && categories.allcategories.map(category => (
                        <DropdownItem text key={category._id} className="my-1 text-uppercase">
                            <Link to={`/category/${category._id}`}>
                                {category.title}
                            </Link>
                        </DropdownItem>))}

                    {/* The close button */}

                    <DropdownItem text className="my-3 text-uppercase d-flex justify-content-end align-items-center" onClick={toggle}>
                        {/* The close button */}
                        <Button className="btn-danger text-uppercase text-red">
                            X
                        </Button>
                    </DropdownItem>

                </DropdownMenu>
            </Dropdown>
    )
}

export default CatDropdown