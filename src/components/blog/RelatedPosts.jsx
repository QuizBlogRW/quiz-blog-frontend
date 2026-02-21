import { useEffect, useMemo, memo } from 'react';
import { Alert, Card, CardBody, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import { formatDate } from '@/utils/dateFormat';
import { useSelector, useDispatch } from 'react-redux';
import { getBlogPostsByCategory } from '@/redux/slices';
import ImageWithFallback from '@/utils/ImageWithFallback';
import './relatedLatest.css';

const BlogPostItem = memo(({ blogPost }) => {

    const {
        title = '',
        post_image = '',
        brand = '',
        slug = '',
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
                    src={post_image}
                    alt={brand || title}
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
                        <span>{creator?.name || 'Unknown'}</span>
                        <span className="text-primary">{formattedDate}</span>
                    </div>

                </CardBody>

            </div>
        </Card>
    );
});

BlogPostItem.displayName = 'BlogPostItem';

const RelatedPosts = ({ bPCatID }) => {

    const dispatch = useDispatch();

    const { blogPostsByCategory = [], isLoading } = useSelector(
        state => state.blogPosts
    );

    useEffect(() => {
        if (bPCatID && !blogPostsByCategory.length) {
            dispatch(getBlogPostsByCategory(bPCatID));
        }
    }, [dispatch, bPCatID, blogPostsByCategory.length]);

    const shuffledPosts = useMemo(() => {

        const copy = [...blogPostsByCategory];

        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }

        return copy.slice(0, 7);

    }, [blogPostsByCategory]);

    if (isLoading) {
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

            {shuffledPosts.length > 0 ? (
                shuffledPosts.map(post => (
                    <BlogPostItem key={post._id} blogPost={post} />
                ))
            ) : (
                <p className="text-muted text-center">
                    No related posts found.
                </p>
            )}

        </div>
    );
};

export default RelatedPosts;