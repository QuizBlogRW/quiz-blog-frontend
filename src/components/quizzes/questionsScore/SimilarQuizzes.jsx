import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap'
import Unavailable from './Unavailable'

const SimilarQuizzes = ({ thisQuiz }) => {

    const { allcategories, isLoading, error } = useSelector(state => state.categories);

    const categoryId = thisQuiz?.category?._id
    const thisQuizID = thisQuiz?._id
    const thisCat = allcategories && allcategories?.find(c => c._id === categoryId)

    if (isLoading) return <p>Loading categories...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        thisCat?.quizzes?.filter(qz => qz._id !== thisQuizID)?.length > 0 ?
            <>
                {
                    <Row className="similar-quizzes mx-sm-3 w-100">
                        <h4 className="text-center col-12 mb-4 ms-1 fw-bolder text-uppercase text-underline">
                            Other quizzes that might interest you
                        </h4>
                        {
                            thisCat?.quizzes &&
                            Array.from(thisCat.quizzes)
                                .filter(q => q._id !== thisQuizID)
                                .sort(() => 0.5 - Math.random())
                                .map(quiz => (
                                    <Col sm="4" key={quiz._id} className="my-1 my-sm-4">
                                        <Card body>
                                            <CardTitle tag="h5" className="text-uppercase">
                                                {quiz.title} ({quiz.questions?.length})
                                            </CardTitle>
                                            <CardText>{quiz.description}</CardText>
                                            <Button color="info">
                                                <Link to={`/view-quiz/${quiz.slug}`} className="text-white">
                                                    Attempt
                                                </Link>
                                            </Button>
                                        </Card>
                                    </Col>
                                )).slice(0, 3)}
                    </Row>
                }
            </> :
            <Unavailable title='No related quizzes available yet' link='/allposts' more='quizzes' />
    )
}

export default SimilarQuizzes
