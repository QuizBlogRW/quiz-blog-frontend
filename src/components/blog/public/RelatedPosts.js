import React, { useEffect } from 'react'
import { Media, Alert } from 'reactstrap'
import ReactLoading from "react-loading"
import { connect } from 'react-redux'
import { getBlogPostsByCategory } from '../../../redux/blog/blogPosts/blogPosts.actions'
import altImage from '../../../images/dashboard.svg'
import './relatedLatest.css'

const RelatedPosts = ({ bPCatID, bposts, getBlogPostsByCategory }) => {

    useEffect(() => {
        getBlogPostsByCategory(bPCatID)
    }, [getBlogPostsByCategory, bPCatID])

    return (

        bposts.isLoading ?
            <div className="p-5 m-5 d-flex justify-content-center align-items-center">
                <ReactLoading type="bars" color="#33FFFC" />
            </div> :

            <div className="similar-posts mt-4 mt-lg-2">
                <Alert className='border border-warning text-uppercase mb-0'>
                    Related Posts
                </Alert>

                {bposts && bposts.blogPostsByCategory && bposts.blogPostsByCategory.sort(() => 0.5 - Math.random()).slice(0, 7).map(blogPost => (

                    <Media key={blogPost && blogPost._id} className="mt-0 p-3 border-bottom blogPost-title d-flex flex-column flex-lg-row">

                        <Media left href="#" className="m-auto d-flex justify-content-center align-items-center relatedLatestImage">
                            <img src={blogPost && blogPost.post_image || altImage} alt={blogPost && blogPost.brand} />
                        </Media>

                        <Media body className="w-100">
                            <Media heading className="p-2 py-lg-0 mb-0 h-100 d-flex flex-column justify-content-between">

                                <h6 className="text-left mt-3 mt-lg-0 mb-2 post-link">
                                    <a href={`/view-blog-post/${blogPost && blogPost.slug}`} className="font-weight-light">{blogPost && blogPost.title}</a>
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
                                        {new Date(blogPost && blogPost.createdAt).toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })}
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

export default connect(mapStateToProps, { getBlogPostsByCategory })(RelatedPosts)