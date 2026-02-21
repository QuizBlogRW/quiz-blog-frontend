import { Card, CardTitle, CardText } from 'reactstrap';
import { Link } from 'react-router-dom';
import { formatDateTime } from '@/utils/dateFormat';

const QuizItem = ({ quiz, fromSearch }) => {
  const { slug, title, description, creation_date, category, questions } = quiz;
  const formattedDate = creation_date ? formatDateTime(creation_date) : '';

  return (
    <Card
      body
      className={`post-item my-2 my-sm-3 border shadow-sm rounded d-flex flex-column ${fromSearch ? 'bg-info text-white' : 'bg-light text-dark'}`}
      style={{ transition: 'transform 0.2s', cursor: 'pointer', minHeight: '180px' }}
    >
      {/* Title */}
      <CardTitle
        tag="h5"
        className={`mb-2 text-uppercase text-center fw-bold ${fromSearch ? 'text-white' : 'text-primary'}`}
      >
        <Link
          to={`/view-quiz/${slug}`}
          className={`text-decoration-none ${fromSearch ? 'text-white' : 'text-primary'}`}
        >
          {title}
          <span className="fw-bolder text-dark"> ({questions?.length || 0})</span>
        </Link>
      </CardTitle>

      {/* Category */}
      <div className="d-flex justify-content-center mb-2">
        <small className="text-muted">
          - {category?.title || 'Uncategorized'}
        </small>
      </div>

      {/* Description */}
      <CardText
        className="text-secondary details text-center flex-grow-1"
        style={{ minHeight: '3rem' }}
      >
        {description || 'No description available.'}
      </CardText>

      {/* Date */}
      <div className="d-flex justify-content-center mt-auto">
        <small className="text-muted">
          {formattedDate !== 'Invalid date' ? formattedDate : ''}
        </small>
      </div>
    </Card>
  );
};

export default QuizItem;
