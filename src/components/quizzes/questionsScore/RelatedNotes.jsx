import { useEffect, useMemo } from 'react';
import { Card, CardBody, Button, Row, Col, Badge } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getNotesByCCatg } from '@/redux/slices/notesSlice';
import Unavailable from './Unavailable';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';

const RelatedNotes = ({ ccatgID }) => {
  const dispatch = useDispatch();
  const { notesByCCatg, isByCCatgLoading } = useSelector((state) => state.notes);

  // Fetch notes by course category
  useEffect(() => {
    if (ccatgID) {
      dispatch(getNotesByCCatg(ccatgID));
    }
  }, [dispatch, ccatgID]);

  // Randomize and limit notes
  const displayedNotes = useMemo(() => {
    if (!notesByCCatg || !notesByCCatg.length) return [];

    return [...notesByCCatg]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  }, [notesByCCatg]);

  // Get file type from note (if available)
  const getFileType = (note) => {
    // Assuming notes might have a fileType or we can infer from filename
    return note.fileType || 'PDF';
  };

  // Get file size (if available)
  const getFileSize = (note) => {
    if (note.fileSize) {
      const sizeInMB = (note.fileSize / (1024 * 1024)).toFixed(1);
      return `${sizeInMB} MB`;
    }
    return null;
  };

  // Loading state
  if (isByCCatgLoading) {
    return (
      <div className="text-center py-5">
        <QBLoadingSM />
        <p className="text-muted mt-3">Loading related notes...</p>
      </div>
    );
  }

  // No notes available
  if (!displayedNotes.length) {
    return (
      <div className="my-5">
        <Unavailable
          title="No Related Notes Available Yet"
          link="/course-notes"
          more="notes"
        />
      </div>
    );
  }

  // Main render
  return (
    <div className="related-notes my-5 px-2 px-md-3">
      {/* Section Header */}
      <div className="text-center mb-4">
        <h4 className="fw-bold mb-2" style={{ color: '#157a6e' }}>
          <i className="fa fa-book-open me-2"></i>
          Helpful Study Resources
        </h4>
        <p className="text-muted mb-0">
          Notes and materials to help you learn better
        </p>
        <hr className="my-4 mx-auto" style={{ maxWidth: '200px', opacity: '0.3' }} />
      </div>

      {/* Notes Cards */}
      <Row className="g-3 g-md-4">
        {displayedNotes.map((note, index) => {
          const fileType = getFileType(note);
          const fileSize = getFileSize(note);

          return (
            <Col xs="12" md="6" lg="4" key={note._id || index}>
              <Card
                className="h-100 border-0 shadow-sm"
                style={{
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                }}
              >
                <CardBody className="d-flex flex-column p-4">
                  {/* File Type Badge */}
                  <div className="mb-2">
                    <Badge
                      color="light"
                      className="px-2 py-1"
                      style={{
                        backgroundColor: '#f3f3f2',
                        color: '#157a6e',
                        fontSize: '0.75rem',
                      }}
                    >
                      <i className="fa fa-file-pdf me-1"></i>
                      {fileType}
                    </Badge>
                    {fileSize && (
                      <Badge
                        color="light"
                        className="ms-2 px-2 py-1"
                        style={{
                          backgroundColor: '#f3f3f2',
                          color: '#157a6e',
                          fontSize: '0.75rem',
                        }}
                      >
                        <i className="fa fa-database me-1"></i>
                        {fileSize}
                      </Badge>
                    )}
                  </div>

                  {/* Title */}
                  <h5 className="fw-bold mb-3" style={{ color: '#157a6e' }}>
                    {note.title}
                  </h5>

                  {/* Description */}
                  <p
                    className="text-muted mb-4 flex-grow-1"
                    style={{
                      fontSize: '0.9rem',
                      minHeight: '60px',
                      lineHeight: '1.6',
                    }}
                  >
                    {note.description || 'Comprehensive study material to help you understand key concepts.'}
                  </p>

                  {/* Note Stats (if available) */}
                  {(note.pages || note.downloads) && (
                    <div className="d-flex justify-content-around mb-3 pb-3 border-bottom">
                      {note.pages && (
                        <div className="text-center">
                          <div className="fw-bold" style={{ color: '#157a6e' }}>
                            {note.pages}
                          </div>
                          <small className="text-muted">Pages</small>
                        </div>
                      )}
                      {note.downloads && (
                        <div className="text-center">
                          <div className="fw-bold" style={{ color: '#157a6e' }}>
                            {note.downloads}
                          </div>
                          <small className="text-muted">Downloads</small>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  <Link
                    to={`/view-note-paper/${note.slug}`}
                    className="text-decoration-none"
                  >
                    <Button
                      color="success"
                      className="w-100 fw-bold py-2"
                      style={{
                        backgroundColor: '#157a6e',
                        border: 'none',
                      }}
                    >
                      <i className="fa fa-download me-2"></i>
                      Download Notes
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Browse All Link */}
      <div className="text-center mt-5">
        <Link to="/course-notes" className="text-decoration-none">
          <Button
            color="warning"
            outline
            size="lg"
            className="px-5 py-3 fw-bold"
            style={{
              borderColor: '#ffc107',
              color: '#157a6e',
            }}
          >
            <i className="fa fa-book me-2"></i>
            Browse All Notes
          </Button>
        </Link>
      </div>

      {/* Help Text */}
      <div className="text-center mt-4">
        <small className="text-muted">
          <i className="fa fa-info-circle me-1"></i>
          All study materials are free to download and use
        </small>
      </div>
    </div>
  );
};

export default RelatedNotes;
