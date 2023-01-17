import React, { useEffect } from 'react'
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import { connect } from 'react-redux'
import ReactLoading from "react-loading"
import { useParams } from 'react-router-dom'
import { Container, Row, Col } from 'reactstrap'
import './viewPost.css'
import { getOneBlogPost } from '../../../redux/blog/blogPosts/blogPosts.actions'
import RelatedPosts from './RelatedPosts'
import LatestPosts from './LatestPosts'
import altImage from '../../../images/dashboard.svg'
import BackLikeShare from './BackLikeShare'
import FollowUs from './FollowUs'

const ViewBlogPost = ({ bposts, getOneBlogPost }) => {

    const { bPSlug } = useParams()
    // Lifecycle methods

    useEffect(() => {
        getOneBlogPost(bPSlug)
    }, [getOneBlogPost, bPSlug])

    const bpToUse = bposts && bposts.oneBlogPost
    const bPCatID = bpToUse && bpToUse.postCategory && bpToUse.postCategory._id

    return (
        <Container className="blog-post-view p-0 p-lg-5 mw-100" style={{ backgroundColor: (bpToUse && bpToUse.bgColor) || '#f3f3f2' }}>
            <Row className="viewed-details pb-lg-2">

                <Col sm="8" className="mx-0 py-2 px-0 pl-lg-2 pr-lg-4 choosen-blogPost">

                    {bposts.isLoading ?
                        <div className="mt-5 pt-5 d-flex justify-content-center align-items-center">
                            <ReactLoading type="spokes" color="#33FFFC" />
                        </div> :

                        <>
                            <BackLikeShare articleName={bpToUse.title} articleCreator={bpToUse.creator && bpToUse.creator.name} />

                            <div className="post-details px-2 px-lg-3 py-lg-4">
                                <h2 className="blogPost-title font-weight-bolder my-3 text-uppercase text-center">
                                    <p className='text-center'>{bpToUse.title}</p>
                                    <small>
                                        <b>
                                            Posted by {bpToUse.creator && bpToUse.creator.name} on {new Date(bpToUse.createdAt).toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                                        </b>
                                    </small>
                                </h2>

                                <div className="post-photo">
                                    <img src={bpToUse.post_image || altImage} alt="" />
                                </div>

                                <Markdown rehypePlugins={[rehypeHighlight]} escapeHtml={false}>{bpToUse.markdown}
                                </Markdown>
                            </div>
                            <BackLikeShare articleName={bpToUse.title} articleCreator={bpToUse.creator && bpToUse.creator.name} />

                            <FollowUs />
                        </>}
                </Col>

                <Col sm="4" className="sidebar-content">
                    <RelatedPosts bPCatID={bPCatID} />
                    <LatestPosts />
                </Col>
            </Row>

        </Container>
    )
}
// Map  state props
const mapStateToProps = state => ({
    bposts: state.blogPostsReducer
})

export default connect(mapStateToProps, { getOneBlogPost })(ViewBlogPost)