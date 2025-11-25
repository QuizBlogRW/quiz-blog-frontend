import { useEffect } from 'react';
import { Alert, Card, CardBody, Spinner } from 'reactstrap';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { getBlogPostsByCategory } from '@/redux/slices';
import altImage from '@/images/dashboard.svg';

const BlogPostItem = ({ blogPost }) => (
    <Card className="mb-3 shadow-sm border-0 rounded-3 hover-effect">
        <div className="d-flex flex-column flex-lg-row align-items-start gap-3 p-3">
            <img
                src={blogPost?.post_image || altImage}
                alt={blogPost?.title}
                className="rounded"
                style={{
                    width: '100%',
                    maxWidth: '120px',
                    height: '80px',
                    objectFit: 'cover',
                }}
            />
            <CardBody className="p-0 d-flex flex-column justify-content-between">
                <a
                    href={`/view-blog-post/${blogPost?.slug}`}
                    className="fw-bold text-dark mb-1"
                >
                    {blogPost?.title}
                </a>
                <div className="text-muted small mb-2 text-uppercase">
                    {blogPost?.postCategory?.title || 'Uncategorized'}
                </div>
                <div className="d-flex justify-content-between align-items-center text-muted small">
                    <span>{blogPost?.creator?.name || 'Unknown'}</span>
                    <span className="text-primary">
                        {moment(blogPost?.createdAt).format('YYYY-MM-DD')}
                    </span>
                </div>
            </CardBody>
        </div>
    </Card>
);

const RelatedPosts = ({ bPCatID }) => {
    const dispatch = useDispatch();
    const bposts = useSelector(state => state.blogPosts);

    useEffect(() => {
        if (bPCatID) dispatch(getBlogPostsByCategory(bPCatID));
    }, [dispatch, bPCatID]);

    if (bposts.isLoading) {
        return (
            <div className="d-flex justify-content-center py-5">
                <Spinner color="primary" />
            </div>
        );
    }

    return (
        <div className="mt-4 mt-lg-5">
            <Alert className="border border-warning text-uppercase mb-3 fw-bold text-center">
                Related Posts
            </Alert>
            {bposts?.blogPostsByCategory?.length > 0 ? (
                [...bposts.blogPostsByCategory]
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 7)
                    .map(blogPost => <BlogPostItem key={blogPost._id} blogPost={blogPost} />)
            ) : (
                <p className="text-muted text-center">No related posts found.</p>
            )}
        </div>
    );
};

export default RelatedPosts;
