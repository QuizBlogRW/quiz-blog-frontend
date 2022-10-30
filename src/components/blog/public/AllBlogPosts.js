import React, { useEffect, lazy, Suspense } from 'react'
import { Container, Col, Row, Spinner, ListGroup, ListGroupItem } from 'reactstrap'
import ReactLoading from "react-loading"
import { connect } from 'react-redux'
import { getBlogPosts } from '../../../redux/blog/blogPosts/blogPosts.actions'
import ResponsiveAd from '../../adsenses/ResponsiveAd'
import SquareAd from '../../adsenses/SquareAd'
import SpinningBubbles from '../../rLoading/SpinningBubbles'
import './allBlogPosts.css'
import { Link, useLocation } from 'react-router-dom'

const BlogPostItem = lazy(() => import('./BlogPostItem'))

const AllBlogPosts = ({ bPcats, bposts, getBlogPosts }) => {

  let location = useLocation()

  // Lifecycle methods
  useEffect(() => {
    getBlogPosts()
  }, [getBlogPosts])

  return (
    <Container className="posts main blog-posts mt-4">

      <Row className="mt-lg-5">
        <Col sm="1" className="mt-md-2">
        </Col>

        <Col sm="3" className="mt-md-2">

          {bPcats.isLoading ?
            <SpinningBubbles title='...' /> :
            <div className='sticky-categories'>
              <h5 className='font-weight-bold text-uppercase'>Explore</h5>

              <ListGroup className='cats-container'>
                <Link to='/blog' className='px-2'>
                  <ListGroupItem action active={location.pathname !== '/blog' ? false : true}>
                    All
                  </ListGroupItem>
                </Link>

                {bPcats.allPostCategories && bPcats.allPostCategories.map(category => (
                  <Link to={`/blog/${category._id}`} key={category._id} className='px-2'>
                    <ListGroupItem action>
                    {category.title}
                  </ListGroupItem>
                  </Link>))}
              </ListGroup>

            </div>}
            
          <ResponsiveAd />
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

              bposts && bposts.allBlogPosts.map(blogPost => (
                <BlogPostItem key={blogPost._id} blogPost={blogPost} />
              ))}

          </Suspense>
        </Col>

        <Col sm="2" className="mt-md-2">
          <SquareAd />
        </Col>
      </Row>
    </Container>
  )
}


const mapStateToProps = state => ({
  bposts: state.blogPostsReducer
  //   allBPNoLimit: state.blogPostsReducer.allBPNoLimit,
  //   allBPNoLimitLoading: state.blogPostsReducer.isBPNoLimitLoading,
})

export default connect(mapStateToProps, { getBlogPosts })(AllBlogPosts)

// export default connect(mapStateToProps, { subscribeToNewsLetter, getBlogPosts, setAllNoLimitBlogPosts })(AllBlogPosts)