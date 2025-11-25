import React, { useEffect, useState } from 'react';
import { Col, Row, Button, ListGroup, ListGroupItem } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import ResponsiveAd from '@/components/adsenses/ResponsiveAd';
import SquareAd from '@/components/adsenses/SquareAd';

import { getBlogPosts } from '@/redux/slices';
import './homePosts.css';
import QBLoading from '@/utils/rLoading/QBLoading';

const BlogPosts = () => {

  // Redux
  const dispatch = useDispatch();
  const { blogPosts: AllBPs, isLoading } = useSelector(
    (state) => state.blogPosts
  );

  const [limit] = useState(10);

  // Lifecycle methods
  useEffect(() => {
    dispatch(getBlogPosts({ limit }));
  }, [dispatch, limit]);

  return (
    <div className="blogPosts">
      <Row sm="12" className="px-1 px-lg-4 my-1">
        {/* Google responsive 1 ad */}
        <div className="w-100">
          <ResponsiveAd />
        </div>
      </Row>

      <Row className="p-2 p-sm-3 px-sm-5">
        <Col sm="12" className="py-lg-3 px-0">
          <h1 className="mt-0 my-lg-3 py-4 py-lg-3 text-center">
            Latest Blog Posts
          </h1>

          {isLoading ? (
            <>
              <QBLoading />
            </>
          ) : (
            <>
              <>
                {AllBPs && Array.isArray(AllBPs) && AllBPs.length > 0 ? (
                  AllBPs.map((bp) => {

                    const { _id, slug, title, postCategory, creator, createdAt } = bp;
                    const formattedDate = moment(new Date(createdAt)).format('DD MMM YYYY, HH:mm');

                    return (
                      <React.Fragment key={_id}>
                        <ListGroup flush className="px-lg-3 my-1 blogpost-list">
                          <ListGroupItem
                            key={_id}
                            tag="div"
                            className="d-flex flex-column flex-lg-row justify-content-between align-items-center blogpost-item"
                          >
                            <div className="w-100">
                              <Link to={`/view-blog-post/${slug}`} className="post-link">
                                <h4 className="post-title mb-0 text-uppercase">{title}</h4>
                              </Link>
                            </div>

                            <div className="w-100 text-dark post-meta text-end mt-2 mt-lg-0 text-uppercase">
                              <small className="px-1">{postCategory && postCategory.title} |</small>
                              {creator && creator.name && (
                                <small className="px-1">{creator.name} |</small>
                              )}
                              <small className="px-1">
                                {formattedDate === 'Invalid date' ? '' : formattedDate}
                              </small>
                            </div>
                          </ListGroupItem>
                        </ListGroup>

                        {/* Ad when half the number of notes*/}
                        {AllBPs.length > 2 && AllBPs.indexOf(bp) === Math.floor(AllBPs.length / 2) && (
                          <div className="w-100">
                            <SquareAd />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted">No blog posts available at the moment.</p>
                  </div>
                )}
              </>

              {/* All posts */}
              <div className="my-4 mt-sm-5 mb-sm-4 d-flex justify-content-center">
                <Link to="/blog">
                  <Button
                    outline
                    color="warning"
                    className="view-all-btn"
                  >
                    More articles here &nbsp;
                    <span role="img" aria-label="pointing">
                      👉
                    </span>
                  </Button>
                </Link>
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default BlogPosts;
