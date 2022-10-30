import React, { useState } from 'react'
import { Link } from "react-router-dom"
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

const CatDropdown = ({ categories }) => {

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

                    {categories.allcategories && categories.allcategories.map(category => (
                        <DropdownItem text key={category._id} className="my-1 text-uppercase">
                            <Link to={`/category/${category._id}`}>
                                {category.title}
                            </Link>
                        </DropdownItem>))}
                </DropdownMenu>
            </Dropdown>
    )
}

export default CatDropdown