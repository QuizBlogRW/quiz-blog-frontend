import React, { useEffect } from 'react'
import { Media, Alert } from 'reactstrap'
import moment from 'moment'
import QBLoadingSM from '../../rLoading/QBLoadingSM'
import { getBlogPostsByCategory } from '../../../redux/slices/blogPostsSlice'
import { useSelector, useDispatch } from "react-redux"
import altImage from '../../../images/dashboard.svg'
import './relatedLatest.css'

const RelatedPosts = ({ bPCatID }) => {

    // Redux
    const dispatch = useDispatch()
    let bposts = useSelector(state => state.blogPosts)

    useEffect(() => {
        dispatch(getBlogPostsByCategory(bPCatID))
    }, [dispatch, bPCatID])

    return (

        bposts.isLoading ?
            <QBLoadingSM /> :

            <div className="similar-posts mt-4 mt-lg-2">
                <Alert className='border border-warning text-uppercase mb-0'>
                    Related Posts
                </Alert>

                {bposts && bposts.blogPostsByCategory && Array.from(bposts.blogPostsByCategory).sort(() => 0.5 - Math.random()).slice(0, 7).map(blogPost => (

                    <Media key={blogPost && blogPost._id} className="mt-0 p-3 border-bottom blogPost-title d-flex flex-column flex-lg-row">

                        <Media left href="#" className="m-auto d-flex justify-content-center align-items-center relatedLatestImage">
                            <img src={(blogPost && blogPost.post_image) || altImage} alt={blogPost && blogPost.brand} />
                        </Media>

                        <Media body className="w-100">
                            <Media heading className="p-2 py-lg-0 mb-0 h-100 d-flex flex-column justify-content-between">

                                <h6 className="text-start mt-3 mt-lg-0 mb-2 post-link">
                                    <a href={`/view-blog-post/${blogPost && blogPost.slug}`} className="fw-light">{blogPost && blogPost.title}</a>
                                </h6>

                                <div className="text-muted m-0">
                                    <p className="mb-1 ms-1">
                                        {blogPost.postCategory && blogPost.postCategory.title}
                                    </p>
                                </div>

                                <div className="d-flex ms-1 justify-content-between text-muted align-bottom">
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

export default RelatedPosts