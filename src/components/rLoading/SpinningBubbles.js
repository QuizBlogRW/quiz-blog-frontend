import React from 'react'
import ReactLoading from "react-loading"

const SpinningBubbles = ({ title }) => {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
            <ReactLoading
                type="spinningBubbles"
                color="#33FFFC"
            />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <br />
            <p className="d-block">Loading {title || `user`} ...</p>
        </div>
    )
}

export default SpinningBubbles