import React, { useEffect } from 'react'
import { Media, Alert } from 'reactstrap'
import ReactLoading from "react-loading"
import { connect } from 'react-redux'
import moment from 'moment'

import { getBlogPosts } from '../../../redux/blog/blogPosts/blogPosts.actions'
import altImage from '../../../images/dashboard.svg'
import './relatedLatest.css'

const LatestPosts = ({ bposts, getBlogPosts }) => {

    // Lifecycle methods
    useEffect(() => {
        getBlogPosts()
    }, [getBlogPosts])

    return (
        bposts.isLoading ?
            <div className="p-5 m-5 d-flex justify-content-center align-items-center">
                <ReactLoading type="bars" color="#33FFFC" />
            </div> :

            <div className="similar-posts mt-4 mt-lg-2">
                <Alert className='border border-warning text-uppercase'>
                    Latest Posts
                </Alert>

                {bposts && bposts.allBlogPosts && bposts.allBlogPosts.slice(0, 5).map((blogPost) => (

                    <Media key={blogPost._id} className="mt-1 mt-lg-2 p-3 border-bottom blogPost-title d-flex flex-column flex-lg-row">

                        <Media left href="#" className="m-auto d-flex justify-content-center align-items-center relatedLatestImage">
                            <img src={blogPost.post_image || altImage} alt={blogPost.brand} />
                        </Media>

                        <Media body className="w-100">
                            <Media heading className="pl-2 py-lg-0 mb-0 h-100 d-flex flex-column justify-content-between">

                                <h6 className="text-left mt-3 mt-lg-0 mb-2 post-link">
                                    <a href={`/view-blog-post/${blogPost.slug}`} className="font-weight-light">{blogPost.title}</a>
                                </h6>

                                <div className="text-muted m-0">
                                    <p className="mb-1 ml-1">
                                        {blogPost.postCategory && blogPost.postCategory.title}
                                    </p>
                                </div>

                                <div className="d-flex ml-1 justify-content-between text-muted align-bottom">
                                    <small>
                                        {blogPost.creator && blogPost.creator.name}
                                    </small>

                                    <small className={`text-primary`}>
                                        {moment(blogPost && blogPost.createdAt).format('YYYY-MM-DD')}
                                    </small>

                                </div>
                            </Media>

                        </Media>

                    </Media>
                ))}
            </div>
    )
}

const mapStateToProps = state => ({
    bposts: state.blogPostsReducer
})

export default connect(mapStateToProps, { getBlogPosts })(LatestPosts)