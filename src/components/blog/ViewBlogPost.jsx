import { useEffect, useRef } from 'react';
import moment from 'moment';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';

import { getOneBlogPost } from '@/redux/slices';
import { createBlogPostView } from '@/redux/slices/blogPostsViewsSlice';
import RelatedPosts from './RelatedPosts';
import LatestPosts from './LatestPosts';
import altImage from '@/images/dashboard.svg';
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

  if (!oneBlogPost) return null;

  const { title, creator, createdAt, markdown, post_image, postCategory } =
    oneBlogPost;

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
              <CardBody className="p-4 p-lg-5">
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

                {/* Markdown Content */}
                <section className="markdown-body mb-4">
                  <Markdown rehypePlugins={[rehypeHighlight]}>
                    {markdown}
                  </Markdown>
                </section>

                {/* Author + Actions */}
                <footer className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-4 mt-5 p-3 p-md-4 bg-white rounded-4 shadow-sm border">
                  <div className="d-flex align-items-center gap-3" ref={authorRef}>
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
                    <div className="text-start">
                      <div className="fw-bold text-dark">{creator?.name}</div>
                      <div className="text-muted small">
                        {postCategory?.name}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 mt-md-0">
                    <BackLikeShare
                      articleName={title}
                      articleCreator={creator?.name}
                    />
                  </div>
                </footer>

                <FollowUs className="mt-4" />
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
