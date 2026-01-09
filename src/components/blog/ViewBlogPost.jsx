import { useEffect, useRef, useMemo, useState, memo } from 'react';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';

import { getOneBlogPost } from '@/redux/slices';
import { createBlogPostView } from '@/redux/slices/blogPostsViewsSlice';
import RelatedPosts from './RelatedPosts';
import LatestPosts from './LatestPosts';
import altImage from '@/images/resourceImg.svg';
import BackLikeShare from './BackLikeShare';
import FollowUs from './FollowUs';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import ResponsiveAd from '../adsenses/ResponsiveAd';
import ImageWithFallback from '@/utils/ImageWithFallback';
import {
  sanitizeHTML,
  detectContentType,
  getDeviceType
} from './utils';
import { formatDateTime } from '@/utils/dateFormat';
import './viewPost.css';

// ============================================
// Constants
// ============================================
const AUTHOR_AVATAR_STYLE = {
  width: 70,
  height: 70,
  objectFit: 'cover',
  border: '3px solid var(--accent)',
  transition: 'transform 0.3s',
};

const POST_IMAGE_STYLE = {
  maxWidth: '100%',
  width: '100%',
  maxHeight: '400px',
  objectFit: 'cover',
  margin: '0 auto',
  padding: '1rem',
  borderRadius: '1rem',
  border: '1px solid rgba(5, 22, 12, 0.06)',
};

const INTERSECTION_OPTIONS = {
  threshold: 0.15,
  rootMargin: '50px',
};

// ============================================
// Memoized Child Components
// ============================================
const RelatedPostsMemo = memo(RelatedPosts);
const LatestPostsMemo = memo(LatestPosts);

// ============================================
// Custom Hooks
// ============================================

/**
 * Hook to track blog post view with analytics
 */
const useBlogPostView = (blogPostId, userId) => {
  const dispatch = useDispatch();
  const hasSentView = useRef(false);
  const [viewError, setViewError] = useState(null);

  useEffect(() => {
    if (!blogPostId || hasSentView.current) return;

    const trackView = async () => {
      try {
        // Use browser timezone instead of IP-based country for privacy
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const device = getDeviceType();

        await dispatch(
          createBlogPostView({
            blogPost: blogPostId,
            user: userId,
            device,
            timezone,
          })
        ).unwrap();

        hasSentView.current = true;
      } catch (error) {
        setViewError(error);
        console.error('Failed to track blog post view:', error);
      }
    };

    trackView();
  }, [blogPostId, userId, dispatch]);

  return { viewError };
};

/**
 * Hook for reveal animation on scroll
 */
const useRevealOnScroll = (elementRef, dependency) => {
  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('is-visible');
          observer.disconnect();
        }
      },
      INTERSECTION_OPTIONS
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [dependency]);
};

// ============================================
// Content Renderer Component
// ============================================
const ContentRenderer = memo(({ content, type }) => {
  if (type === 'empty') {
    return (
      <div className="text-muted text-center py-4" role="status">
        <p>No content available.</p>
      </div>
    );
  }

  if (type === 'html') {
    return (
      <div
        className="content-body"
        dangerouslySetInnerHTML={{ __html: content }}
        role="article"
      />
    );
  }

  return (
    <div className="content-body" role="article">
      <Markdown rehypePlugins={[rehypeHighlight]}>
        {content}
      </Markdown>
    </div>
  );
});

ContentRenderer.displayName = 'ContentRenderer';

// ============================================
// Author Info Component
// ============================================
const AuthorInfo = memo(({ creator, postCategory, authorRef }) => (
  <div
    className="d-flex flex-column align-items-center justify-content-around p-2"
    ref={authorRef}
  >
    <img
      src={creator?.avatar || altImage}
      alt={`${creator?.name || 'Author'} avatar`}
      className="rounded-circle"
      style={AUTHOR_AVATAR_STYLE}
      loading="lazy"
    />
    <div className="text-start d-block w-100">
      <small style={{ fontSize: '.7rem' }} aria-label="Author name">
        {creator?.name}
      </small>
      <div className="text-muted small" aria-label="Post category">
        {postCategory?.name}
      </div>
    </div>
  </div>
));

AuthorInfo.displayName = 'AuthorInfo';

