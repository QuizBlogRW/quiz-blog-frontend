import { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import { getOneBlogPost } from '@/redux/slices';
import { createBlogPostView } from '@/redux/slices/blogPostsViewsSlice';
import { useSelector, useDispatch } from 'react-redux';
import RelatedPosts from './RelatedPosts';
import LatestPosts from './LatestPosts';
import altImage from '@/images/dashboard.svg';
import BackLikeShare from './BackLikeShare';
import FollowUs from './FollowUs';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import './viewPost.css';
import ResponsiveAd from '../adsenses/ResponsiveAd';

// Function to fetch IP address and country
const fetchCountryData = async () => {
  try {
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    const ipAddress = ipData.ip;
    const geoResponse = await fetch(
      `https://get.geojs.io/v1/ip/geo/${ipAddress}.json`
    );
    const geoData = await geoResponse.json();
    return geoData.country;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const ViewBlogPost = () => {
  const dispatch = useDispatch();
  const { bPSlug } = useParams();
  const bposts = useSelector((state) => state.blogPosts);

  useEffect(() => {
    dispatch(getOneBlogPost(bPSlug));
  }, [dispatch, bPSlug]);

  const bpToUse = bposts && bposts.oneBlogPost;
  const bPCatID = bpToUse && bpToUse.postCategory && bpToUse.postCategory._id;
  const { user } = useSelector((state) => state.auth);
  const [newBlogPostView, setNewBlogPostView] = useState();
  const authorRef = useRef();

  useEffect(() => {
    const updateBlogPostView = async () => {
      const country = await fetchCountryData();
      setNewBlogPostView({
        blogPost: bpToUse && bpToUse._id,
        user: user && user._id,
        device: navigator.userAgent.match(
          /Android|iPhone|iPad|iPod|Windows Phone/i
        )
          ? 'mobile'
          : 'desktop',
        country,
      });
    };
    updateBlogPostView();
  }, [user, bpToUse]);

  const isCreateCalled = useRef(false);

  useEffect(() => {
    if (
      newBlogPostView &&
      newBlogPostView.blogPost &&
      !isCreateCalled.current
    ) {
      dispatch(createBlogPostView(newBlogPostView));
      isCreateCalled.current = true;
    }
  }, [newBlogPostView, dispatch]);

  // IntersectionObserver for reveal animation on author bio
  useEffect(() => {
    const node = authorRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            node.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.15 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [authorRef, bpToUse]);

  return (
    <Container
      className="blog-post-view p-0 p-lg-5 mw-100"
      style={{ backgroundColor: 'var(--bg, #f3f3f2)' }}
    >
      <Row className="viewed-details pb-lg-2">
        <Col
          lg="8"
          md="12"
          className="mx-0 py-2 px-0 pl-lg-2 ps-lg-4 choosen-blogPost my-lg-3"
        >
          {bposts.isLoading ? (
            <QBLoadingSM />
          ) : (
            <article className="post-article px-2 px-lg-3 py-lg-4 bg-white rounded-2 shadow-sm my-lg-3">
              <BackLikeShare
                articleName={bpToUse && bpToUse.title}
                articleCreator={
                  bpToUse && bpToUse.creator && bpToUse.creator.name
                }
              />
              <header className="mb-3 text-center my-lg-5">
                <h1 className="blogPost-title fw-bold text-uppercase mb-1">
                  {bpToUse && bpToUse.title}
                </h1>
                <div className="meta text-muted small">
                  <strong style={{ color: 'var(--brand)' }}>
                    {bpToUse && bpToUse.creator && bpToUse.creator.name}
                  </strong>
                  &nbsp;•&nbsp;
                  {moment(new Date(bpToUse && bpToUse.createdAt)).format(
                    'DD MMM YYYY, HH:mm'
                  )}
                </div>
              </header>

              <figure className="post-photo mb-4 text-center">
                <img
                  src={
                    bpToUse && bpToUse.post_image
                      ? bpToUse.post_image
                      : altImage
                  }
                  alt={bpToUse && bpToUse.title}
                />
              </figure>

              <section
                className="post-content mb-4"
                aria-label="Article content"
              >
                <div className="markdown-body">
                  <Markdown rehypePlugins={[rehypeHighlight]}>
                    {bpToUse && bpToUse.markdown}
                  </Markdown>
                </div>
              </section>

              <footer className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 mt-4">
                <div
                  className="d-flex align-items-center author-bio"
                  ref={authorRef}
                >
                  <div className="author-photo me-3">
                    <img
                      src={
                        (bpToUse &&
                          bpToUse.creator &&
                          bpToUse.creator.avatar) ||
                        altImage
                      }
                      alt={bpToUse && bpToUse.creator && bpToUse.creator.name}
                    />
                  </div>
                </div>

                <div className="d-flex align-items-center my-lg-3">
                  <BackLikeShare
                    articleName={bpToUse && bpToUse.title}
                    articleCreator={
                      bpToUse && bpToUse.creator && bpToUse.creator.name
                    }
                  />
                </div>
              </footer>

              <FollowUs />
            </article>
          )}
        </Col>

        <Col lg="4" md="12" className="sidebar-content mt-3 mt-lg-0">
          <RelatedPosts bPCatID={bPCatID} />
          <LatestPosts />
          <ResponsiveAd />
        </Col>
      </Row>
    </Container>
  );
};

export default ViewBlogPost;
