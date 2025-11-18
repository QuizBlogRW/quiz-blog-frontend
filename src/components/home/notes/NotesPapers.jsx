import { useEffect, useState, lazy, Suspense } from 'react';
import { Col, Row, Button } from 'reactstrap';

import { Link } from 'react-router-dom';
import { getLandingDisplayNotes } from '@/redux/slices/notesSlice';
import { useSelector, useDispatch } from 'react-redux';
import ItemPlaceholder from '@/utils/rLoading/ItemPlaceholder';
import ResponsiveAd from '@/components/adsenses/ResponsiveAd';

const SquareAd = lazy(() => import('@/components/adsenses/SquareAd'));
const SideResizable = lazy(() => import('@/components/adsenses/SideResizable'));
const ResponsiveHorizontal = lazy(() =>
  import('@/components/adsenses/ResponsiveHorizontal')
);
const GridMultiplex = lazy(() => import('@/components/adsenses/GridMultiplex'));
const NotesPapersItem = lazy(() => import('./NotesPapersItem'));

const NotesPapers = () => {
  // Redux
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.notes);
  const limitedLandingDisplayNotes = notes && notes.limitedLandingDisplayNotes;

  const [limit] = useState(10);

  // Lifecycle methods
  useEffect(() => {
    dispatch(getLandingDisplayNotes(limit));
  }, [dispatch, limit]);

  return (
    <div style={{ background: '#eeeded' }}>
      <Row className="px-1 px-lg-4 my-1 w-100">
        {/* Google responsive 1 ad */}
        <Col sm="12">
          <div className="w-100">
            {process.env.NODE_ENV !== 'development' ? <ResponsiveAd /> : null}
          </div>
        </Col>
      </Row>

      <Row className="px-1 px-lg-4 my-1 w-100">
        <Col
          sm="6"
          className="p-1 p-lg-2 d-flex flex-column justify-content-around w-100"
        >
          <Suspense fallback={<ItemPlaceholder />}>
            <div className="w-100">
              {process.env.NODE_ENV !== 'development' ? (
                <SideResizable />
              ) : null}
            </div>
          </Suspense>
        </Col>
        <Col sm="6" className="w-100">
          <div className="w-100">
            {process.env.NODE_ENV !== 'development' ? <SquareAd /> : null}
          </div>
        </Col>
      </Row>

      <Row className="m-1 p-1 px-sm-5 notes-paper">
        <Col sm="12" className="px-1 y-1 w-100">
          <h3 className="inversed-title mt-0 my-lg-3 py-4 py-lg-3 text-center fw-bolder">
            <span className="part1">Your Resource:</span>
            <span className="part2">Notes & Past Papers</span>
          </h3>
        </Col>

        <Col sm="12" className="px-0 px-sm-5 w-100">
          {notes.isLoading ? (
            <>
              <ItemPlaceholder />
              <ItemPlaceholder />
              <ItemPlaceholder />
            </>
          ) : (
            <>
              {limitedLandingDisplayNotes && limitedLandingDisplayNotes.length > 0 ? (
                <section className="notes-grid" aria-live="polite">
                  {limitedLandingDisplayNotes.map((note) => (
                    <Suspense key={note._id} fallback={<ItemPlaceholder />}>
                      <NotesPapersItem note={note} />
                    </Suspense>
                  ))}
                </section>
              ) : (
                <div className="p-1 m-1 d-flex justify-content-center align-items-center">
                  No notes to display
                </div>
              )}

              {/* Newest 10 notes */}
              {limitedLandingDisplayNotes && limitedLandingDisplayNotes.length > 0 ? (
                <div className="mt-4 mt-sm-5 mb-sm-4 d-flex justify-content-center">
                  <Link to="/course-notes">
                    <Button outline color="success" className="view-all-btn">
                      More Notes & Past Papers &nbsp;{' '}
                      <i className="fa fa-arrow-right"></i>
                    </Button>
                  </Link>
                </div>
              ) : null}

              <Suspense fallback={<ItemPlaceholder />}>
                {process.env.NODE_ENV !== 'development' ? (
                  <GridMultiplex />
                ) : null}
              </Suspense>
            </>
          )}
        </Col>
      </Row>

      <Row className="my-1 w-100">
        <Col sm="12" className="px-1 y-1 w-100">
          <Suspense fallback={<ItemPlaceholder />}>
            <div className="w-100">
              {process.env.NODE_ENV !== 'development' ? (
                <ResponsiveHorizontal />
              ) : null}
            </div>
          </Suspense>
        </Col>
      </Row>
    </div>
  );
};

export default NotesPapers;
