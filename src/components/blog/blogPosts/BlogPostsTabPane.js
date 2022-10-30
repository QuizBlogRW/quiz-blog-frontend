import React, { useEffect } from 'react'
import { Row, TabPane } from 'reactstrap'
import { connect } from 'react-redux'
import { getBlogPosts, deleteBlogPost } from '../../../redux/blog/blogPosts/blogPosts.actions'
import SpinningBubbles from '../../rLoading/SpinningBubbles'
import BPTable from './BPTable'

const BlogPostsTabPane = ({ auth, bposts, getBlogPosts, deleteBlogPost }) => {

    const bpostsToUse = bposts && bposts.allBlogPosts

    // Lifecycle methods
    useEffect(() => {
        getBlogPosts()
    }, [getBlogPosts])

    const currentUser = auth && auth.user

    return (
        <TabPane tabId="8" className='mx-4 my-5'>
            {bposts.isLoading ?
                <SpinningBubbles title='blog posts' /> :
                <Row>
                    <BPTable
                        bpostsToUse={bpostsToUse}
                        deleteBlogPost={deleteBlogPost}
                        currentUser={currentUser} />
                </Row>
            }
        </TabPane>
    )
}

const mapStateToProps = state => ({
    bposts: state.blogPostsReducer
})

export default connect(mapStateToProps, { getBlogPosts, deleteBlogPost })(BlogPostsTabPane)