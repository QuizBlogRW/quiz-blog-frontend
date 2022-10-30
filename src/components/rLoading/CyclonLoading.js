import React from 'react'
import ReactLoading from "react-loading"

const CyclonLoading = () => {
    return (
        <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
            <ReactLoading
                type="cylon"
                color="#33FFFC" />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <br />
        </div>
    )
}

export default CyclonLoading