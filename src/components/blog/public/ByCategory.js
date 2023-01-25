import React, { useEffect, lazy, Suspense, useContext } from 'react'
import { Container, Col, Row, Spinner, ListGroup, ListGroupItem } from 'reactstrap'
import ReactLoading from "react-loading"
import { connect } from 'react-redux'
import { getBlogPostsByCategory } from '../../../redux/blog/blogPosts/blogPosts.actions'

import ResponsiveAd from '../../adsenses/ResponsiveAd'
import SquareAd from '../../adsenses/SquareAd'
import SpinningBubbles from '../../rLoading/SpinningBubbles'
import './allBlogPosts.css'
import { Link, useLocation, useParams } from 'react-router-dom'
import { bPcatsContext } from '../../../appContexts'

const BlogPostItem = lazy(() => import('./BlogPostItem'))

const ByCategory = ({ bposts, getBlogPostsByCategory }) => {

    // context
    const bPcats = useContext(bPcatsContext)

    let location = useLocation()
    const { bPCatID } = useParams()

    useEffect(() => {
        getBlogPostsByCategory(bPCatID)
    }, [getBlogPostsByCategory, bPCatID])

    return (
        <Container className="posts main blog-posts mt-4">

            <Row className="mt-lg-5">
                <Col sm="1" className="mt-md-2">
                </Col>

                <Col sm="3" className="mt-md-2">

                    {bPcats.isLoading ?
                        <SpinningBubbles title='...' /> :
                        <div className='sticky-top sticky-categories'>
                            <h5 className='font-weight-bold text-uppercase'>Explore</h5>

                            <ListGroup className='cats-container'>
                                <Link to='/blog' className='px-2'>
                                    <ListGroupItem action>
                                        All
                                    </ListGroupItem>
                                </Link>

                                {bPcats.allPostCategories && bPcats.allPostCategories.map(category => (
                                    <Link to={`/blog/${category._id}`} key={category._id} className='px-2'>
                                        <ListGroupItem action active={location.pathname === `/blog/${category._id}` ? true : false}>
                                            {category.title}
                                        </ListGroupItem>
                                    </Link>))}
                            </ListGroup>

                        </div>}
                    <Row>
                        <div className='w-100'>
                            <ResponsiveAd />
                        </div>
                    </Row>
                </Col>

                <Col sm="6" className="mt-md-2">
                    <Suspense
                        fallback={
                            <div className="p-1 m-1 d-flex justify-content-center align-items-center">
                                <Spinner style={{ width: '5rem', height: '5rem' }} />
                            </div>
                        }>

                        {bposts.isLoading ?
                            <div className="p-5 m-5 d-flex justify-content-center align-items-center">
                                <ReactLoading type="spokes" color="#33FFFC" />
                            </div> :

                            bposts && bposts.blogPostsByCategory.map(blogPost => (
                                <BlogPostItem key={blogPost._id} blogPost={blogPost} />
                            ))}

                    </Suspense>
                </Col>

                <Col sm="2" className="mt-md-2 w-100">
                    <SquareAd />
                </Col>
            </Row>
        </Container>
    )
}


const mapStateToProps = state => ({
    bposts: state.blogPostsReducer
})

export default connect(mapStateToProps, { getBlogPostsByCategory })(ByCategory)