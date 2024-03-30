import React, { useEffect } from 'react'
import { Row, TabPane } from 'reactstrap'

import { getBlogPosts } from '../../../redux/slices/blogPostsSlice'
import { useSelector, useDispatch } from "react-redux"
import QBLoadingSM from '../../rLoading/QBLoadingSM'
import BPTable from './BPTable'

const BlogPostsTabPane = () => {

    // Redux
    const dispatch = useDispatch()
    const bposts = useSelector(state => state.blogPosts)

    const bpostsToUse = bposts && bposts.blogPosts

    // Lifecycle methods
    useEffect(() => {
        dispatch(getBlogPosts({}))
    }, [dispatch])

    return (
        <TabPane tabId="8" className='mx-4 my-5'>
            {bposts.isLoading ?
                <QBLoadingSM /> :
                <Row>
                    <BPTable
                        bpostsToUse={bpostsToUse} />
                </Row>
            }
        </TabPane>
    )
}

export default BlogPostsTabPane