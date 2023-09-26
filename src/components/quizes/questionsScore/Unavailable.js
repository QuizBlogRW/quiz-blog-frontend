import React from 'react'

const Unavailable = ({ title, link, more }) => {
    return (
        <div className="d-flex justify-content-center align-items-center">
            <h4
                className="py-lg-2 text-danger"
                style={{ fontSize: "1rem", fontWeight: "bold", }}
                >
                {title}
                <a href={link}>
                    &nbsp;<u>click here for more {more}</u>
                </a>
            </h4>
        </div>
    )
}

export default Unavailable
