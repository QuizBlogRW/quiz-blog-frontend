import { useEffect, useRef, useMemo } from 'react';
import moment from 'moment';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import DOMPurify from 'dompurify';

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
import './viewPost.css';

// ----------------------------------------------
// Helpers
// ----------------------------------------------
const fetchCountryData = async () => {
  try {
    const ip = await fetch('https://api.ipify.org?format=json')
      .then((r) => r.json())
      .then((d) => d.ip);

    return fetch(`https://get.geojs.io/v1/ip/geo/${ip}.json`)
      .then((r) => r.json())
      .then((d) => d.country);
  } catch {
    return null;
  }
};

const deviceType = /Android|iPhone|iPad|iPod|Windows Phone/i.test(
  navigator.userAgent
)
  ? 'mobile'
  : 'desktop';

/**
 * Detects if content is HTML or Markdown
 * HTML from Lexical will have tags like <p>, <h1>, <strong>, etc.
 */
const isHTMLContent = (content) => {
  if (!content) return false;

  // Check for common HTML tags
  const htmlPattern = /<\/?([a-z][a-z0-9]*)\b[^>]*>/i;
  return htmlPattern.test(content);
};

/**
 * Sanitizes HTML to prevent XSS attacks
 */
const sanitizeHTML = (html) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'b', 'i',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'a', 'img',
      'blockquote', 'code', 'pre',
      'div', 'span'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'style',
      'width', 'height', 'target', 'rel'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
  });
};

// ----------------------------------------------
// Component
// ----------------------------------------------
const ViewBlogPost = () => {
  const dispatch = useDispatch();
  const { bPSlug } = useParams();

  const { oneBlogPost, isLoading } = useSelector((state) => state.blogPosts);
  const { user } = useSelector((state) => state.users);

  const authorRef = useRef(null);
  const hasSentView = useRef(false);

  // Fetch blog post
  useEffect(() => {
    if (bPSlug) dispatch(getOneBlogPost(bPSlug));
  }, [bPSlug, dispatch]);

  // Create view only once per load
  useEffect(() => {
    if (!oneBlogPost?._id || hasSentView.current) return;

    (async () => {
      const country = await fetchCountryData();
      dispatch(
        createBlogPostView({
          blogPost: oneBlogPost._id,
          user: user?._id,
          device: deviceType,
          country,
        })
      );
      hasSentView.current = true;
    })();
  }, [oneBlogPost?._id, user, dispatch]);

  // Reveal animation
  useEffect(() => {
    const node = authorRef.current;
    if (!node) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) node.classList.add('is-visible');
      },
      { threshold: 0.15 }
    );

    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  // Determine content type and prepare for rendering
  const contentData = useMemo(() => {
    if (!oneBlogPost?.markdown) {
      return { type: 'empty', content: null };
    }

    const isHTML = isHTMLContent(oneBlogPost.markdown);

    if (isHTML) {
      return {
        type: 'html',
        content: sanitizeHTML(oneBlogPost.markdown)
      };
    }

    return {
      type: 'markdown',
      content: oneBlogPost.markdown
    };
  }, [oneBlogPost?.markdown]);

  if (!oneBlogPost) return null;

  const { title, creator, createdAt, post_image, postCategory } = oneBlogPost;
  const formattedDate = moment(createdAt).format('DD MMM YYYY, HH:mm');

  // ----------------------------------------------
  // UI
  // ----------------------------------------------
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
                  <div className="small text-muted">
                    <strong style={{ color: 'var(--brand)' }}>
                      {creator?.name}
                    </strong>
                    &nbsp;•&nbsp;
                    {formattedDate}
                  </div>
                </header>

                {/* Post Image */}
                <div className="text-center mb-4">
                  <ImageWithFallback
                    src={post_image}
                    fallbackSrc={altImage}
                    alt={title}
                    style={{
                      maxWidth: '100%',
                      width: '100%',
                      maxHeight: '400px',
                      objectFit: 'cover',
                      margin: '0 auto',
                    }}
                  />
                </div>

                {/* Content - HTML or Markdown */}
                <section className="blog-content mb-4">
                  {contentData.type === 'html' ? (
                    // Render HTML content from Lexical
                    <div
                      className="content-body"
                      dangerouslySetInnerHTML={{ __html: contentData.content }}
                    />
                  ) : contentData.type === 'markdown' ? (
                    // Render Markdown content (legacy)
                    <div className="content-body">
                      <Markdown rehypePlugins={[rehypeHighlight]}>
                        {contentData.content}
                      </Markdown>
                    </div>
                  ) : (
                    // Empty state
                    <div className="text-muted text-center py-4">
                      <p>No content available.</p>
                    </div>
                  )}
                </section>

                {/* Author + Actions */}
                <footer className="d-flex flex-column flex-md-row justify-content-between align-items-center bg-white rounded-4 shadow-sm border p-3">
                  <div
                    className="d-flex flex-column align-items-center justify-content-around p-2"
                    ref={authorRef}
                  >
                    <img
                      src={creator?.avatar || altImage}
                      alt={creator?.name}
                      className="rounded-circle"
                      style={{
                        width: 70,
                        height: 70,
                        objectFit: 'cover',
                        border: '3px solid var(--accent)',
                        transition: 'transform 0.3s',
                      }}
                    />
                    <div className="text-start d-block w-100">
                      <small style={{ fontSize: '.7rem' }}>{creator?.name}</small>
                      <div className="text-muted small">{postCategory?.name}</div>
                    </div>
                  </div>

                  <BackLikeShare
                    articleName={title}
                    articleCreator={creator?.name}
                  />
                </footer>

                <FollowUs />
              </CardBody>
            )}
          </Card>
        </Col>

        {/* Sidebar */}
        <Col lg="4">
          <Row className="gy-3">
            <Col xs="12">
              <RelatedPosts bPCatID={postCategory?._id} />
            </Col>
            <Col xs="12">
              <LatestPosts />
            </Col>
            <Col xs="12">
              <ResponsiveAd />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewBlogPost;