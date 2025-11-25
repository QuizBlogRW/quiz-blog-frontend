import { useState, useEffect, useRef } from 'react';
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
import './viewPost.css'

const fetchCountryData = async () => {
  try {
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    const geoResponse = await fetch(
      `https://get.geojs.io/v1/ip/geo/${ipData.ip}.json`
    );
    const geoData = await geoResponse.json();
    return geoData.country;
  } catch {
    return null;
  }
};

const ViewBlogPost = () => {
  const dispatch = useDispatch();
  const { bPSlug } = useParams();
  const { oneBlogPost, isLoading } = useSelector((state) => state.blogPosts);
  const { user } = useSelector((state) => state.auth);
  const [newBlogPostView, setNewBlogPostView] = useState();
  const authorRef = useRef();
  const isCreateCalled = useRef(false);

  useEffect(() => {
    dispatch(getOneBlogPost(bPSlug));
  }, [dispatch, bPSlug]);

  useEffect(() => {
    if (!oneBlogPost) return;
    const updateBlogPostView = async () => {
      const country = await fetchCountryData();
      setNewBlogPostView({
        blogPost: oneBlogPost._id,
        user: user?._id,
        device: /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent)
          ? 'mobile'
          : 'desktop',
        country,
      });
    };
    updateBlogPostView();
  }, [user, oneBlogPost]);

  useEffect(() => {
    if (newBlogPostView && !isCreateCalled.current) {
      dispatch(createBlogPostView(newBlogPostView));
      isCreateCalled.current = true;
    }
  }, [newBlogPostView, dispatch]);

  useEffect(() => {
    const node = authorRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) node.classList.add('is-visible');
        });
      },
      { threshold: 0.15 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [authorRef, oneBlogPost]);

  if (!oneBlogPost) return null;

  const { title, creator, createdAt, markdown, post_image, postCategory } = oneBlogPost;
  const formattedDate = moment(new Date(createdAt)).format('DD MMM YYYY, HH:mm');

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
                  <h1 className="fw-bold text-dark text-uppercase mb-2">{title}</h1>
                  <div className="small text-muted">
                    <strong style={{ color: 'var(--brand)' }}>{creator?.name}</strong>
                    &nbsp;•&nbsp;
                    {formattedDate}
                  </div>
                </header>

                {/* Post Image */}
                  <div className="text-center mb-4">
                    <img
                      src={post_image || altImage}
                      alt={title}
                      className="img-fluid rounded shadow-sm"
                      style={{
                        maxWidth: '100%',      // prevents stretching beyond container
                        width: '100%',         // responsive
                        maxHeight: '400px',    // limit tall images
                        objectFit: 'cover',    // crop if needed
                        margin: '0 auto',      // center horizontally
                      }}
                    />
                  </div>


                {/* Markdown Content */}
                <section className="markdown-body mb-4">
                  <Markdown rehypePlugins={[rehypeHighlight]}>{markdown}</Markdown>
                </section>

                  {/* Author + Actions */}
                  <footer className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-4 mt-5 p-3 p-md-4 bg-white rounded-4 shadow-sm border" style={{ borderColor: 'var(--accent)' }}>
                    {/* Author Info */}
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
                        <div className="text-muted small">{postCategory?.name}</div>
                      </div>
                    </div>

                    {/* Social Sharing */}
                    <div className="mt-3 mt-md-0">
                      <BackLikeShare articleName={title} articleCreator={creator?.name} />
                    </div>
                  </footer>

                  {/* Follow Section */}
                  <FollowUs className="mt-4" />

              </CardBody>
            )}
          </Card>
        </Col>

        {/* Sidebar */}
        <Col lg="4">
          <Row className="gy-3">
            <Col xs="12"><RelatedPosts bPCatID={postCategory?._id} /></Col>
            <Col xs="12"><LatestPosts /></Col>
            <Col xs="12"><ResponsiveAd /></Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewBlogPost;