// ============================================
// Main Component
// ============================================
const ViewBlogPost = () => {
  const dispatch = useDispatch();
  const { bPSlug } = useParams();

  const { oneBlogPost, isLoading, error } = useSelector((state) => state.blogPosts);
  const { user } = useSelector((state) => state.users);

  const authorRef = useRef(null);

  // Fetch blog post on mount or slug change
  useEffect(() => {
    if (bPSlug) {
      dispatch(getOneBlogPost(bPSlug));
    }
  }, [bPSlug, dispatch]);

  // Track blog post view
  const { viewError } = useBlogPostView(oneBlogPost?._id, user?._id);

  // Reveal animation for author section
  useRevealOnScroll(authorRef, oneBlogPost?._id);

  // Determine content type and prepare for rendering
  const contentData = useMemo(() => {
    if (!oneBlogPost?.markdown) {
      return { type: 'empty', content: null };
    }

    const contentType = detectContentType(oneBlogPost.markdown);

    if (contentType === 'html') {
      return {
        type: 'html',
        content: sanitizeHTML(oneBlogPost.markdown),
      };
    }

    return {
      type: 'markdown',
      content: oneBlogPost.markdown?.trim() || '',
    };
  }, [oneBlogPost?.markdown]);

  // Error state
  if (error) {
    return (
      <Container className="py-5 text-center">
        <Card className="shadow-sm border-0 rounded-3 p-5">
          <h2 className="text-danger mb-3">Error Loading Post</h2>
          <p className="text-muted">{error.message || 'Unable to load blog post'}</p>
        </Card>
      </Container>
    );
  }

  // Not found state
  if (!isLoading && !oneBlogPost) {
    return (
      <Container className="py-5 text-center">
        <Card className="shadow-sm border-0 rounded-3 p-5">
          <h2 className="mb-3">Post Not Found</h2>
          <p className="text-muted">The blog post you&apos;re looking for doesn&apos;t exist.</p>
        </Card>
      </Container>
    );
  }

  const { title, creator, createdAt, post_image, postCategory } = oneBlogPost || {};
  const formattedDate = createdAt ? formatDateTime(createdAt) : '';

  // ============================================
  // Render
  // ============================================
  return (
    <Container fluid className="py-4 px-2 px-lg-5 bg-light">
      <Row className="gy-4">
        {/* Main Article */}
        <Col lg="8">
          <Card className="shadow-sm border-0 rounded-3">
            {isLoading ? (
              <QBLoadingSM />
            ) : (
              <CardBody className="p-4">
                {/* Title + Meta */}
                <header className="text-center mb-4">
                  <h1 className="fw-bold text-dark text-uppercase mb-2">
                    {title}
                  </h1>
                  <div className="small text-muted" role="contentinfo">
                    <strong style={{ color: 'var(--brand)' }}>
                      {creator?.name}
                    </strong>
                    <span aria-hidden="true">&nbsp;•&nbsp;</span>
                    <time dateTime={createdAt}>{formattedDate}</time>
                  </div>
                </header>

                {/* Post Image */}
                {post_image && (
                  <figure className="text-center mb-4">
                    <ImageWithFallback
                      src={post_image}
                      fallbackSrc={altImage}
                      alt={title || 'Blog post image'}
                      style={POST_IMAGE_STYLE}
                      loading="eager"
                    />
                  </figure>
                )}

                {/* Content */}
                <section className="blog-content mb-4">
                  <ContentRenderer
                    content={contentData.content}
                    type={contentData.type}
                  />
                </section>

                {/* Author + Actions */}
                <footer
                  className="d-flex flex-column flex-md-row justify-content-between align-items-center bg-white rounded-4 shadow-sm border p-3"
                  role="contentinfo"
                >
                  <AuthorInfo
                    creator={creator}
                    postCategory={postCategory}
                    authorRef={authorRef}
                  />

                  <BackLikeShare
                    articleName={title}
                    articleCreator={creator?.name}
                  />
                </footer>

                <FollowUs />

                {/* View tracking error (optional debug info) */}
                {viewError && import.meta.env.MODE === 'development' && (
                  <div className="alert alert-warning mt-3" role="alert">
                    <small>View tracking failed: {viewError.message}</small>
                  </div>
                )}
              </CardBody>
            )}
          </Card>
        </Col>

        {/* Sidebar */}
        <Col lg="4">
          <aside>
            <Row className="gy-3">
              <Col xs="12">
                <RelatedPostsMemo bPCatID={postCategory?._id} />
              </Col>
              <Col xs="12">
                <LatestPostsMemo />
              </Col>
              <Col xs="12">
                <ResponsiveAd />
              </Col>
            </Row>
          </aside>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewBlogPost;