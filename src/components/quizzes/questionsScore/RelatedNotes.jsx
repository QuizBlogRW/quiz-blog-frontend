import { useEffect, useMemo } from 'react';
import { Card, CardBody, Button, Row, Col, Badge } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getNotesByCCatg } from '@/redux/slices/notesSlice';
import Unavailable from './Unavailable';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';

// Constants
const MAX_DISPLAYED_NOTES = 3;
const BRAND_COLOR = '#157a6e';
const ACCENT_COLOR = '#ffc107';

// Helper Functions
const shuffleArray = (array) => {
  return [...array].sort(() => 0.5 - Math.random());
};

const getFileType = (note) => {
  return note.fileType || 'PDF';
};

const getFileSize = (note) => {
  if (!note.fileSize) return null;
  const sizeInMB = (note.fileSize / (1024 * 1024)).toFixed(1);
  return `${sizeInMB} MB`;
};

const getFileIcon = (fileType) => {
  const iconMap = {
    PDF: 'fa-file-pdf',
    DOC: 'fa-file-word',
    DOCX: 'fa-file-word',
    PPT: 'fa-file-powerpoint',
    PPTX: 'fa-file-powerpoint',
    XLS: 'fa-file-excel',
    XLSX: 'fa-file-excel',
  };
  return iconMap[fileType?.toUpperCase()] || 'fa-file-alt';
};

// Section Header Component
const SectionHeader = () => (
  <div className="text-center mb-4 mb-md-5 px-2">
    <h4
      className="fw-bold mb-2 mb-sm-3 fs-5 fs-md-4"
      style={{ color: BRAND_COLOR }}
    >
      <i className="fa fa-book-open me-2"></i>
      <span className="d-none d-sm-inline">Helpful Study Resources</span>
      <span className="d-inline d-sm-none">Study Resources</span>
    </h4>
    <p className="text-muted mb-0 fs-6 fs-sm-5">
      <span className="d-none d-sm-inline">
        Notes and materials to help you learn better
      </span>
      <span className="d-inline d-sm-none">
        Free study materials
      </span>
    </p>
    <hr
      className="my-3 my-sm-4 mx-auto"
      style={{ maxWidth: '200px', opacity: '0.3' }}
    />
  </div>
);

// File Badges Component
const FileBadges = ({ fileType, fileSize }) => {
  const icon = getFileIcon(fileType);

  return (
    <div className="mb-2 d-flex flex-wrap gap-2">
      <Badge
        color="light"
        className="px-2 py-1"
        style={{
          backgroundColor: '#f3f3f2',
          color: BRAND_COLOR,
          fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
        }}
      >
        <i className={`fa ${icon} me-1`}></i>
        {fileType}
      </Badge>
      {fileSize && (
        <Badge
          color="light"
          className="px-2 py-1"
          style={{
            backgroundColor: '#f3f3f2',
            color: BRAND_COLOR,
            fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
          }}
        >
          <i className="fa fa-database me-1"></i>
          <span className="d-none d-sm-inline">{fileSize}</span>
          <span className="d-inline d-sm-none">
            {fileSize.replace(' MB', 'MB')}
          </span>
        </Badge>
      )}
    </div>
  );
};

// Note Stats Component
const NoteStats = ({ pages, downloads }) => {
  if (!pages && !downloads) return null;

  return (
    <div className="d-flex justify-content-around mb-3 pb-3 border-bottom">
      {pages && (
        <div className="text-center flex-fill">
          <div
            className="fw-bold fs-6 fs-sm-5"
            style={{ color: BRAND_COLOR }}
          >
            {pages}
          </div>
          <small
            className="text-muted"
            style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)' }}
          >
            Pages
          </small>
        </div>
      )}
      {downloads && (
        <div
          className={`text-center flex-fill ${pages ? 'border-start ps-2' : ''}`}
        >
          <div
            className="fw-bold fs-6 fs-sm-5"
            style={{ color: BRAND_COLOR }}
          >
            {downloads}
          </div>
          <small
            className="text-muted"
            style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)' }}
          >
            <span className="d-none d-sm-inline">Downloads</span>
            <span className="d-inline d-sm-none">DLs</span>
          </small>
        </div>
      )}
    </div>
  );
};

