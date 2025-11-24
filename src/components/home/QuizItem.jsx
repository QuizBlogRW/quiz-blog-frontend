import { Card, CardTitle, CardText } from 'reactstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';

const QuizItem = ({ quiz, fromSearch }) => {
  const { slug, title, description, creation_date, category, questions } = quiz;
  const formattedDate = moment(new Date(creation_date)).format('DD MMM YYYY, HH:mm');

  return (
    <Card
      body
      className={`post-item my-2 my-sm-3 border shadow-sm rounded ${fromSearch ? 'bg-info text-white' : 'bg-light text-dark'
        }`}
      style={{ transition: 'transform 0.2s', cursor: 'pointer' }}
    >
      {/* Title */}
      <CardTitle
        tag="h5"
        className={`mb-2 text-uppercase text-center fw-bold ${fromSearch ? 'text-white' : 'text-primary'
          }`}
      >
        <Link
          to={`/view-quiz/${slug}`}
          className={`text-decoration-none ${fromSearch ? 'text-white' : 'text-primary'
            }`}
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
      <CardText className="text-secondary details text-center text-truncate" style={{ maxHeight: '3rem', overflow: 'hidden' }}>
        {description || 'No description available.'}
      </CardText>

      {/* Date */}
      <div className="d-flex justify-content-center">
        <small className="text-muted">
          {formattedDate !== 'Invalid date' ? formattedDate : ''}
        </small>
      </div>
    </Card>
  );
};

export default QuizItem;
