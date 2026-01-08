import { Card, CardTitle, CardText } from 'reactstrap';
import { Link } from 'react-router-dom';
import { formatDateTime } from '@/utils/dateFormat';

const NotesPapersItem = ({ note, fromSearch }) => {

  const { slug, title, description, courseCategory, course, chapter, createdAt, } = note;
  const formattedDate = createdAt ? formatDateTime(createdAt) : '';

  return (
    <Card
      body
      className={
        fromSearch
          ? 'note-item bg-info text-white py-3 px-1 px-lg-3 my-2 my-lg-3'
          : 'note-item bg-secondary py-3 px-1 px-lg-3 my-2 my-lg-3'
      }
    >
      <CardTitle
        tag="h5"
        className={`mb-0 ${fromSearch ? 'text-white' : 'text-primary'
          } text-uppercase text-center`}
      >
        <Link to={`/view-note-paper/${slug}`}>{title && title}</Link>
      </CardTitle>

      <CardText className="mt-1 details text-secondary text-capitalize text-center">
        {description && description}
      </CardText>

      <div className="small-text d-flex flex-wrap gap-2">
        <p className="me-2 me-md-5 my-1 text-dark w-100 text-center">
          - {course && course.title}
          <small>&nbsp;({chapter && chapter.title})</small>
        </p>
        <div className="w-100 d-flex justify-content-around">
          <small className="me-2 me-md-5 my-1 text-dark">
            {courseCategory && courseCategory.title}
          </small>
          <small className="me-2 me-md-5 my-1 text-dark">
            {formattedDate === 'Invalid date' ? '' : formattedDate}
          </small>
        </div>
      </div>
    </Card>
  );
};

export default NotesPapersItem;
