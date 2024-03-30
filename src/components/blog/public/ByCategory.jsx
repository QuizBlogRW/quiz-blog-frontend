import React, { useEffect, lazy, Suspense, useContext } from 'react'
import { Container, Col, Row, ListGroup, ListGroupItem } from 'reactstrap'

import { getBlogPostsByCategory } from '../../../redux/slices/blogPostsSlice'
import { useSelector, useDispatch } from "react-redux"

import ResponsiveAd from '../../adsenses/ResponsiveAd'
import SquareAd from '../../adsenses/SquareAd'
import QBLoadingSM from '../../rLoading/QBLoadingSM'
import { Link, useLocation, useParams } from 'react-router-dom'
import { bPcatsContext } from '../../../appContexts'
import './allBlogPosts.css'

const BlogPostItem = lazy(() => import('./BlogPostItem'))

const ByCategory = () => {

    // Redux
    const dispatch = useDispatch()
    const bposts = useSelector(state => state.blogPosts)

    // context
    const bPcats = useContext(bPcatsContext)

    let location = useLocation()
    const { bPCatID } = useParams()

    useEffect(() => {
        dispatch(getBlogPostsByCategory(bPCatID))
    }, [dispatch, bPCatID])

    return (
        <Container className="posts main blog-posts mt-4">

            <Row className="mt-lg-5">
                <Col sm="1" className="mt-md-2">
                </Col>

                <Col sm="3" className="mt-md-2">

                    {bPcats.isLoading ?
                        <QBLoadingSM /> :
                        <div className='sticky-top sticky-categories'>
                            <h5 className='fw-bolder text-uppercase text-center mb-5' style={{ color: '#157A6E' }}>
                                Discover Knowledge
                            </h5>

                            <ListGroup className='cats-container'>
                                <Link to='/blog' className='px-2'>
                                    <ListGroupItem action>
                                        {`All Categories`.toUpperCase()}
                                    </ListGroupItem>
                                </Link>

                                {bPcats.allPostCategories && bPcats.allPostCategories.map(category => (
                                    <Link to={`/blog/${category._id}`} key={category._id} className='px-2'>
                                        <ListGroupItem action active={location.pathname === `/blog/${category._id}` ? true : false}>
                                            {category.title.toUpperCase()}
                                        </ListGroupItem>
                                    </Link>))}
                            </ListGroup>

                        </div>}
                    <Row>
                        <div className='w-100'>
                            {process.env.NODE_ENV !== 'development' ? <ResponsiveAd /> : null}
                        </div>
                    </Row>
                </Col>

                <Col sm="6" className="mt-md-2">
                    <Suspense fallback={<QBLoadingSM />}>
                        {bposts.isLoading ?
                            <QBLoadingSM /> :

                            bposts && bposts.blogPostsByCategory && bposts.blogPostsByCategory.length === 0 ?
                                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh', color: 'rgb(176, 0, 0)' }}>
                                    <p className="text-center fw-bolder">
                                        This category has no posts yet. Please check back later.
                                    </p>
                                </div> :

                                bposts && bposts.blogPostsByCategory.map(blogPost => (
                                    <BlogPostItem key={blogPost._id} blogPost={blogPost} />
                                ))}

                    </Suspense>
                </Col>

                <Col sm="2" className="mt-md-2">
                    {process.env.NODE_ENV !== 'development' ? <SquareAd /> : null}
                </Col>
            </Row>
        </Container>
    )
}

export default ByCategory