// Note Card Component
const NoteCard = ({ note, index }) => {
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
        <CardBody className="d-flex flex-column p-3 p-sm-4">
          {/* File Type & Size Badges */}
          <FileBadges fileType={fileType} fileSize={fileSize} />

          {/* Title */}
          <h5
            className="fw-bold mb-2 mb-sm-3 fs-6 fs-sm-5"
            style={{
              color: BRAND_COLOR,
              lineHeight: '1.4',
            }}
          >
            {note.title}
          </h5>

          {/* Description */}
          <p
            className="text-muted mb-3 mb-sm-4 flex-grow-1"
            style={{
              fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem)',
              minHeight: '60px',
              lineHeight: '1.6',
            }}
          >
            {note.description || 'Comprehensive study material to help you understand key concepts.'}
          </p>

          {/* Note Stats */}
          <NoteStats pages={note.pages} downloads={note.downloads} />

          {/* Action Button */}
          <Link
            to={`/view-note-paper/${note.slug}`}
            className="text-decoration-none"
          >
            <Button
              color="success"
              className="w-100 fw-bold py-2"
              style={{
                backgroundColor: BRAND_COLOR,
                border: 'none',
                transition: 'all 0.2s ease-in-out',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
              }}
            >
              <i className="fa fa-download me-2"></i>
              <span className="d-none d-sm-inline">Download Notes</span>
              <span className="d-inline d-sm-none">Download</span>
            </Button>
          </Link>
        </CardBody>
      </Card>
    </Col>
  );
};

// Browse All Button Component
const BrowseAllButton = () => (
  <div className="text-center mt-4 mt-sm-5 px-2">
    <Link to="/course-notes" className="text-decoration-none">
      <Button
        color="warning"
        outline
        size="lg"
        className="px-4 px-sm-5 py-2 py-sm-3 fw-bold"
        style={{
          borderColor: ACCENT_COLOR,
          color: BRAND_COLOR,
          transition: 'all 0.2s ease-in-out',
          fontSize: 'clamp(0.875rem, 2vw, 1rem)',
        }}
      >
        <i className="fa fa-book me-2"></i>
        <span className="d-none d-sm-inline">Browse All Notes</span>
        <span className="d-inline d-sm-none">All Notes</span>
      </Button>
    </Link>
  </div>
);

// Help Text Component
const HelpText = () => (
  <div className="text-center mt-3 mt-sm-4 px-2">
    <small
      className="text-muted"
      style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)' }}
    >
      <i className="fa fa-info-circle me-1"></i>
      <span className="d-none d-sm-inline">
        All study materials are free to download and use
      </span>
      <span className="d-inline d-sm-none">
        Free downloads
      </span>
    </small>
  </div>
);

// Loading State Component
const LoadingState = () => (
  <div className="text-center py-5">
    <QBLoadingSM />
    <p
      className="text-muted mt-3"
      style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
    >
      <span className="d-none d-sm-inline">Loading related notes...</span>
      <span className="d-inline d-sm-none">Loading...</span>
    </p>
  </div>
);

// Main Component
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
    if (!notesByCCatg?.length) return [];

    return shuffleArray(notesByCCatg).slice(0, MAX_DISPLAYED_NOTES);
  }, [notesByCCatg]);

  // Loading state
  if (isByCCatgLoading) {
    return <LoadingState />;
  }

  // No notes available
  if (!displayedNotes.length) {
    return (
      <div className="my-4 my-sm-5">
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
    <div className="related-notes my-4 my-sm-5 px-2 px-md-3">
      {/* Section Header */}
      <SectionHeader />

      {/* Notes Cards */}
      <Row className="g-3 g-md-4">
        {displayedNotes.map((note, index) => (
          <NoteCard key={note._id || index} note={note} index={index} />
        ))}
      </Row>

      {/* Browse All Link */}
      <BrowseAllButton />

      {/* Help Text */}
      <HelpText />
    </div>
  );
};

export default RelatedNotes;