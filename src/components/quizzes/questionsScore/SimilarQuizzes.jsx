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

  if (isLoading) return <p>Loading categories...</p>;
  if (error) return <p>Error: {error}</p>;

  return thisCatQuizzes?.filter((qz) => qz._id !== thisQuiz?._id)?.length >
    0 ? (
    <>
      {
        <Row className="similar-quizzes mx-sm-3 w-100">
          <h4 className="text-center col-12 mb-4 ms-1 fw-bolder text-uppercase text-underline">
            Other quizzes that might interest you
          </h4>
          {thisCatQuizzes &&
            Array.from(thisCatQuizzes)
              .filter((q) => q._id !== thisQuiz?._id)
              ?.sort(() => 0.5 - Math.random())
              .map((quiz) => (
                <Col sm="4" key={quiz._id} className="my-1 my-sm-4">
                  <Card body>
                    <CardTitle tag="h5" className="text-uppercase">
                      {quiz.title} ({quiz.questions?.length})
                    </CardTitle>
                    <CardText>{quiz.description}</CardText>
                    <Button color="success">
                      <Link
                        to={`/view-quiz/${quiz.slug}`}
                        className="text-white"
                      >
                        Attempt
                      </Link>
                    </Button>
                  </Card>
                </Col>
              ))
              .slice(0, 3)}
        </Row>
      }
    </>
  ) : (
    <Unavailable
      title="No related quizzes available yet"
      link="/all-quizzes"
      more="quizzes"
    />
  );
};

export default SimilarQuizzes;
