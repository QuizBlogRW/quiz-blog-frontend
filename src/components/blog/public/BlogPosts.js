import React, { useEffect, useState, lazy, Suspense } from 'react'
import { Col, Row, Button, Spinner, ListGroup, ListGroupItem } from 'reactstrap'
import ReactLoading from "react-loading"
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import moment from 'moment'

import { getBlogPosts } from '../../../redux/blog/blogPosts/blogPosts.actions'
import './homePosts.css'


const ResponsiveAd = lazy(() => import('../../adsenses/ResponsiveAd'))
const SquareAd = lazy(() => import('../../adsenses/SquareAd'))

const BlogPosts = ({ getBlogPosts, blgPosts }) => {

    const [limit] = useState(10)
    const AllBPs = blgPosts && blgPosts.allBlogPosts

    // Lifecycle methods
    useEffect(() => {
        getBlogPosts(limit)
    }, [getBlogPosts, limit])

    return (
        <div className='blogPosts'>
            <Row sm="12" className="px-1 px-lg-4 my-1 w-100">
                {/* Google responsive 1 ad */}
                <div className='w-100'>
                    <ResponsiveAd />
                </div>
            </Row>

            <Row className="p-2 p-sm-3 px-sm-5">
                <Col sm="12" className="py-lg-3 px-0">
                    <h3 className="inversed-title mt-0 mt-lg-3 pt-4 py-lg-3 text-danger text-center font-weight-bold">
                        <span class="part1">BLOG</span>
                        <span class="part2">POSTS</span>
                    </h3>

                    {blgPosts.isLoading ?
                        <div className="p-5 m-5 d-flex justify-content-center align-items-center">
                            <ReactLoading type="spokes" color="#33FFFC" />
                        </div> :
                        <>
                            {AllBPs && AllBPs
                                .map(bp => {

                                    const { _id, slug, title, postCategory, creator, createdAt } = bp

                                    return (
                                        <Suspense key={_id} fallback={<div className="p-3 m-3 d-flex justify-content-center align-items-center">
                                            <Spinner style={{ width: '8rem', height: '8rem' }} />
                                        </div>}>

                                            <ListGroup flush color="warning" className="px-lg-3 my-1" style={{ background: "#e7e7e7"}}>
                                                <ListGroupItem href="#" tag="span" color="alert-link" className='d-flex flex-column flex-lg-row justify-content-between align-items-center' style={{ background: "#e7e7e7" }}>

                                                    <Link to={`/view-blog-post/${slug}`} className="w-100">
                                                        <b className='text-uppercase text-primary post-title'>{title}</b>
                                                    </Link>

                                                    <span className="w-100 text-dark view-blog-post">
                                                        <small className='px-1'>
                                                            {postCategory && postCategory.title}
                                                        </small>|
                                                        <small className='px-1'>
                                                            {creator && creator.name}
                                                        </small>|
                                                        <small className='px-1'>
                                                            {moment(new Date(createdAt)).format('DD MMM YYYY, HH:mm')}
                                                        </small>
                                                    </span>
                                                </ListGroupItem>
                                            </ListGroup>

                                            {/* ad when half the number of notes*/}
                                            {AllBPs.length > 2 && AllBPs.indexOf(bp) === Math.floor(AllBPs.length / 2) &&
                                                <div className='w-100'>
                                                    <SquareAd />
                                                </div>
                                            }

                                        </Suspense>)
                                }
                                )}

                            {/* All posts */}
                            <div className="my-2 mt-sm-5 mb-sm-4 d-flex justify-content-center">
                                <Link to="/blog">
                                    <Button outline color="warning" className='view-all-btn'>
                                        More articles here &nbsp;👉
                                    </Button>
                                </Link>
                            </div>
                        </>
                    }
                </Col>
            </Row>
        </div>
    )
}

const mapStateToProps = state => ({
    blgPosts: state.blogPostsReducer
})

export default connect(mapStateToProps, { getBlogPosts })(BlogPosts)