import { useEffect, useMemo, memo } from 'react';
import { formatDate } from '@/utils/dateFormat';
import { Alert, Card, CardBody, Spinner } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getBlogPosts } from '@/redux/slices';
import altImage from '@/images/dashboard.svg';
import ImageWithFallback from '@/utils/ImageWithFallback';
import './relatedLatest.css';

/**
 * Memoized BlogPostItem prevents unnecessary re-renders
 */
const BlogPostItem = memo(({ blogPost }) => {

    const {
        title = '',
        slug = '',
        post_image = '',
        brand = '',
        postCategory,
        creator,
        createdAt
    } = blogPost || {};

    const formattedDate = useMemo(
        () => createdAt ? formatDate(createdAt) : '',
        [createdAt]
    );

    return (
        <Card className="mb-3 shadow-sm border-0 rounded-3 hover-effect">

            <div className="d-flex flex-column flex-lg-row align-items-center gap-3 p-3">

                <ImageWithFallback
                    src={post_image || altImage}
                    alt={brand || title || 'Blog Image'}
                    className="rounded"
                    style={{
                        width: '100%',
                        maxWidth: '140px',
                        height: '100px',
                        objectFit: 'cover',
                    }}
                />

                <CardBody className="p-0 d-flex flex-column justify-content-between">

                    <Link
                        to={`/view-blog-post/${slug}`}
                        className="mt-2 fw-bold text-dark mb-1 text-decoration-none"
                    >
                        {title}
                    </Link>

                    <div className="text-muted small mb-2 text-uppercase">
                        {postCategory?.title || 'Uncategorized'}
                    </div>

                    <div className="mt-2 d-flex justify-content-between text-muted small">

                        <span>
                            {creator?.name || 'Unknown'}
                        </span>

                        <span className="text-primary">
                            {formattedDate}
                        </span>

                    </div>

                </CardBody>

            </div>

        </Card>
    );
});

BlogPostItem.displayName = 'BlogPostItem';


/**
 * LatestPosts component optimized
 */
const LatestPosts = () => {

    const dispatch = useDispatch();

    /**
     * Select only required state fields
     */
    const {
        blogPosts = [],
        isLoading
    } = useSelector(state => state.blogPosts);


    /**
     * Fetch only if data not already present
     */
    useEffect(() => {

        if (!blogPosts.length) {
            dispatch(getBlogPosts({}));
        }

    }, [dispatch, blogPosts.length]);


    /**
     * Memoize latest posts slice
     */
    const latestPosts = useMemo(() => {
        return blogPosts.slice(0, 5);
    }, [blogPosts]);


    /**
     * Loading state
     */
    if (isLoading) {

        return (
            <div className="d-flex justify-content-center py-5">
                <Spinner color="primary" />
            </div>
        );

    }


    /**
     * Render
     */
    return (

        <div className="mt-4 mt-lg-2">

            <Alert className="border border-warning text-uppercase mb-3 fw-bold text-center">
                Latest Posts
            </Alert>

            {latestPosts.length > 0 ? (

                latestPosts.map(post => (
                    <BlogPostItem
                        key={post._id}
                        blogPost={post}
                    />
                ))

            ) : (

                <p className="text-muted text-center">
                    No posts found.
                </p>

            )}

        </div>

    );

};

export default LatestPosts;