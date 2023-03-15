import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { get50NewUsers, getAllUsers, getUsersWithImage, getUsersWithSchool, getUsersWithLevel, getUsersWithFaculty, getUsersWithInterests, getUsersWithAbout, getTop100Quizzing, getTop100Downloaders, getTop20Quizzes, getQuizzesStats, getTop20Notes, getNotesStats, getQuizCategoriesStats, getNotesCategoriesStats } from '../../../../redux/statistics/statistics.actions'

import TableData from '../TableData'
import ReactLoading from "react-loading"
import { useLocation } from "react-router-dom"

const UsersStats = ({ get50NewUsers, getAllUsers, getUsersWithImage, getUsersWithSchool, getUsersWithLevel, getUsersWithFaculty, getUsersWithInterests, getUsersWithAbout, getTop100Quizzing, getTop100Downloaders, getTop20Quizzes, getQuizzesStats, getTop20Notes, getNotesStats, getQuizCategoriesStats, getNotesCategoriesStats, stats }) => {

    const [usersStats, setUsersStats] = useState([])
    const [usersStatsLoading, setUsersStatsLoading] = useState(false)

    // set the current route
    const location = useLocation()

    // Lifecycle method to get the data according to the current route on mount
    useEffect(() => {
        switch (location.pathname) {

            case "/statistics/new-50-users":
                get50NewUsers()
                break;

            case "/statistics/all-users":
                getAllUsers()
                break;

            case "/statistics/with-image":
                getUsersWithImage()
                break;

            case "/statistics/with-school":
                getUsersWithSchool()
                break;

            case "/statistics/with-level":
                getUsersWithLevel()
                break;

            case "/statistics/with-faculty":
                getUsersWithFaculty()
                break;

            case "/statistics/with-interests":
                getUsersWithInterests()
                break;

            case "/statistics/with-about":
                getUsersWithAbout()
                break;

            case "/statistics/top-100-quizzing":
                getTop100Quizzing()
                break;

            case "/statistics/top-100-downloaders":
                getTop100Downloaders()
                break;

            case "/statistics/top-20-quizzes":
                getTop20Quizzes()
                break;

            case "/statistics/quizzes-stats":
                getQuizzesStats()
                break;

            case "/statistics/top-20-notes":
                getTop20Notes()
                break;

            case "/statistics/notes-stats":
                getNotesStats()
                break;

            case "/statistics/quiz-categories-stats":
                getQuizCategoriesStats()
                break;

            case "/statistics/notes-categories-stats":
                getNotesCategoriesStats()
                break;

            default:
                break;
        }
    }, [location, get50NewUsers, getAllUsers, getUsersWithImage, getUsersWithSchool, getUsersWithLevel, getUsersWithFaculty, getUsersWithInterests, getUsersWithAbout, getTop100Quizzing, getTop100Downloaders, getTop20Quizzes, getQuizzesStats, getTop20Notes, getNotesStats, getQuizCategoriesStats, getNotesCategoriesStats])

    // Updating the state according to the current route and the data returned from the server
    useEffect(() => {
        switch (location.pathname) {

            case "/statistics/new-50-users":
                setUsersStats(stats.new50Users)
                setUsersStatsLoading(stats.is50newUsersLoading)
                break;

            case "/statistics/all-users":
                setUsersStats(stats.allUsers)
                setUsersStatsLoading(stats.isAllUsersLoading)
                break;

            case "/statistics/with-image":
                setUsersStats(stats.usersWithImage)
                setUsersStatsLoading(stats.isUsersWithImageLoading)
                break;

            case "/statistics/with-school":
                setUsersStats(stats.usersWithSchool)
                setUsersStatsLoading(stats.isUsersWithSchoolLoading)
                break;

            case "/statistics/with-level":
                setUsersStats(stats.usersWithLevel)
                setUsersStatsLoading(stats.isUsersWithLevelLoading)
                break;

            case "/statistics/with-faculty":
                setUsersStats(stats.usersWithFaculty)
                setUsersStatsLoading(stats.isUsersWithFacultyLoading)
                break;

            case "/statistics/with-interests":
                setUsersStats(stats.usersWithInterests)
                setUsersStatsLoading(stats.isUsersWithInterestsLoading)
                break;

            case "/statistics/with-about":
                setUsersStats(stats.usersWithAbout)
                setUsersStatsLoading(stats.isusersWithAboutLoading)
                break;

            case "/statistics/top-100-quizzing":
                setUsersStats(stats.top100Quizzing)
                setUsersStatsLoading(stats.isTop100QuizzingLoading)
                break;

            case "/statistics/top-100-downloaders":
                setUsersStats(stats.top100Downloaders)
                setUsersStatsLoading(stats.isTop100DownloadersLoading)
                break;

            case "/statistics/top-20-quizzes":
                setUsersStats(stats.top20Quizzes)
                setUsersStatsLoading(stats.isTop20QuizzesLoading)
                break;

            case "/statistics/quizzes-stats":
                setUsersStats(stats.quizzesStats)
                setUsersStatsLoading(stats.isQuizzesStatsLoading)
                break;

            case "/statistics/top-20-notes":
                setUsersStats(stats.top20Notes)
                setUsersStatsLoading(stats.isTop20NotesLoading)
                break;

            case "/statistics/notes-stats":
                setUsersStats(stats.notesStats)
                setUsersStatsLoading(stats.isNotesStatsLoading)
                break;
            
            case "/statistics/quiz-categories-stats":
                setUsersStats(stats.quizCategoriesStats)
                setUsersStatsLoading(stats.isQuizCategoriesStatsLoading)
                break;

            case "/statistics/notes-categories-stats":
                setUsersStats(stats.notesCategoriesStats)
                setUsersStatsLoading(stats.isNotesCategoriesStatsLoading)
                break;

            default:
                break;
        }
    }, [location, stats])

    // Generate filename 
    const filename = location.pathname.split("/")[2]

    return (
        <div style={{ position: "relative" }} className="p-1 m-1 d-flex justify-content-center align-items-center overflow-auto">

            {usersStatsLoading && usersStatsLoading ?
                <ReactLoading type="bubbles" color="#33FFFC" /> :

                <div className="w-100 ">
                    {
                        usersStats && usersStats.length > 0 ?
                            <TableData data={usersStats} filename={filename} /> :

                            <div className="p-1 m-1 d-flex justify-content-center align-items-center">
                                No data to display
                            </div>
                    }
                </div>
            }
        </div>
    )
}

const mapStateToProps = state => ({ stats: state.statisticsReducer })

export default connect(mapStateToProps, { get50NewUsers, getAllUsers, getUsersWithImage, getUsersWithSchool, getUsersWithLevel, getUsersWithFaculty, getUsersWithInterests, getUsersWithAbout, getTop100Quizzing, getTop100Downloaders, getTop20Quizzes, getQuizzesStats, getTop20Notes, getNotesStats, getQuizCategoriesStats, getNotesCategoriesStats })(UsersStats)