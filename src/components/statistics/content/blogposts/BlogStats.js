import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import TableData from '../TableData'
import ReactLoading from "react-loading"
import { useLocation } from "react-router-dom"

import { getRecentTenViews, getBlogPostsViews } from '../../../../redux/blog/blogPosts/blogPostsViews/blogPostsViews.actions'

const BlogStats = ({ getRecentTenViews, getBlogPostsViews, stats }) => {

    const [blogStats, setBlogStats] = useState([])
    const [blogStatsLoading, setBlogStatsLoading] = useState(false)

    // set the current route
    const location = useLocation()

    // Lifecycle method to get the data according to the current route on mount
    useEffect(() => {
        switch (location.pathname) {

            case "/statistics/recent-ten-views":
                getRecentTenViews()
                break;

            case "/statistics/all-posts-views":
                getBlogPostsViews()
                break;

            default:
                break;
        }
    }, [location, getRecentTenViews, getBlogPostsViews])

    // Updating the state according to the current route and the data returned from the server
    useEffect(() => {
        switch (location.pathname) {

            case "/statistics/recent-ten-views":
                setBlogStats(stats.recentTenViews)
                setBlogStatsLoading(stats.isLoading)
                break;

            case "/statistics/all-posts-views":
                setBlogStats(stats.allBlogPostsViews)
                setBlogStatsLoading(stats.isLoading)
                break;

            default:
                break;
        }
    }, [location, stats])

    // Generate filename 
    const filename = location.pathname.split("/")[2]

    return (
        <div style={{ position: "relative" }} className="p-1 m-1 d-flex justify-content-center align-items-center overflow-auto">

            {blogStatsLoading && blogStatsLoading ?
                <ReactLoading type="bubbles" color="#33FFFC" /> :

                <div className="w-100 ">
                    {
                        blogStats && blogStats.length > 0 ?
                            <TableData data={blogStats} filename={filename} /> :

                            <div className="p-1 m-1 d-flex justify-content-center align-items-center">
                                No blog stats to display
                            </div>
                    }
                </div>
            }
        </div>
    )
}

const mapStateToProps = state => ({ stats: state.blogPostsViewsReducer })

export default connect(mapStateToProps, { getRecentTenViews, getBlogPostsViews })(BlogStats)