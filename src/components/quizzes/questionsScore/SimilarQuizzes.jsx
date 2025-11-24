import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import Unavailable from './Unavailable';

const SimilarQuizzes = ({ thisQuiz }) => {
  const { allcategories, isLoading, error } = useSelector(
    (state) => state.categories
  );

  const categoryId = thisQuiz?.category?._id;
  const thisCat =
    allcategories && allcategories?.find((c) => c._id === categoryId);
  const thisCatQuizzes = thisCat?.quizes
    ? thisCat?.quizes
    : thisCat?.quizzes
      ? thisCat?.quizzes
      : [];

  if (isLoading) return <p className="text-center my-3">Loading categories...</p>;
  if (error) return <p className="text-center my-3 text-danger">Error: {error}</p>;

  const filteredQuizzes = thisCatQuizzes?.filter(qz => qz._id !== thisQuiz?._id);

  return filteredQuizzes?.length > 0 ? (
    <Row className="similar-quizzes mx-2 mx-sm-3 w-100">
      <h4 className="text-center col-12 mb-4 fw-bolder text-uppercase border-bottom pb-2">
        Other quizzes you might like
      </h4>
      {filteredQuizzes
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((quiz) => (
          <Col sm="12" md="6" lg="4" key={quiz._id} className="my-2 my-sm-4 d-flex">
            <Card body className="flex-fill shadow-sm border-0 rounded">
              <CardTitle tag="h5" className="text-uppercase mb-2">
                {quiz.title} ({quiz.questions?.length})
              </CardTitle>
              <CardText className="text-muted mb-3">{quiz.description}</CardText>
              <Button color="success" className="w-100">
                <Link to={`/view-quiz/${quiz.slug}`} className="text-white text-decoration-none w-100 d-block text-center">
                  Attempt
                </Link>
              </Button>
            </Card>
          </Col>
        ))}
    </Row>
  ) : (
    <Unavailable
      title="No related quizzes available yet"
      link="/all-quizzes"
      more="quizzes"
    />
  );
};

export default SimilarQuizzes;
