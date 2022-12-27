import React, { useEffect } from 'react'
import ReactLoading from "react-loading"
import { connect } from 'react-redux'
import { get50NewUsers } from '../../../../redux/statistics/statistics.actions'
import TableData from '../TableData'

const New50Users = ({ get50NewUsers, stats }) => {

    // Create a new array of users from the state object
    const users50 = stats && stats.new50Users

    // Lifecycle methods
    useEffect(() => {
        get50NewUsers()
    }, [get50NewUsers])

    const titles = []

    // Push the user object keys into the array of titles
    if (typeof users50[0] === "object" && users50[0] !== null) {
        const keys = Object.keys(users50[0]);
        titles.push(keys)
    } else {
        console.log("Object is not an object or is null");
    }

    return (
        <div style={{position: "relative"}} className="p-1 m-1 d-flex justify-content-center align-items-center overflow-auto">

            {stats.new50UsersLoading ?
                <ReactLoading type="bubbles" color="#33FFFC" /> :
                <div className="w-100 ">
                    {
                        users50 && users50.length > 0 ?
                            <TableData data={users50} filename="50 New Users"/> :

                            <div className="p-1 m-1 d-flex justify-content-center align-items-center">
                                <ReactLoading type="bubbles" color="#33FFFC" />No new users available!
                            </div>
                    }
                </div>
            }
        </div>
    )
}

const mapStateToProps = state => ({ stats: state.statisticsReducer })

export default connect(mapStateToProps, { get50NewUsers })(New50Users)