import React from 'react'
import { Link } from 'react-router-dom'

const MarksStatus = ({ score, qnLength, passMark }) => {
    return (
        <div className="marks-status">

            {Math.round(score * 100 / qnLength) < passMark ?

                <>
                    <h6 className="text-center text-danger my-3">
                        You failed! you need more reading and practice to succeed. Please contact us for more important books, guidance that may help you.
                    </h6>

                    <Link to="/contact" className="text-success">
                        <button type="button" className="btn btn-outline-success">
                            Contact us for help!
                        </button>
                    </Link>
                </> :
                <>
                    <h6 className="text-center text-success my-3">
                        Congratulations, you passed this test! Remember, the more you practice the more you understand! If you need any related book or help, don't hesitate to contact us!
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