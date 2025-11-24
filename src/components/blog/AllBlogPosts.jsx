import { useEffect, lazy, Suspense } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Col, Row, ListGroup, ListGroupItem } from 'reactstrap';
import { getBlogPosts, getPostCategories } from '@/redux/slices';
import ResponsiveAd from '@/components/adsenses/ResponsiveAd';
import SquareAd from '@/components/adsenses/SquareAd';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import './allBlogPosts.css';

const BlogPostItem = lazy(() => import('./BlogPostItem'));

const AllBlogPosts = () => {
  let location = useLocation();

  // Redux
  const dispatch = useDispatch();
  const bposts = useSelector((state) => state.blogPosts);
  const bPcats = useSelector((state) => state.postCategories);

  // Lifecycle methods
  useEffect(() => {
    dispatch(getPostCategories());
    dispatch(getBlogPosts({}));
  }, [dispatch]);

  return (
    <Container className="posts main blog-posts mt-4 py-lg-5">
      <Row>
        <Col xs="12" className="mb-3">
          <div className="blog-hero jbtron rounded p-3 text-center">
            <h1
              className="display-4 fw-bolder text-center my-4 mb-lg-4"
              style={{ color: 'var(--accent)' }}
            >
              Quiz-Blog Articles
            </h1>
            <p className="lead mb-1 mb-lg-4 text-white">
              Insights, guides and stories to help you learn and prepare.
            </p>
          </div>
        </Col>
      </Row>
      <Row className="mt-lg-5 d-flex justify-content-around">
        <Col md="3" className="mt-md-2 d-none d-md-block">
          {bPcats.isLoading ? (
            <QBLoadingSM />
          ) : bPcats.allPostCategories &&
            bPcats.allPostCategories.length > 0 ? (
            <div className="sticky-categories">
              <h5
                className="fw-bolder text-uppercase text-center mb-5"
                style={{ color: 'var(--brand)' }}
              >
                Discover Knowledge
              </h5>

              <ListGroup className="cats-container">
                <Link to="/blog" className="px-2">
                  <ListGroupItem
                    action
                    active={location.pathname !== '/blog' ? false : true}
                  >
                    {'All Categories'.toUpperCase()}
                  </ListGroupItem>
                </Link>

                {bPcats.allPostCategories &&
                  bPcats.allPostCategories.map((category) => (
                    <Link
                      to={`/blog/${category._id}`}
                      key={category._id}
                      className="px-2"
                    >
                      <ListGroupItem action>
                        {category.title.toUpperCase()}
                      </ListGroupItem>
                    </Link>
                  ))}
              </ListGroup>
              <Col md="3" className="mt-md-2 d-none d-md-block">
                <SquareAd />
              </Col>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted">
                No blog posts available at the moment.
              </p>
            </div>
          )}
          <div className="w-100">
            <ResponsiveAd />
          </div>
        </Col>

        <Col md="6" xs="12" className="mt-md-2">
          <Suspense fallback={<QBLoadingSM />}>
            {bposts.isLoading ? (
              <QBLoadingSM />
            ) : (
              bposts &&
              bposts.blogPosts.map((blogPost) => (
                <BlogPostItem key={blogPost._id} blogPost={blogPost} />
              ))
            )}
          </Suspense>
        </Col>
      </Row>
    </Container>
  );
};

export default AllBlogPosts;
