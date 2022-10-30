import React from 'react'

const Unavailable = ({ title, link, more }) => {
    return (
        <div className="py-4 d-flex justify-content-center align-items-center">
            <h4 className="py-lg-2 my-lg-2 text-danger text-uppercase">{title}! 
            <a href={link}>   click here for more {more}</a></h4>
        </div>
    )
}

export default Unavailable
