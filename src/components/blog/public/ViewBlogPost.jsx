import React, { useState, useEffect, useContext, useRef } from 'react'
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import { useParams } from 'react-router-dom'
import { Container, Row, Col } from 'reactstrap'
import moment from 'moment'
import { getOneBlogPost } from '../../../redux/slices/blogPostsSlice'
import { createBlogPostView } from '../../../redux/slices/blogPostsViewsSlice'
import { useSelector, useDispatch } from "react-redux"
import { currentUserContext } from '../../../appContexts'
import RelatedPosts from './RelatedPosts'
import LatestPosts from './LatestPosts'
import altImage from '../../../images/dashboard.svg'
import BackLikeShare from './BackLikeShare'
import FollowUs from './FollowUs'
import QBLoadingSM from '../../rLoading/QBLoadingSM'
import './viewPost.css'

const ViewBlogPost = () => {

    const dispatch = useDispatch()
    const bposts = useSelector(state => state.blogPosts)

    const { bPSlug } = useParams()

    useEffect(() => {
        dispatch(getOneBlogPost(bPSlug))
    }, [dispatch, bPSlug])

    const bpToUse = bposts && bposts.oneBlogPost
    const bPCatID = bpToUse && bpToUse.postCategory && bpToUse.postCategory._id

    // blogPost, viewer, device, country
    const viewer = useContext(currentUserContext)
    const [newBlogPostView, setNewBlogPostView] = useState()

    // to get country
    useEffect(() => {
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                const ipAddress = data.ip;
                console.log(`IP address: ${ipAddress}`);
                // Now we can use the GeoJS API to get the location data.
                return fetch(`https://get.geojs.io/v1/ip/geo/${ipAddress}.json`);
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);

                setNewBlogPostView(prevView => {
                    return {
                        ...prevView,
                        blogPost: bpToUse && bpToUse._id,
                        viewer: viewer && viewer._id,
                        device: navigator.userAgent.match(/Android|iPhone|iPad|iPod|Windows Phone/i) ? 'mobile' : 'desktop',
                        country: data.country
                    }
                });
            })
            .catch(error => console.error(error));
    }, [viewer, bpToUse])

    // USE REF TO CHECK IF createBlogPostView WAS CALLED BEFORE
    const isCreateCalled = useRef(false)

    // CALL createBlogPostView IF IT WAS NOT CALLED BEFORE
    useEffect(() => {
        if (newBlogPostView && newBlogPostView.blogPost && !isCreateCalled.current) {
            dispatch(createBlogPostView(newBlogPostView))
            isCreateCalled.current = true
        }
    }, [newBlogPostView, dispatch])

    return (
        <Container className="blog-post-view p-0 p-lg-5 mw-100" style={{ backgroundColor: (bpToUse && bpToUse.bgColor) || '#f3f3f2' }}>
            <Row className="viewed-details pb-lg-2">

                <Col sm="8" className="mx-0 py-2 px-0 pl-lg-2 ps-lg-4 choosen-blogPost">

                    {bposts.isLoading ?
                        <QBLoadingSM /> :

                        <>
                            <BackLikeShare articleName={bpToUse.title} articleCreator={bpToUse.creator && bpToUse.creator.name} />

                            <div className="post-details px-2 px-lg-3 py-lg-4">
                                <h2 className="blogPost-title fw-bolder my-3 text-uppercase text-center">
                                    <p className='text-center'>{bpToUse.title}</p>
                                    <small>
                                        <b>
                                            Posted by {bpToUse.creator && bpToUse.creator.name} on {moment(new Date(bpToUse && bpToUse.createdAt)).format('DD MMM YYYY, HH:mm')}
                                        </b>
                                    </small>
                                </h2>

                                <div className="post-photo">
                                    <img src={bpToUse.post_image || altImage} alt="" />
                                </div>

                                <Markdown rehypePlugins={[rehypeHighlight]}>{bpToUse.markdown}
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

export default ViewBlogPost