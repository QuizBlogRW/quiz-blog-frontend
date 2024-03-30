import React, { useEffect, lazy, Suspense, useContext } from 'react'
import { Container, Col, Row, ListGroup, ListGroupItem } from 'reactstrap'

import { getBlogPosts } from '../../../redux/slices/blogPostsSlice'
import { useSelector, useDispatch } from "react-redux"
import ResponsiveAd from '../../adsenses/ResponsiveAd'
import SquareAd from '../../adsenses/SquareAd'
import QBLoadingSM from '../../rLoading/QBLoadingSM'
import './allBlogPosts.css'
import { Link, useLocation } from 'react-router-dom'
import { bPcatsContext } from '../../../appContexts'

const BlogPostItem = lazy(() => import('./BlogPostItem'))

const AllBlogPosts = () => {

  // Redux
  const dispatch = useDispatch()
  const bposts = useSelector(state => state.blogPosts)

  // context
  const bPcats = useContext(bPcatsContext)

  let location = useLocation()

  // Lifecycle methods
  useEffect(() => {
    dispatch(getBlogPosts({}))
  }, [dispatch])

  return (
    <Container className="posts main blog-posts mt-4">

      <Row className="mt-lg-5">
        <Col sm="1" className="mt-md-2">
        </Col>

        <Col sm="3" className="mt-md-2">

          {bPcats.isLoading ?
            <QBLoadingSM /> :
            <div className='sticky-categories'>

              <h5 className='fw-bolder text-uppercase text-center mb-5' style={{ color: '#157A6E' }}>
                Discover Knowledge
              </h5>

              <ListGroup className='cats-container'>
                <Link to='/blog' className='px-2'>
                  <ListGroupItem action active={location.pathname !== '/blog' ? false : true}>
                    {`All Categories`.toUpperCase()}
                  </ListGroupItem>
                </Link>

                {bPcats.allPostCategories && bPcats.allPostCategories.map(category => (
                  <Link to={`/blog/${category._id}`} key={category._id} className='px-2'>
                    <ListGroupItem action>
                      {category.title.toUpperCase()}
                    </ListGroupItem>
                  </Link>))}
              </ListGroup>

            </div>}

          <div className='w-100'>
            {process.env.NODE_ENV !== 'development' ? <ResponsiveAd /> : null}
          </div>
        </Col>

        <Col sm="6" className="mt-md-2">
          <Suspense fallback={<QBLoadingSM />}>
            {bposts.isLoading ?
              <QBLoadingSM /> :

              bposts && bposts.blogPosts.map(blogPost => (
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

export default AllBlogPosts