import React from 'react'
import { Link } from 'react-router-dom'

const MarksStatus = ({ score, qnLength, passMark }) => {
    return (
        <div className="marks-status">

            {Math.round(score * 100 / qnLength) < passMark ?

                <>
                    <h6 className="text-center text-danger my-5" style={{ fontSize: "1.2rem" }}>
                        Your efforts fell short this time. To achieve success, it's essential to dedicate more time to reading and practicing. 
                        <br />Please contact us for more important books, guidance that may help you.
                    </h6>

                    <Link to="/contact" className="text-success">
                        <button type="button" className="btn btn-outline-success">
                            Contact us for help!
                        </button>
                    </Link>
                </> :
                <>
                    <h6 className="text-center text-success my-5" style={{ fontSize: "1.2rem" }}>
                        Congratulations on passing the test! Practice leads to deeper understanding. Reach out for related books or assistance anytime!
                    </h6>
                    <Link to="/contact" className="text-success">
                        <button type="button" className="btn btn-outline-success">
                            Contact us for help!
                        </button>
                    </Link>
                </>}
        </div>
    )
}

export default MarksStatus